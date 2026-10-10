"use client";

import React, { useEffect, useRef, useState } from "react";
import { apiRequest, SkillItem } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Network, RotateCcw, ZoomIn, ZoomOut, AlertCircle } from "lucide-react";

interface Node3D {
  name: string;
  category: string;
  proficiency: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
}

export default function SkillNetworkPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D rotation angles and zoom
  const [angleX, setAngleX] = useState(0.3);
  const [angleY, setAngleY] = useState(0.4);
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    apiRequest<SkillItem[]>("/student/skills")
      .then((data) => setSkills(data))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!canvasRef.current || skills.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate 3D coordinates on a sphere/cluster based on skills
    const total = skills.length;
    const nodes: Node3D[] = skills.map((s, i) => {
      const phi = Math.acos(-1 + (2 * i) / Math.max(total, 1));
      const theta = Math.sqrt(total * Math.PI) * phi;
      const radiusSphere = 140;

      const profColors: Record<string, string> = {
        EXPERT: "#5555A5",
        ADVANCED: "#46468E",
        INTERMEDIATE: "#191919",
        BEGINNER: "#77756F",
      };

      const profRadii: Record<string, number> = {
        EXPERT: 10,
        ADVANCED: 8,
        INTERMEDIATE: 6,
        BEGINNER: 5,
      };

      return {
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        x: radiusSphere * Math.cos(theta) * Math.sin(phi),
        y: radiusSphere * Math.sin(theta) * Math.sin(phi),
        z: radiusSphere * Math.cos(phi),
        radius: profRadii[s.proficiency] || 6,
        color: profColors[s.proficiency] || "#5555A5",
      };
    });

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 350;

      // Project 3D to 2D
      const projected = nodes.map((node) => {
        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = node.x * cosY + node.z * sinY;
        const z1 = -node.x * sinY + node.z * cosY;

        // Rotate around X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        // Perspective scale
        const scale = (fov / (fov + z2)) * zoom;
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        return {
          ...node,
          px,
          py,
          scale,
          z2,
        };
      });

      // Sort nodes by depth for correct painter's rendering
      projected.sort((a, b) => a.z2 - b.z2);

      // Draw connecting edges
      ctx.strokeStyle = "#DFDDD6";
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dz = projected[i].z - projected[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projected.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.px, node.py, Math.max(node.radius * node.scale, 2), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Label
        ctx.font = `${Math.max(10 * node.scale, 8)}px sans-serif`;
        ctx.fillStyle = "#191919";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.px, node.py + node.radius * node.scale + 12);
      });
    };

    render();
  }, [skills, angleX, angleY, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setAngleY((prev) => prev + dx * 0.01);
    setAngleX((prev) => prev - dy * 0.01);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            Interactive 3D Skill Network
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            Topological projection of your verified technical competencies. Drag to rotate, zoom to inspect.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}>
            <ZoomIn className="w-3.5 h-3.5 mr-1" />
            <span>Zoom In</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}>
            <ZoomOut className="w-3.5 h-3.5 mr-1" />
            <span>Zoom Out</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setAngleX(0.3);
              setAngleY(0.4);
              setZoom(1);
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse flex items-center justify-center text-xs text-[#77756F]">
          Loading 3D network...
        </div>
      ) : skills.length === 0 ? (
        <EmptyState
          icon={<Network className="w-8 h-8 text-[#5555A5]" />}
          title="No Skills Registered for Graph"
          description="Register skills in your profile to render your 3D competence network."
          actionLabel="Add Skills"
          onAction={() => window.location.href = "/dashboard/student/skills"}
        />
      ) : (
        <Card className="p-0 overflow-hidden relative cursor-grab active:cursor-grabbing bg-[#FFFFFF]">
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 text-[11px] text-[#77756F] bg-[#FFFFFF]/80 backdrop-blur-sm p-2 rounded border border-[#DFDDD6]">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5555A5]"></span>
              <span>Advanced/Expert</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#191919]"></span>
              <span>Intermediate</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#77756F]"></span>
              <span>Beginner</span>
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={760}
            height={460}
            className="w-full h-auto block select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </Card>
      )}
    </div>
  );
}

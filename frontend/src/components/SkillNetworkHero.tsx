"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Compass, RotateCcw, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  group: "skill" | "project" | "student" | "credential";
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  subtitle: string;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  label: string;
}

const INITIAL_NODES: GraphNode[] = [
  { id: "student", label: "Student Profile", group: "student", x: 0, y: 0, z: 0, radius: 9, color: "#191919", subtitle: "Verified Candidate" },
  { id: "java", label: "Java 21", group: "skill", x: -110, y: -60, z: 40, radius: 7, color: "#5555A5", subtitle: "Core Language" },
  { id: "spring", label: "Spring Boot", group: "skill", x: -70, y: 65, z: -30, radius: 7.5, color: "#5555A5", subtitle: "Enterprise Backend" },
  { id: "microservices", label: "Microservices", group: "skill", x: -140, y: 30, z: 80, radius: 6.5, color: "#5555A5", subtitle: "Architecture" },
  { id: "mysql", label: "MySQL 8", group: "skill", x: 40, y: -100, z: -50, radius: 6, color: "#77756F", subtitle: "Relational DB" },
  { id: "docker", label: "Docker", group: "skill", x: -40, y: -80, z: 100, radius: 6.5, color: "#5555A5", subtitle: "Containerization" },
  { id: "react", label: "React", group: "skill", x: 120, y: -40, z: 50, radius: 7, color: "#5555A5", subtitle: "UI Architecture" },
  { id: "ts", label: "TypeScript", group: "skill", x: 140, y: 60, z: -20, radius: 6.5, color: "#77756F", subtitle: "Typed Systems" },
  { id: "next", label: "Next.js", group: "skill", x: 80, y: 90, z: 70, radius: 6.5, color: "#5555A5", subtitle: "App Router" },
  { id: "project", label: "FinTech Engine", group: "project", x: -10, y: 120, z: -40, radius: 8, color: "#3B82F6", subtitle: "Production Project" },
  { id: "cert", label: "SHA-256 Ledger Record", group: "credential", x: 70, y: -30, z: -110, radius: 8, color: "#D97706", subtitle: "Tamper-Evident Block" }
];

const INITIAL_EDGES: GraphEdge[] = [
  { source: "student", target: "java", weight: 1.0, label: "Proficiency: Advanced" },
  { source: "student", target: "react", weight: 1.0, label: "Proficiency: Intermediate" },
  { source: "student", target: "project", weight: 1.0, label: "Demonstrated Code" },
  { source: "student", target: "cert", weight: 1.0, label: "Cryptographic Anchor" },
  { source: "java", target: "spring", weight: 1.0, label: "Framework foundation" },
  { source: "spring", target: "microservices", weight: 1.2, label: "Service architecture" },
  { source: "spring", target: "mysql", weight: 1.0, label: "JPA Persistence" },
  { source: "spring", target: "docker", weight: 1.2, label: "Container image" },
  { source: "react", target: "ts", weight: 0.9, label: "Type safety" },
  { source: "react", target: "next", weight: 1.0, label: "SSR runtime" },
  { source: "project", target: "spring", weight: 1.0, label: "Implemented in" },
  { source: "project", target: "mysql", weight: 1.0, label: "Database store" },
  { source: "cert", target: "java", weight: 1.0, label: "Oracle Certified" }
];

export function SkillNetworkHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(INITIAL_NODES[1]); // Default Java
  const [isRotating, setIsRotating] = useState(true);
  const [livePathway, setLivePathway] = useState<string | null>("Java → Spring Boot → Microservices");

  // Rotation angles
  const angleXRef = useRef<number>(0.25);
  const angleYRef = useRef<number>(-0.45);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Projected node cache for raycasting
  const projectedNodesRef = useRef<{ node: GraphNode; px: number; py: number; scale: number }[]>([]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (media.matches) {
        setIsRotating(false);
      }
    }
  }, []);

  // Fetch live backend pathway if available
  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:8080/api/skills/pathway?from=Java&to=Microservices")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Local backend offline");
      })
      .then((data) => {
        if (isMounted && data?.pathNodes) {
          setLivePathway(data.pathNodes.join(" → "));
        }
      })
      .catch(() => {
        // Safe fallback already set
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      angleYRef.current += deltaX * 0.008;
      angleXRef.current += deltaY * 0.008;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    // Hit-testing hovered node
    let closest: GraphNode | null = null;
    let minDistance = 22; // px tolerance

    for (const item of projectedNodesRef.current) {
      const dist = Math.hypot(mouseX - item.px, mouseY - item.py);
      if (dist < minDistance) {
        minDistance = dist;
        closest = item.node;
      }
    }

    setHoveredNode(closest);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was lost
    }

    if (hoveredNode) {
      setSelectedNode(hoveredNode);
    }
  };

  const resetOrientation = useCallback(() => {
    angleXRef.current = 0.25;
    angleYRef.current = -0.45;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      if (isRotating && !isDraggingRef.current) {
        angleYRef.current += 0.0035;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 340;

      const cosX = Math.cos(angleXRef.current);
      const sinX = Math.sin(angleXRef.current);
      const cosY = Math.cos(angleYRef.current);
      const sinY = Math.sin(angleYRef.current);

      // Project nodes in 3D
      const projected = INITIAL_NODES.map((node) => {
        // Y rotation
        let x1 = node.x * cosY + node.z * sinY;
        let y1 = node.y;
        let z1 = -node.x * sinY + node.z * cosY;

        // X rotation
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        const distance = 420;
        const scale = fov / (fov + z2 + distance);
        const px = cx + x2 * scale;
        const py = cy + y2 * scale;

        return { node, px, py, scale, z: z2 };
      });

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);
      projectedNodesRef.current = projected;

      const nodePosMap = new Map<string, { px: number; py: number; scale: number }>();
      projected.forEach((p) => nodePosMap.set(p.node.id, p));

      // Draw Edges
      INITIAL_EDGES.forEach((edge) => {
        const from = nodePosMap.get(edge.source);
        const to = nodePosMap.get(edge.target);
        if (!from || !to) return;

        const isHighlighted =
          (hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target)) ||
          (selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target));

        ctx.beginPath();
        ctx.moveTo(from.px, from.py);
        ctx.lineTo(to.px, to.py);

        if (isHighlighted) {
          ctx.strokeStyle = "rgba(85, 85, 165, 0.75)";
          ctx.lineWidth = 1.8;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = "rgba(223, 221, 214, 0.85)";
          ctx.lineWidth = 1.0;
          ctx.setLineDash([3, 4]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Nodes
      projected.forEach(({ node, px, py, scale }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        const radius = Math.max(3.5, node.radius * scale * (isHovered || isSelected ? 1.35 : 1.0));

        // Outer halo for selected or hovered
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(px, py, radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(85, 85, 165, 0.12)";
          ctx.fill();
        }

        // Base node circle
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node border
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Labels
        const fontSize = Math.max(9, Math.min(12, Math.round(11 * scale)));
        ctx.font = `${isSelected ? "600" : "500"} ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const textY = py + radius + 4;

        // Label pill background for clarity
        const textMetrics = ctx.measureText(node.label);
        const padX = 4;
        const padY = 2;
        ctx.fillStyle = "rgba(248, 247, 243, 0.88)";
        ctx.fillRect(
          px - textMetrics.width / 2 - padX,
          textY - padY,
          textMetrics.width + padX * 2,
          fontSize + padY * 2
        );

        ctx.fillStyle = isSelected ? "#191919" : isHovered ? "#5555A5" : "#55524C";
        ctx.fillText(node.label, px, textY);
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isRotating, hoveredNode, selectedNode]);

  return (
    <div className="relative w-full rounded-[6px] border border-[#DFDDD6] bg-[#FFFFFF] overflow-hidden flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Visual Header bar */}
      <div className="px-5 py-3 border-b border-[#DFDDD6] flex items-center justify-between text-xs text-[#77756F] bg-[#FAF9F6]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#5555A5] animate-pulse"></span>
          <span className="font-mono tracking-tight font-medium text-[#191919]">
            SKILL_NETWORK // TOPOLOGICAL PREVIEW
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className="px-2.5 py-1 rounded-[3px] border border-[#DFDDD6] bg-[#FFFFFF] hover:bg-[#F2F0EA] transition-colors text-[11px] font-medium text-[#191919]"
            title={isRotating ? "Pause rotation" : "Resume auto-rotation"}
          >
            {isRotating ? "Pause Orbit" : "Auto Orbit"}
          </button>
          <button
            onClick={resetOrientation}
            className="p-1 rounded-[3px] border border-[#DFDDD6] bg-[#FFFFFF] hover:bg-[#F2F0EA] transition-colors text-[#77756F] hover:text-[#191919]"
            title="Reset camera view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Canvas Element */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-[#FCFCFB] cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block touch-none"
        />

        {/* Floating Instruction overlay */}
        <div className="absolute top-3 left-4 pointer-events-none text-[11px] text-[#77756F] font-mono flex items-center space-x-1.5">
          <Compass className="w-3.5 h-3.5 text-[#5555A5]" />
          <span>Drag to orbit • Hover or click nodes to inspect</span>
        </div>

        {/* Live Pathway calculation pill */}
        {livePathway && (
          <div className="absolute bottom-3 left-4 right-4 sm:right-auto pointer-events-none">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-[4px] bg-[#FFFFFF]/95 border border-[#DFDDD6] text-[11px] text-[#191919] shadow-sm">
              <span className="font-mono text-[#5555A5] font-semibold text-[10px]">DIJKSTRA_PATH</span>
              <span className="text-[#77756F]">|</span>
              <span className="font-medium truncate">{livePathway}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Detail Drawer */}
      <div className="px-5 py-3.5 border-t border-[#DFDDD6] bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {selectedNode ? (
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedNode.color }}
            />
            <div>
              <span className="font-semibold text-[#191919]">{selectedNode.label}</span>
              <span className="text-[#77756F] ml-2">({selectedNode.subtitle})</span>
            </div>
          </div>
        ) : (
          <span className="text-[#77756F]">Click any node on the graph to inspect relationships</span>
        )}

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-[#77756F]">Verified by SHA-256 Ledger:</span>
          <Link
            href="/verify"
            className="font-medium text-[#5555A5] hover:underline inline-flex items-center"
          >
            <span>Verify Public Record</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

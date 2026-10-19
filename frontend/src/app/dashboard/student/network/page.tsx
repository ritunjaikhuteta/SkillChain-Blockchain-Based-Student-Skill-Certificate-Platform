"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Award,
  BookOpen,
  ArrowRight,
  Code2,
  Database,
  Globe,
  Cpu,
  Layers,
  BarChart2,
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  category: "skill" | "project" | "certificate" | "course";
  description: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  glowColor: string;
  icon: string;
  relatedSkills: string[];
}

const DEFAULT_NODES: NodeData[] = [
  {
    id: "python",
    name: "Python",
    category: "skill",
    description: "Programming language for data science, web development and automation.",
    x: 0,
    y: 0,
    z: 0,
    radius: 28,
    color: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.6)",
    icon: "cap",
    relatedSkills: ["Data Science", "Pandas", "NumPy", "Machine Learning"],
  },
  {
    id: "ml",
    name: "Machine Learning",
    category: "skill",
    description: "Algorithmic model training, regression, neural networks, and pattern recognition.",
    x: 120,
    y: -140,
    z: 40,
    radius: 18,
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.6)",
    icon: "cpu",
    relatedSkills: ["Python", "Pandas", "NumPy", "Data Science"],
  },
  {
    id: "datascience",
    name: "Data Science",
    category: "project",
    description: "End-to-end data pipeline extraction, transformation, feature engineering and EDA.",
    x: 210,
    y: -40,
    z: -30,
    radius: 20,
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.6)",
    icon: "chart",
    relatedSkills: ["Python", "SQL", "Data Analysis", "Machine Learning"],
  },
  {
    id: "webdev",
    name: "Web Development",
    category: "project",
    description: "Full-stack web application development, responsive layouts, API integration.",
    x: 220,
    y: 80,
    z: 20,
    radius: 18,
    color: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.6)",
    icon: "globe",
    relatedSkills: ["React", "Python", "SQL"],
  },
  {
    id: "react",
    name: "React",
    category: "skill",
    description: "Declarative component-driven frontend architecture and state management.",
    x: 240,
    y: 190,
    z: -40,
    radius: 16,
    color: "#A855F7",
    glowColor: "rgba(168, 85, 247, 0.6)",
    icon: "code",
    relatedSkills: ["Web Development", "Python"],
  },
  {
    id: "sql",
    name: "SQL",
    category: "certificate",
    description: "Relational database modeling, complex JOINs, query indexing and transactions.",
    x: 100,
    y: 140,
    z: 50,
    radius: 18,
    color: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.6)",
    icon: "db",
    relatedSkills: ["Python", "Data Analysis", "Data Science"],
  },
  {
    id: "dataanalysis",
    name: "Data Analysis",
    category: "course",
    description: "Exploratory statistics, hypothesis testing, insights discovery, and storytelling.",
    x: -10,
    y: 160,
    z: -50,
    radius: 18,
    color: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.6)",
    icon: "chart",
    relatedSkills: ["Python", "SQL", "Pandas"],
  },
  {
    id: "numpy",
    name: "NumPy",
    category: "certificate",
    description: "N-dimensional array calculations, vectorization, linear algebra routines.",
    x: -150,
    y: 70,
    z: 30,
    radius: 16,
    color: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.6)",
    icon: "layers",
    relatedSkills: ["Python", "Pandas", "Machine Learning"],
  },
  {
    id: "pandas",
    name: "Pandas",
    category: "skill",
    description: "Dataframe manipulation, data cleaning, slicing, joining, time-series operations.",
    x: -120,
    y: -80,
    z: -20,
    radius: 18,
    color: "#14B8A6",
    glowColor: "rgba(20, 184, 166, 0.6)",
    icon: "layers",
    relatedSkills: ["Python", "NumPy", "Data Science"],
  },
];

const CONNECTIONS = [
  ["python", "ml"],
  ["python", "datascience"],
  ["python", "webdev"],
  ["python", "sql"],
  ["python", "dataanalysis"],
  ["python", "numpy"],
  ["python", "pandas"],
  ["webdev", "react"],
  ["datascience", "sql"],
  ["datascience", "ml"],
  ["pandas", "numpy"],
  ["dataanalysis", "sql"],
];

export default function SkillNetworkPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData>(DEFAULT_NODES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // 3D angles & interactive camera
  const [angleX, setAngleX] = useState(-0.15);
  const [angleY, setAngleY] = useState(0.2);
  const [zoom, setZoom] = useState(1.1);
  const [isRotating, setIsRotating] = useState(true);

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const filteredNodes = DEFAULT_NODES.filter((n) => {
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || n.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Select node by name helper
  const handleSelectNodeByName = (name: string) => {
    const found = DEFAULT_NODES.find((n) => n.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setSelectedNode(found);
    }
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Dynamic canvas sizing
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400 * zoom;

      // Dark cosmos background with ambient depth
      ctx.fillStyle = "#050A18";
      ctx.fillRect(0, 0, width, height);

      // Subtle starfield points
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 12345) % width);
        const sy = ((i * 67890) % height);
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      // Coordinate Grid Lines (Perspective background)
      ctx.strokeStyle = "rgba(30, 58, 95, 0.18)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3D rotation transform function
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const distance = fov + z2;
        const scale = fov / Math.max(distance, 50);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        return { px, py, scale, z: z2 };
      };

      // Project all nodes
      const projected = DEFAULT_NODES.map((n) => {
        const { px, py, scale, z } = project(n.x, n.y, n.z);
        return { ...n, px, py, scale, z };
      });

      // Sort nodes by Z depth for realistic occlusion
      const nodeMap = new Map(projected.map((p) => [p.id, p]));

      // Draw Connection lines with glowing gradients
      CONNECTIONS.forEach(([fromId, toId]) => {
        const p1 = nodeMap.get(fromId);
        const p2 = nodeMap.get(toId);
        if (!p1 || !p2) return;

        const isConnectedToSelected =
          p1.id === selectedNode.id || p2.id === selectedNode.id;

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);

        if (isConnectedToSelected) {
          ctx.strokeStyle = "rgba(59, 130, 246, 0.65)";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "#3B82F6";
          ctx.shadowBlur = 10;
        } else {
          ctx.strokeStyle = "rgba(71, 85, 105, 0.35)";
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Orbit Halo Ring around Central Python Node
      const centerNode = nodeMap.get("python");
      if (centerNode) {
        ctx.beginPath();
        ctx.arc(centerNode.px, centerNode.py, centerNode.radius * centerNode.scale * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Nodes in depth order
      projected.sort((a, b) => a.z - b.z);

      projected.forEach((node) => {
        const r = Math.max(node.radius * node.scale, 8);
        const isSelected = node.id === selectedNode.id;

        // Outer Glow
        const glowRadius = isSelected ? r * 2.2 : r * 1.5;
        const radialGrad = ctx.createRadialGradient(node.px, node.py, r * 0.5, node.px, node.py, glowRadius);
        radialGrad.addColorStop(0, node.glowColor);
        radialGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(node.px, node.py, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node Solid Sphere
        ctx.beginPath();
        ctx.arc(node.px, node.py, r, 0, Math.PI * 2);
        const sphereGrad = ctx.createRadialGradient(
          node.px - r * 0.3,
          node.py - r * 0.3,
          r * 0.1,
          node.px,
          node.py,
          r
        );
        sphereGrad.addColorStop(0, "#FFFFFF");
        sphereGrad.addColorStop(0.3, node.color);
        sphereGrad.addColorStop(1, "#0A1128");
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // High-contrast Node Border
        ctx.strokeStyle = isSelected ? "#FFFFFF" : node.color;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Node Label with Pill Background
        const labelText = node.name;
        ctx.font = `600 ${Math.max(10, Math.round(11 * node.scale))}px Inter, system-ui, sans-serif`;
        const textMetrics = ctx.measureText(labelText);
        const labelPadding = 6;
        const labelWidth = textMetrics.width + labelPadding * 2;
        const labelHeight = 18;
        const labelY = node.py + r + 8;

        // Label Background
        ctx.fillStyle = isSelected ? "rgba(37, 99, 235, 0.9)" : "rgba(15, 23, 42, 0.85)";
        ctx.beginPath();
        ctx.roundRect(node.px - labelWidth / 2, labelY, labelWidth, labelHeight, 6);
        ctx.fill();
        ctx.strokeStyle = isSelected ? "#60A5FA" : "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label Text
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labelText, node.px, labelY + labelHeight / 2);
      });

      // Auto gentle rotate if idle
      if (isRotating && !isDragging.current) {
        setAngleY((prev) => prev + 0.002);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [angleX, angleY, zoom, isRotating, selectedNode]);

  // Handle Canvas Mouse / Touch Drag to Rotate & Click to Select
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setAngleY((prev) => prev + dx * 0.006);
    setAngleX((prev) => Math.max(-1.2, Math.min(1.2, prev + dy * 0.006)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check click hit test
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fov = 400 * zoom;

    for (const node of DEFAULT_NODES) {
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = node.x * cosY + node.z * sinY;
      const z1 = -node.x * sinY + node.z * cosY;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;

      const scale = fov / Math.max(fov + z2, 50);
      const px = centerX + x1 * scale;
      const py = centerY + y2 * scale;
      const r = Math.max(node.radius * scale, 12);

      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist <= r + 15) {
        setSelectedNode(node);
        break;
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#050A18] text-white min-h-screen overflow-hidden">
      {/* Left Control & Inspection Sidebar matching Screen 4 */}
      <aside className="w-full lg:w-80 bg-[#080E20] border-b lg:border-b-0 lg:border-r border-[#15203B] p-6 flex flex-col justify-between shrink-0 z-10 space-y-6">
        <div className="space-y-6">
          {/* Header Title on Mobile / Top */}
          <div className="lg:hidden">
            <h1 className="text-xl font-bold tracking-tight text-white">3D Skill Network</h1>
          </div>

          {/* Legend / Category Filter Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Filter Elements
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory("skill")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCategory === "skill"
                    ? "bg-blue-600/30 border border-blue-500 text-blue-300"
                    : "bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Skills</span>
              </button>

              <button
                onClick={() => setFilterCategory("project")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCategory === "project"
                    ? "bg-emerald-600/30 border border-emerald-500 text-emerald-300"
                    : "bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Projects</span>
              </button>

              <button
                onClick={() => setFilterCategory("certificate")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCategory === "certificate"
                    ? "bg-purple-600/30 border border-purple-500 text-purple-300"
                    : "bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Certificates</span>
              </button>

              <button
                onClick={() => setFilterCategory("course")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCategory === "course"
                    ? "bg-amber-600/30 border border-amber-500 text-amber-300"
                    : "bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Courses</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Skill..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B1226] border border-[#1E2C4A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Selected Node Panel (Exact match to Screen 4) */}
          <div className="bg-[#0B1226] border border-[#1E2C4A] rounded-2xl p-5 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Selected Node
            </span>

            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ backgroundColor: selectedNode.color }}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                <span className="text-[10px] uppercase font-semibold text-blue-400 tracking-wider">
                  {selectedNode.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedNode.description}
            </p>

            <div className="pt-2 border-t border-[#1E2C4A]">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Related Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.relatedSkills.map((rel, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectNodeByName(rel)}
                    className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-[11px] font-medium text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all cursor-pointer"
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Help Tip */}
        <div className="text-[11px] text-slate-500 pt-2 border-t border-[#15203B]">
          Drag to rotate 3D view. Click on any sphere node to inspect details.
        </div>
      </aside>

      {/* Main Interactive 3D Canvas matching Screen 4 */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Floating Bar: Title + Controls */}
        <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            3D Skill Network
          </h1>

          {/* Top-Right Control Toolbar */}
          <div className="flex items-center space-x-2 pointer-events-auto bg-[#080E20]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1E2C4A] shadow-lg">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isRotating ? "text-blue-400 bg-blue-950/50" : "text-slate-400 hover:text-white"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </button>

            <button
              onClick={() => setZoom((prev) => Math.min(2.0, prev + 0.15))}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Zoom</span>
            </button>

            <button
              onClick={() => {
                setAngleX(-0.15);
                setAngleY(0.2);
                setZoom(1.1);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
          className="flex-1 w-full h-full cursor-grab active:cursor-grabbing min-h-[500px]"
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CheckCircle2, Code2, GraduationCap, Network, ShieldCheck, Sparkles, Award } from "lucide-react";

export function HeroIllustration() {
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center select-none">
      {/* Outer ambient cosmic radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-indigo-600/25 to-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 3D Geometric Polygonal Background Grid Sphere */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full opacity-30 text-blue-500 animate-[spin_60s_linear_infinite]"
        fill="none"
      >
        <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="250" cy="250" r="130" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="250" cy="250" rx="180" ry="60" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="250" cy="250" rx="60" ry="180" stroke="currentColor" strokeWidth="1" />
        <path d="M120 180 L380 320 M120 320 L380 180" stroke="currentColor" strokeWidth="0.75" />
      </svg>

      {/* Floating Holographic "Verified Certificate" Card (Top-Left) */}
      <div className="absolute top-10 left-4 sm:left-8 z-20 bg-[#0E172E]/90 backdrop-blur-md border border-emerald-500/30 p-3.5 rounded-2xl shadow-2xl shadow-emerald-500/10 flex items-center space-x-3 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold text-white">Verified Certificate</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">SHA-256 Validated</span>
        </div>
      </div>

      {/* Floating Code Badge `</>` (Left Middle) */}
      <div className="absolute bottom-28 left-2 sm:left-6 z-20 bg-[#0E172E]/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-2xl shadow-xl shadow-cyan-500/10 flex items-center justify-center text-cyan-400 transform rotate-6 hover:rotate-0 transition-transform">
        <Code2 className="w-6 h-6" />
      </div>

      {/* Floating 3D Skill Node (Top Right) */}
      <div className="absolute top-12 right-6 sm:right-12 z-20 bg-[#0E172E]/90 backdrop-blur-md border border-purple-500/30 p-3.5 rounded-2xl shadow-xl shadow-purple-500/10 flex items-center space-x-2.5 transform rotate-3 hover:rotate-0 transition-transform">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
          <Network className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-white block">3D Network</span>
          <span className="text-[10px] text-purple-300">Graph Dijkstra</span>
        </div>
      </div>

      {/* Floating Graduation Cap Node (Center-Right) */}
      <div className="absolute top-1/2 -translate-y-8 right-2 sm:right-6 z-20 bg-[#0E172E]/90 backdrop-blur-md border border-blue-500/30 p-3 rounded-2xl shadow-xl shadow-blue-500/10 flex items-center justify-center text-blue-400 transform -rotate-6 hover:rotate-0 transition-transform">
        <GraduationCap className="w-6 h-6" />
      </div>

      {/* Central Illustration: Student with glowing laptop */}
      <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Glowing aura beneath student */}
        <div className="absolute bottom-8 w-48 h-12 bg-blue-500/30 rounded-full blur-xl" />

        <svg viewBox="0 0 280 280" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="hoodieGrad" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E3A8A" />
              <stop offset="1" stopColor="#1E1B4B" />
            </linearGradient>
            <linearGradient id="laptopGrad" x1="80" y1="160" x2="200" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.6" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Student Body (Sitting with hoodie) */}
          <path
            d="M80 240 C80 180, 110 160, 140 160 C170 160, 200 180, 200 240 Z"
            fill="url(#hoodieGrad)"
          />

          {/* Neck */}
          <rect x="132" y="145" width="16" height="20" rx="4" fill="url(#skinGrad)" />

          {/* Head & Hair */}
          <circle cx="140" cy="120" r="28" fill="url(#skinGrad)" />
          {/* Stylized Dark Hair */}
          <path
            d="M112 120 C112 100, 120 90, 140 90 C160 90, 168 100, 168 120 C168 108, 160 102, 140 102 C120 102, 112 108, 112 120 Z"
            fill="#0F172A"
          />
          <path
            d="M115 110 Q140 85 165 110 Q160 95 140 92 Q120 95 115 110 Z"
            fill="#0F172A"
          />

          {/* Hoodie Collar Detail */}
          <path
            d="M125 165 L140 185 L155 165"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Glowing Laptop */}
          <g className="filter drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]">
            {/* Screen lid facing student */}
            <path
              d="M95 175 L185 175 L175 220 L105 220 Z"
              fill="url(#laptopGrad)"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            {/* Screen display glow glow */}
            <path
              d="M102 182 L178 182 L170 214 L110 214 Z"
              fill="#0F172A"
            />
            {/* Code lines on screen */}
            <line x1="118" y1="192" x2="162" y2="192" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <line x1="118" y1="199" x2="150" y2="199" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
            <line x1="118" y1="206" x2="158" y2="206" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

            {/* Laptop base */}
            <path
              d="M85 220 L195 220 L185 226 L95 226 Z"
              fill="#334155"
              stroke="#64748B"
              strokeWidth="1.5"
            />
          </g>

          {/* Hands on keyboard */}
          <circle cx="108" cy="222" r="7" fill="url(#skinGrad)" />
          <circle cx="172" cy="222" r="7" fill="url(#skinGrad)" />
        </svg>
      </div>
    </div>
  );
}

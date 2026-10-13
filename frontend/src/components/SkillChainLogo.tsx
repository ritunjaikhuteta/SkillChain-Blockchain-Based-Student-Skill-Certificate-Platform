import React from "react";

interface SkillChainLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function SkillChainLogo({
  size = 28,
  className = "",
  showText = false,
  textClassName = "font-bold tracking-tight text-base text-slate-900",
}: SkillChainLogoProps) {
  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 rounded-[8px] shadow-sm shadow-indigo-500/20 transition-transform hover:scale-105"
      >
        <defs>
          <linearGradient id="scGradPrimary" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="0.6" stopColor="#6366F1" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="scGradAccent" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="scBlockGrad" x1="10" y1="6" x2="22" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E0E7FF" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Base container badge with rich vibrant indigo/violet fill */}
        <rect width="32" height="32" rx="7" fill="url(#scGradPrimary)" />
        <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="#818CF8" strokeWidth="1" strokeOpacity="0.4" />

        {/* Geometric Blockchain / Skill Graph Nodes & 'S' Interlink */}
        {/* Top Node */}
        <circle cx="21" cy="9.5" r="2.25" fill="#38BDF8" />
        
        {/* Chain path forming cryptographic vertex 'S' */}
        <path
          d="M21 9.5L13.5 13.5V17L19.5 19V22.5L12 22.5"
          stroke="url(#scBlockGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interlocking Block Facets */}
        <path
          d="M10 11.5L14 9L18 11.5"
          stroke="#C7D2FE"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M14 20.5L18 23L22 20.5"
          stroke="#C7D2FE"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Vertex Anchor Dots */}
        <circle cx="10" cy="11.5" r="1.5" fill="#FFFFFF" />
        <circle cx="13.5" cy="15" r="1.75" fill="#38BDF8" />
        <circle cx="19.5" cy="19" r="1.75" fill="#FFFFFF" />
        <circle cx="12" cy="22.5" r="2" fill="#38BDF8" />
      </svg>

      {showText && (
        <span className={textClassName}>
          Skill<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Chain</span>
        </span>
      )}
    </div>
  );
}

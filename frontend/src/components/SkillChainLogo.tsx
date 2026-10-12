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
  textClassName = "font-semibold tracking-tight text-base text-[#191919]",
}: SkillChainLogoProps) {
  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 rounded-[6px] shadow-sm transition-transform hover:scale-105"
      >
        <defs>
          <linearGradient id="scGradPrimary" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E1E26" />
            <stop offset="1" stopColor="#111116" />
          </linearGradient>
          <linearGradient id="scGradAccent" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B99E8" />
            <stop offset="0.5" stopColor="#6C69C9" />
            <stop offset="1" stopColor="#4A479E" />
          </linearGradient>
          <linearGradient id="scBlockGrad" x1="10" y1="6" x2="22" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#D2D1E8" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Base container badge */}
        <rect width="32" height="32" rx="6.5" fill="url(#scGradPrimary)" />
        <rect x="0.5" y="0.5" width="31" height="31" rx="6" stroke="#33333F" strokeWidth="1" />

        {/* Geometric Blockchain / Skill Graph Nodes & 'S' Interlink */}
        {/* Top Node */}
        <circle cx="21" cy="9.5" r="2.25" fill="url(#scGradAccent)" />
        
        {/* Chain path forming cryptographic vertex 'S' */}
        <path
          d="M21 9.5L13.5 13.5V17L19.5 19V22.5L12 22.5"
          stroke="url(#scBlockGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interlocking Block Facets */}
        <path
          d="M10 11.5L14 9L18 11.5"
          stroke="#6C69C9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        <path
          d="M14 20.5L18 23L22 20.5"
          stroke="#6C69C9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Vertex Anchor Dots */}
        <circle cx="10" cy="11.5" r="1.5" fill="#FFFFFF" />
        <circle cx="13.5" cy="15" r="1.75" fill="url(#scGradAccent)" />
        <circle cx="19.5" cy="19" r="1.75" fill="#FFFFFF" />
        <circle cx="12" cy="22.5" r="2" fill="url(#scGradAccent)" />
      </svg>

      {showText && <span className={textClassName}>SkillChain</span>}
    </div>
  );
}

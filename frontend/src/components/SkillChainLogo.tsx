import React from "react";

interface SkillChainLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  isDark?: boolean;
}

export function SkillChainLogo({
  size = 32,
  className = "",
  showText = false,
  textClassName,
  isDark = true,
}: SkillChainLogoProps) {
  const defaultTextClass = isDark
    ? "font-bold tracking-tight text-lg text-white"
    : "font-bold tracking-tight text-lg text-slate-900";

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Sleek Chain-Link Logo Icon matching the screenshot */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
      >
        <defs>
          <linearGradient id="scChainGrad1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="scChainGrad2" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
        </defs>

        {/* Outer glowing interlinked chain loop 1 */}
        <path
          d="M14 8C10.6863 8 8 10.6863 8 14C8 17.3137 10.6863 20 14 20H18C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16H14C12.8954 16 12 15.1046 12 14C12 12.8954 12.8954 12 14 12H18C19.1046 12 20 11.1046 20 10C20 8.89543 19.1046 8 18 8H14Z"
          fill="url(#scChainGrad1)"
        />

        {/* Outer glowing interlinked chain loop 2 */}
        <path
          d="M22 28C25.3137 28 28 25.3137 28 22C28 18.6863 25.3137 16 22 16H18C16.8954 16 16 16.8954 16 18C16 19.1046 16.8954 20 18 20H22C23.1046 20 24 20.8954 24 22C24 23.1046 23.1046 24 22 24H18C16.8954 24 16 24.8954 16 26C16 27.1046 16.8954 28 18 28H22Z"
          fill="url(#scChainGrad2)"
        />

        {/* Interlink bridge connecting the two loops */}
        <circle cx="18" cy="18" r="2.5" fill="#38BDF8" className="animate-pulse" />
      </svg>

      {showText && (
        <span className={textClassName || defaultTextClass}>
          Skill<span className="text-blue-500 font-extrabold">Chain</span>
        </span>
      )}
    </div>
  );
}

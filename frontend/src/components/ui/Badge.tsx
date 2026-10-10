import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "accent" | "success" | "warning" | "destructive";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#191919] text-[#FFFFFF]",
    secondary: "bg-[#F2F0EA] text-[#191919] border border-[#DFDDD6]",
    outline: "bg-transparent text-[#77756F] border border-[#DFDDD6]",
    accent: "bg-[#F0EFF8] text-[#5555A5] border border-[#DFDEEE]",
    success: "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]",
    warning: "bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]",
    destructive: "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[3px] text-xs font-medium tracking-tight ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}

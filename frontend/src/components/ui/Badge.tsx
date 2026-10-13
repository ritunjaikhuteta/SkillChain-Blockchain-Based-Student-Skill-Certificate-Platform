import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "accent" | "success" | "warning" | "destructive" | "cyan" | "indigo";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantStyles = {
    default: "bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    outline: "bg-white text-slate-600 border border-slate-300",
    accent: "bg-purple-50 text-purple-700 border border-purple-200/80",
    indigo: "bg-indigo-500 text-white font-medium shadow-xs shadow-indigo-500/20",
    cyan: "bg-cyan-50 text-cyan-800 border border-cyan-200/80",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/80",
    destructive: "bg-rose-50 text-rose-800 border border-rose-200/80",
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}

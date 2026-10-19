import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl";

    const sizeStyles = {
      sm: "h-8 px-3.5 text-xs tracking-tight",
      md: "h-9 px-4 text-xs sm:text-sm tracking-tight",
      lg: "h-11 px-6 text-sm tracking-tight",
    }[size];

    const variantStyles = {
      primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]",
      secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 active:scale-[0.98]",
      outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-slate-300 shadow-xs active:scale-[0.98]",
      ghost: "bg-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-100/70",
      accent: "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.98]",
      danger: "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/25 hover:shadow-rose-500/35 active:scale-[0.98]",
      dark: "bg-[#0E172E] border border-[#1E2E52] text-slate-200 hover:text-white hover:bg-[#152345] hover:border-blue-500/40",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

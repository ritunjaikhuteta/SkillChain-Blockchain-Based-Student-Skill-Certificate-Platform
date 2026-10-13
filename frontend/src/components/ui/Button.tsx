import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:pointer-events-none disabled:opacity-50 select-none rounded-[6px]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs tracking-tight",
      md: "h-9 px-4 text-sm tracking-tight",
      lg: "h-11 px-6 text-sm tracking-tight",
    }[size];

    const variantStyles = {
      primary: "bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 active:scale-[0.98]",
      secondary: "bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/70 active:scale-[0.98]",
      outline: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 shadow-sm active:scale-[0.98]",
      ghost: "bg-transparent text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70",
      accent: "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 active:scale-[0.98]",
      danger: "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm shadow-rose-500/30 hover:from-rose-500 hover:to-red-500 active:scale-[0.98]",
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

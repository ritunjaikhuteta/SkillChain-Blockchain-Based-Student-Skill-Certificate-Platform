import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5555A5] disabled:pointer-events-none disabled:opacity-50 select-none rounded-[4px]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs tracking-tight",
      md: "h-9 px-4 text-sm tracking-tight",
      lg: "h-11 px-6 text-sm tracking-tight",
    }[size];

    const variantStyles = {
      primary: "bg-[#191919] text-[#FFFFFF] hover:bg-[#333333] active:bg-[#000000]",
      secondary: "bg-[#F2F0EA] text-[#191919] hover:bg-[#E7E4DC] border border-[#DFDDD6]",
      outline: "bg-transparent text-[#191919] border border-[#DFDDD6] hover:bg-[#F2F0EA]",
      ghost: "bg-transparent text-[#77756F] hover:text-[#191919] hover:bg-[#F2F0EA]",
      accent: "bg-[#5555A5] text-[#FFFFFF] hover:bg-[#46468E] active:bg-[#3D3D7D]",
      danger: "bg-[#DC2626] text-[#FFFFFF] hover:bg-[#B91C1C]",
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

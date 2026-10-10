import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#191919]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`flex h-9 w-full rounded-[4px] border bg-[#FFFFFF] px-3 py-1 text-sm text-[#191919] placeholder:text-[#77756F] transition-colors focus-visible:outline-none focus-visible:border-[#5555A5] focus-visible:ring-1 focus-visible:ring-[#5555A5] disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-[#DC2626]" : "border-[#DFDDD6]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#DC2626]">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#77756F]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#191919]">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={`flex min-h-[80px] w-full rounded-[4px] border bg-[#FFFFFF] px-3 py-2 text-sm text-[#191919] placeholder:text-[#77756F] transition-colors focus-visible:outline-none focus-visible:border-[#5555A5] focus-visible:ring-1 focus-visible:ring-[#5555A5] disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-[#DC2626]" : "border-[#DFDDD6]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#DC2626]">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#77756F]">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

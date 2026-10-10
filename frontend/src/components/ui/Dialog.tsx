import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, title, description, children }: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div
        className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#DFDDD6] rounded-[6px] shadow-sm p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#77756F] hover:text-[#191919] p-1 rounded hover:bg-[#F2F0EA] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#191919]">{title}</h2>
          {description && <p className="mt-1 text-xs text-[#77756F]">{description}</p>}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

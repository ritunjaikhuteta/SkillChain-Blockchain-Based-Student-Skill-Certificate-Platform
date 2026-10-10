import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#DFDDD6] rounded-[4px] bg-[#FFFFFF] ${className}`}
    >
      {icon && <div className="mb-3 text-[#77756F]">{icon}</div>}
      <h3 className="text-sm font-semibold tracking-tight text-[#191919]">{title}</h3>
      <p className="mt-1 text-xs text-[#77756F] max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="outline" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

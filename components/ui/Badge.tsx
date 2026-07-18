import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type BadgeVariant = "success" | "warning" | "neutral" | "brand" | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-brand-light/20 text-brand-dark",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-surface text-ink/60",
  brand: "bg-brand text-white",
  danger: "bg-red-100 text-red-600",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";

type AlertVariant = "success" | "error";

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  success: "bg-brand-light/15 text-brand-dark",
  error: "bg-red-50 text-red-600",
};

const variantIcon: Record<AlertVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertTriangle,
};

export function Alert({ variant, children, className }: AlertProps) {
  const Icon = variantIcon[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium",
        variantStyles[variant],
        className
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

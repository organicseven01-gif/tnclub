import { cn } from "@/utils/cn";

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  trackClassName?: string;
  barClassName?: string;
}

export function ProgressBar({
  value,
  label,
  showPercentage = false,
  trackClassName,
  barClassName,
}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink/60">
          {label && <span>{label}</span>}
          {showPercentage && <span>{safeValue}%</span>}
        </div>
      )}
      <div
        className={cn("h-2.5 w-full overflow-hidden rounded-full bg-surface", trackClassName)}
      >
        <div
          className={cn("h-full rounded-full bg-gradient-to-r from-brand to-brand-light", barClassName)}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

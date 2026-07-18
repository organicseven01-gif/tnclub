import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
}

export function Switch({ checked, className, ...rest }: SwitchProps) {
  return (
    <button
      type="submit"
      aria-pressed={checked}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-brand" : "bg-black/15",
        className
      )}
      {...rest}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export function Input({ label, icon, className, id, ...rest }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink/70">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-4 text-ink/40">{icon}</span>
        )}
        <input
          id={id}
          className={cn(
            "h-12 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm text-ink placeholder:text-ink/35 outline-none transition-all duration-200 hover:border-black/15 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10",
            icon && "pl-11",
            className
          )}
          {...rest}
        />
      </div>
    </div>
  );
}

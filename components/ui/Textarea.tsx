import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, rows = 3, ...rest }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink/70">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={cn(
          "w-full resize-none rounded-2xl border border-black/5 bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-brand focus:bg-white",
          className
        )}
        {...rest}
      />
    </div>
  );
}

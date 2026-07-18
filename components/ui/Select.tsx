import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, options, placeholder, className, id, ...rest }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink/70">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={id}
          className={cn(
            "h-12 w-full appearance-none rounded-2xl border border-black/5 bg-surface px-4 pr-10 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white",
            className
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 text-ink/40" />
      </div>
    </div>
  );
}

"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ConfirmSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmMessage: string;
  children: ReactNode;
}

export function ConfirmSubmitButton({
  confirmMessage,
  children,
  className,
  ...rest
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={cn("inline-flex items-center gap-1", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

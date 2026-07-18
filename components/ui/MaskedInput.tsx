"use client";

import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "./Input";

interface MaskedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  label?: string;
  icon?: ReactNode;
  mask: (value: string) => string;
  defaultValue?: string;
}

// Input controlado que reaplica uma máscara a cada tecla digitada.
// O valor formatado é enviado no submit; as buscas/gravações já ignoram
// a formatação (comparam apenas os dígitos).
export function MaskedInput({ mask, defaultValue = "", ...rest }: MaskedInputProps) {
  const [value, setValue] = useState(() => mask(defaultValue));

  return (
    <Input
      {...rest}
      inputMode="numeric"
      value={value}
      onChange={(event) => setValue(mask(event.target.value))}
    />
  );
}

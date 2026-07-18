"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui";

interface SearchBarProps {
  paramName: string;
  placeholder: string;
}

export function SearchBar({ paramName, placeholder }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(searchParams.get(paramName) ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (valor) {
        params.set(paramName, valor);
      } else {
        params.delete(paramName);
      }

      router.replace(`${pathname}?${params.toString()}`);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  return (
    <Input
      placeholder={placeholder}
      value={valor}
      onChange={(event) => setValor(event.target.value)}
      icon={<Search size={16} />}
      className="max-w-sm"
    />
  );
}

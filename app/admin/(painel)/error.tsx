"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={26} className="text-red-500" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-base font-semibold text-ink">Algo não saiu como esperado</p>
        <p className="mt-1 text-sm text-ink/50">Tente novamente em instantes.</p>
      </div>
      <Button onClick={reset} fullWidth={false}>
        Tentar novamente
      </Button>
    </div>
  );
}

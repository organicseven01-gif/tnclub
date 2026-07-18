import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface LoadingProps {
  label?: string;
  fullscreen?: boolean;
  className?: string;
}

// Reservado para os estados de carregamento que surgirão com a integração de dados reais.
export function Loading({ label = "Carregando...", fullscreen = false, className }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10 text-ink/50",
        fullscreen && "min-h-screen",
        className
      )}
    >
      <Loader2 size={28} className="animate-spin text-brand" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

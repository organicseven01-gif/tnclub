import { ProgressBar } from "@/components/ui";
import { cn } from "@/utils/cn";
import { TIER_LABELS } from "@/utils/constants";
import { formatPoints } from "@/utils/formatters";
import type { ProgressoNivel } from "@/utils/tier";

interface ProgressSectionProps {
  progresso: ProgressoNivel;
  tone?: "light" | "dark";
}

export function ProgressSection({ progresso, tone = "dark" }: ProgressSectionProps) {
  const isDark = tone === "dark";

  return (
    <div>
      <ProgressBar
        value={progresso.percentual}
        label={
          progresso.proximoNivel
            ? `Rumo ao nível ${TIER_LABELS[progresso.proximoNivel]}`
            : "Nível máximo atingido"
        }
        showPercentage
        trackClassName={isDark ? "bg-white/15" : undefined}
        barClassName={isDark ? "from-brand-light to-brand-light" : undefined}
      />
      {progresso.proximoNivel && (
        <p className={cn("mt-2 text-xs", isDark ? "text-white/70" : "text-ink/50")}>
          Faltam {formatPoints(progresso.pontosRestantes)} para o próximo nível
        </p>
      )}
    </div>
  );
}

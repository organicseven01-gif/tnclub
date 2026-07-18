import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { LevelBadge } from "./LevelBadge";
import { ProgressSection } from "./ProgressSection";
import { formatPoints } from "@/utils/formatters";
import { getProgressoNivel } from "@/utils/tier";
import type { NivelFidelidade } from "@/types";

interface PointsCardProps {
  saldoPontos: number;
  nivel: NivelFidelidade;
}

export function PointsCard({ saldoPontos, nivel }: PointsCardProps) {
  const progresso = getProgressoNivel(saldoPontos, nivel);

  return (
    <Card padding="lg" className="bg-brand-dark text-white shadow-soft">
      <div className="flex items-start justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-light">
          <Sparkles size={14} />
          Saldo de pontos
        </span>
        <LevelBadge nivel={nivel} tone="subtle" />
      </div>

      <p className="mt-3 text-4xl font-extrabold tracking-tight">{formatPoints(saldoPontos)}</p>

      <div className="mt-6">
        <ProgressSection progresso={progresso} />
      </div>
    </Card>
  );
}

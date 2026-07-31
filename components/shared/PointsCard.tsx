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
  servicosRealizados: number;
  limites?: Record<NivelFidelidade, number>;
}

export function PointsCard({ saldoPontos, nivel, servicosRealizados, limites }: PointsCardProps) {
  // O nível (e o progresso) dependem da quantidade de serviços realizados.
  const progresso = getProgressoNivel(servicosRealizados, nivel, limites);

  return (
    <Card
      padding="lg"
      className="relative overflow-hidden border-white/10 bg-brand-gradient text-white shadow-premium ring-0"
    >
      {/* Camadas decorativas: brilho difuso + reflexo que desliza uma vez */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-brand-light/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-sheen absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            <Sparkles size={13} strokeWidth={2} />
            Saldo de pontos
          </span>
          <LevelBadge nivel={nivel} tone="subtle" />
        </div>

        <p className="mt-4 text-5xl font-extrabold leading-none tracking-tight">
          {formatPoints(saldoPontos)}
        </p>

        <div className="mt-7">
          <ProgressSection progresso={progresso} />
        </div>
      </div>
    </Card>
  );
}

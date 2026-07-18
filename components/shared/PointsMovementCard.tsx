import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui";
import { formatDate } from "@/utils/formatters";
import type { MovimentoPontos } from "@/types";

interface PointsMovementCardProps {
  movimento: MovimentoPontos;
}

export function PointsMovementCard({ movimento }: PointsMovementCardProps) {
  const isGanho = movimento.tipo === "ganho";

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div
        className={
          isGanho
            ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10"
            : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink/5"
        }
      >
        {isGanho ? (
          <ArrowUpRight size={18} className="text-brand" strokeWidth={2} />
        ) : (
          <ArrowDownRight size={18} className="text-ink/50" strokeWidth={2} />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{movimento.descricao}</p>
        <p className="text-xs text-ink/45">{formatDate(movimento.data)}</p>
      </div>
      <span
        className={
          isGanho ? "shrink-0 text-sm font-bold text-brand" : "shrink-0 text-sm font-bold text-ink/50"
        }
      >
        {isGanho ? "+" : ""}
        {movimento.pontos}
      </span>
    </Card>
  );
}

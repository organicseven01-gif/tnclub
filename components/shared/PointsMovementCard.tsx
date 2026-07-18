import { ArrowDownRight, ArrowUpRight, Clock, Gift, Tag } from "lucide-react";
import { Card } from "@/components/ui";
import { formatDate } from "@/utils/formatters";
import type { MovimentoPontos, TipoMovimentoPontos } from "@/types";

interface PointsMovementCardProps {
  movimento: MovimentoPontos;
}

const estilos: Record<
  TipoMovimentoPontos,
  { icon: typeof ArrowUpRight; bg: string; cor: string; valor: string }
> = {
  ganho: { icon: ArrowUpRight, bg: "bg-brand/10", cor: "text-brand", valor: "text-brand" },
  resgate: { icon: Gift, bg: "bg-ink/5", cor: "text-ink/50", valor: "text-ink/50" },
  desconto: { icon: Tag, bg: "bg-ink/5", cor: "text-ink/50", valor: "text-ink/50" },
  expiracao: { icon: Clock, bg: "bg-amber-50", cor: "text-amber-600", valor: "text-amber-600" },
};

export function PointsMovementCard({ movimento }: PointsMovementCardProps) {
  const estilo = estilos[movimento.tipo] ?? estilos.resgate;
  const Icone = estilo.icon;
  const isGanho = movimento.tipo === "ganho";

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${estilo.bg}`}>
        {isGanho ? (
          <ArrowUpRight size={18} className={estilo.cor} strokeWidth={2} />
        ) : movimento.tipo === "resgate" || movimento.tipo === "desconto" ? (
          <Icone size={18} className={estilo.cor} strokeWidth={2} />
        ) : (
          <ArrowDownRight size={18} className={estilo.cor} strokeWidth={2} />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{movimento.descricao}</p>
        <p className="text-xs text-ink/45">{formatDate(movimento.data)}</p>
      </div>
      <span className={`shrink-0 text-sm font-bold ${estilo.valor}`}>
        {movimento.pontos > 0 ? "+" : ""}
        {movimento.pontos}
      </span>
    </Card>
  );
}

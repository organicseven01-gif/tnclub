import { Sparkles, Calendar } from "lucide-react";
import { Card } from "@/components/ui";
import { formatDate } from "@/utils/formatters";
import type { HistoricoDetalhado } from "@/types";

interface HistoryCardProps {
  historico: HistoricoDetalhado;
  clienteNome?: string;
}

export function HistoryCard({ historico, clienteNome }: HistoryCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{historico.servico.nome}</p>
          {clienteNome && <p className="mt-0.5 text-xs font-medium text-brand-dark">{clienteNome}</p>}
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/45">
            <Calendar size={12} />
            {formatDate(historico.data)}
          </p>
        </div>
        {historico.pontosGerados > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand">
            <Sparkles size={13} />+{historico.pontosGerados} pts
          </span>
        )}
      </div>

      <p className="mt-3 border-t border-black/5 pt-3 text-xs text-ink/55">{historico.observacao}</p>
    </Card>
  );
}

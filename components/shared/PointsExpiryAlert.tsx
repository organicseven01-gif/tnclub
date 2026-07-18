import { Clock } from "lucide-react";
import type { ResumoValidadePontos } from "@/types";

interface PointsExpiryAlertProps {
  resumo: ResumoValidadePontos;
}

// Aviso amigável quando o cliente tem pontos prestes a expirar. Não aparece
// quando não há nada vencendo em breve.
export function PointsExpiryAlert({ resumo }: PointsExpiryAlertProps) {
  if (resumo.pontosVencendoEmBreve <= 0 || resumo.diasParaVencimento === null) return null;

  const dias = resumo.diasParaVencimento;
  const quando = dias <= 0 ? "hoje" : dias === 1 ? "amanhã" : `em ${dias} dias`;

  return (
    <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3.5">
      <Clock size={18} className="mt-0.5 shrink-0 text-amber-600" strokeWidth={2} />
      <div>
        <p className="text-sm font-semibold text-amber-900">
          Você possui {resumo.pontosVencendoEmBreve} pontos que expiram {quando}.
        </p>
        <p className="mt-0.5 text-xs text-amber-700">Utilize seus pontos antes que expirem.</p>
      </div>
    </div>
  );
}

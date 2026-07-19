import { TIER_ORDER, TIER_THRESHOLDS } from "./constants";
import type { NivelFidelidade } from "@/types";

export interface ProgressoNivel {
  percentual: number;
  proximoNivel: NivelFidelidade | null;
  servicosRestantes: number;
}

// O nível do cliente é definido pela QUANTIDADE DE SERVIÇOS realizados.
// Os limites podem vir das configurações do admin; quando não são informados,
// caímos nos valores padrão de TIER_THRESHOLDS.
export function getProgressoNivel(
  servicosRealizados: number,
  nivel: NivelFidelidade,
  limites: Record<NivelFidelidade, number> = TIER_THRESHOLDS
): ProgressoNivel {
  const indiceAtual = TIER_ORDER.indexOf(nivel);
  const proximoNivel = TIER_ORDER[indiceAtual + 1] ?? null;

  if (!proximoNivel) {
    return { percentual: 100, proximoNivel: null, servicosRestantes: 0 };
  }

  const limiteAtual = limites[nivel];
  const limiteProximo = limites[proximoNivel];
  const intervalo = Math.max(1, limiteProximo - limiteAtual);
  const percentual = Math.round(((servicosRealizados - limiteAtual) / intervalo) * 100);

  return {
    percentual: Math.min(100, Math.max(0, percentual)),
    proximoNivel,
    servicosRestantes: Math.max(0, limiteProximo - servicosRealizados),
  };
}

import { TIER_ORDER, TIER_THRESHOLDS } from "./constants";
import type { NivelFidelidade } from "@/types";

export interface ProgressoNivel {
  percentual: number;
  proximoNivel: NivelFidelidade | null;
  pontosRestantes: number;
}

// Os limites podem vir das configurações do admin (banco). Quando não são
// informados, caímos nos valores padrão de TIER_THRESHOLDS.
export function getProgressoNivel(
  saldoPontos: number,
  nivel: NivelFidelidade,
  limites: Record<NivelFidelidade, number> = TIER_THRESHOLDS
): ProgressoNivel {
  const indiceAtual = TIER_ORDER.indexOf(nivel);
  const proximoNivel = TIER_ORDER[indiceAtual + 1] ?? null;

  if (!proximoNivel) {
    return { percentual: 100, proximoNivel: null, pontosRestantes: 0 };
  }

  const limiteAtual = limites[nivel];
  const limiteProximo = limites[proximoNivel];
  const percentual = Math.round(((saldoPontos - limiteAtual) / (limiteProximo - limiteAtual)) * 100);

  return {
    percentual: Math.min(100, Math.max(0, percentual)),
    proximoNivel,
    pontosRestantes: Math.max(0, limiteProximo - saldoPontos),
  };
}

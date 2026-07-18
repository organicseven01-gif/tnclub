import { TIER_ORDER, TIER_THRESHOLDS } from "./constants";
import type { NivelFidelidade } from "@/types";

export interface ProgressoNivel {
  percentual: number;
  proximoNivel: NivelFidelidade | null;
  pontosRestantes: number;
}

export function getProgressoNivel(saldoPontos: number, nivel: NivelFidelidade): ProgressoNivel {
  const indiceAtual = TIER_ORDER.indexOf(nivel);
  const proximoNivel = TIER_ORDER[indiceAtual + 1] ?? null;

  if (!proximoNivel) {
    return { percentual: 100, proximoNivel: null, pontosRestantes: 0 };
  }

  const limiteAtual = TIER_THRESHOLDS[nivel];
  const limiteProximo = TIER_THRESHOLDS[proximoNivel];
  const percentual = Math.round(((saldoPontos - limiteAtual) / (limiteProximo - limiteAtual)) * 100);

  return {
    percentual: Math.min(100, Math.max(0, percentual)),
    proximoNivel,
    pontosRestantes: Math.max(0, limiteProximo - saldoPontos),
  };
}

export function getNivelPorPontos(saldoPontos: number): NivelFidelidade {
  let nivelAtingido: NivelFidelidade = TIER_ORDER[0];

  for (const nivel of TIER_ORDER) {
    if (saldoPontos >= TIER_THRESHOLDS[nivel]) {
      nivelAtingido = nivel;
    }
  }

  return nivelAtingido;
}

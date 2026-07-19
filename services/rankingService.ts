import { getClientes } from "./clienteService";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";

export interface ClienteRanking {
  clienteId: string;
  nome: string;
  valorGasto: number;
  pontosAcumulados: number;
  saldoAtual: number;
  visitas: number;
}

export type CriterioRanking = "valorGasto" | "pontosAcumulados" | "saldoAtual" | "visitas";

// Agrega, por cliente, o total gasto, os pontos já acumulados, o saldo atual e
// o número de visitas (atendimentos), a partir dos dados existentes.
export async function getRankingClientes(): Promise<ClienteRanking[]> {
  const [clientes, atendimentosRes] = await Promise.all([
    getClientes(),
    supabase.from("atendimentos").select("cliente_id, valor_total, pontos_gerados"),
  ]);

  if (atendimentosRes.error) {
    lancarErroAmigavel(atendimentosRes.error, "Não foi possível carregar o ranking.");
  }

  const atendimentos = (atendimentosRes.data ?? []) as {
    cliente_id: string;
    valor_total: number;
    pontos_gerados: number;
  }[];

  const agregados = new Map<string, { valorGasto: number; pontosAcumulados: number; visitas: number }>();
  for (const at of atendimentos) {
    const atual = agregados.get(at.cliente_id) ?? { valorGasto: 0, pontosAcumulados: 0, visitas: 0 };
    atual.valorGasto += Number(at.valor_total) || 0;
    atual.pontosAcumulados += Number(at.pontos_gerados) || 0;
    atual.visitas += 1;
    agregados.set(at.cliente_id, atual);
  }

  return clientes.map((cliente) => {
    const agg = agregados.get(cliente.id) ?? { valorGasto: 0, pontosAcumulados: 0, visitas: 0 };
    return {
      clienteId: cliente.id,
      nome: cliente.nome,
      valorGasto: agg.valorGasto,
      pontosAcumulados: agg.pontosAcumulados,
      saldoAtual: cliente.saldoPontos,
      visitas: agg.visitas,
    };
  });
}

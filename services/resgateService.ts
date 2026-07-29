import type { Resgate, StatusResgate } from "@/types";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";

interface ResgateRow {
  id: string;
  cliente_id: string;
  beneficio_id: string;
  pontos_utilizados: number;
  status: StatusResgate;
  created_at: string;
}

function mapResgate(row: ResgateRow): Resgate {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    beneficioId: row.beneficio_id,
    pontosUtilizados: row.pontos_utilizados,
    status: row.status,
    data: row.created_at,
  };
}

export interface ResgateResultado {
  sucesso: boolean;
  mensagem: string;
  // Pontos efetivamente usados e a diferença (em R$) a pagar no atendimento
  // quando o cliente não tinha o saldo cheio.
  pontosUtilizados?: number;
  diferencaReais?: number;
}

// Chama a função SQL "resgatar_beneficio" (supabase/schema.sql), que consome os
// pontos disponíveis do cliente (até o custo do benefício) e grava o resgate em
// uma única transação. Se o cliente não tiver o saldo cheio, usa o que tem e
// devolve a diferença em R$ para pagar no atendimento.
export async function resgatarBeneficio(clienteId: string, beneficioId: string): Promise<ResgateResultado> {
  const { data, error } = await supabase.rpc("resgatar_beneficio", {
    p_cliente_id: clienteId,
    p_beneficio_id: beneficioId,
  });

  if (error) {
    return { sucesso: false, mensagem: error.message };
  }

  const r = (data ?? {}) as { pontos_utilizados?: number; diferenca_reais?: number };

  return {
    sucesso: true,
    mensagem: "Resgate realizado com sucesso!",
    pontosUtilizados: r.pontos_utilizados ?? 0,
    diferencaReais: r.diferenca_reais ?? 0,
  };
}

export async function listarResgatesPorCliente(clienteId: string): Promise<Resgate[]> {
  const { data, error } = await supabase
    .from("resgates")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  if (error) lancarErroAmigavel(error, "Não foi possível carregar os resgates.");
  return (data ?? []).map(mapResgate);
}

export async function listarResgates(): Promise<Resgate[]> {
  const { data, error } = await supabase
    .from("resgates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) lancarErroAmigavel(error, "Não foi possível carregar os resgates.");
  return (data ?? []).map(mapResgate);
}

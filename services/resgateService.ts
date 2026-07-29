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

export interface ResgateDetalhado {
  id: string;
  beneficioNome: string;
  pontosUtilizados: number;
  status: StatusResgate;
  data: string;
}

// Lista os resgates de um cliente já com o nome do benefício — usado no painel
// admin (ficha do cliente) para permitir o estorno.
export async function listarResgatesDetalhadosPorCliente(
  clienteId: string
): Promise<ResgateDetalhado[]> {
  const { data, error } = await supabase
    .from("resgates")
    .select("id, pontos_utilizados, status, created_at, beneficio:beneficios(nome)")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  if (error) lancarErroAmigavel(error, "Não foi possível carregar os resgates.");

  return (data ?? []).map((linha) => {
    const r = linha as unknown as {
      id: string;
      pontos_utilizados: number;
      status: StatusResgate;
      created_at: string;
      beneficio: { nome: string } | null;
    };
    return {
      id: r.id,
      beneficioNome: r.beneficio?.nome ?? "Benefício",
      pontosUtilizados: r.pontos_utilizados,
      status: r.status,
      data: r.created_at,
    };
  });
}

// Estorna um resgate: devolve os pontos ao cliente e marca como cancelado.
export async function estornarResgate(resgateId: string): Promise<{ sucesso: boolean; mensagem: string }> {
  const { error } = await supabase.rpc("estornar_resgate", { p_resgate_id: resgateId });
  if (error) {
    return { sucesso: false, mensagem: error.message };
  }
  return { sucesso: true, mensagem: "Resgate estornado. Os pontos voltaram para o cliente." };
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

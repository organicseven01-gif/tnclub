import type { Historico, HistoricoDetalhado } from "@/types";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";

interface AtendimentoRow {
  id: string;
  cliente_id: string;
  servico_id: string;
  quantidade: number;
  valor_total: number;
  pontos_gerados: number;
  observacao: string;
  data_atendimento: string;
}

interface AtendimentoDetalhadoRow extends AtendimentoRow {
  servico: {
    id: string;
    nome: string;
    valor: number;
    pontos: number;
    ativo: boolean;
  };
}

function mapHistorico(row: AtendimentoRow): Historico {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    servicoId: row.servico_id,
    quantidade: row.quantidade,
    valorTotal: row.valor_total,
    data: row.data_atendimento,
    pontosGerados: row.pontos_gerados,
    observacao: row.observacao,
  };
}

function mapHistoricoDetalhado(row: AtendimentoDetalhadoRow): HistoricoDetalhado {
  return {
    ...mapHistorico(row),
    servico: { ...row.servico },
  };
}

export async function getHistoricoPorCliente(clienteId: string): Promise<Historico[]> {
  const { data, error } = await supabase
    .from("atendimentos")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("data_atendimento", { ascending: false });

  if (error) lancarErroAmigavel(error, "Não foi possível carregar o histórico.");
  return (data ?? []).map(mapHistorico);
}

export async function getHistoricoDetalhado(clienteId: string): Promise<HistoricoDetalhado[]> {
  return listarHistoricoDetalhado({ clienteId });
}

// Quantidade de serviços realizados pelo cliente — é o que define o nível.
export async function contarServicosCliente(clienteId: string): Promise<number> {
  const { count, error } = await supabase
    .from("atendimentos")
    .select("*", { count: "exact", head: true })
    .eq("cliente_id", clienteId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export interface FiltroHistorico {
  clienteId?: string;
  servicoId?: string;
  status?: "concluido" | "cancelado";
  dataInicio?: string;
  dataFim?: string;
}

export async function listarHistoricoDetalhado(filtro?: FiltroHistorico): Promise<HistoricoDetalhado[]> {
  let query = supabase
    .from("atendimentos")
    .select("*, servico:servicos(*)")
    .order("data_atendimento", { ascending: false });

  if (filtro?.clienteId) query = query.eq("cliente_id", filtro.clienteId);
  if (filtro?.servicoId) query = query.eq("servico_id", filtro.servicoId);
  if (filtro?.status === "concluido") query = query.gt("pontos_gerados", 0);
  if (filtro?.status === "cancelado") query = query.eq("pontos_gerados", 0);
  if (filtro?.dataInicio) query = query.gte("data_atendimento", filtro.dataInicio);
  if (filtro?.dataFim) query = query.lte("data_atendimento", filtro.dataFim);

  const { data, error } = await query;
  if (error) lancarErroAmigavel(error, "Não foi possível carregar o histórico.");
  return (data ?? []).map((row) => mapHistoricoDetalhado(row as unknown as AtendimentoDetalhadoRow));
}

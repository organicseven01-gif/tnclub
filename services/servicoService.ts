import type { Servico } from "@/types";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";

interface ServicoRow {
  id: string;
  nome: string;
  valor: number;
  ativo: boolean;
}

function mapServico(row: ServicoRow): Servico {
  return {
    id: row.id,
    nome: row.nome,
    valor: row.valor,
    ativo: row.ativo,
  };
}

export async function getServicos(): Promise<Servico[]> {
  const { data, error } = await supabase.from("servicos").select("*").order("nome");
  if (error) lancarErroAmigavel(error, "Não foi possível carregar os serviços.");
  return (data ?? []).map(mapServico);
}

export async function getServicoPorId(id: string): Promise<Servico | undefined> {
  const { data, error } = await supabase.from("servicos").select("*").eq("id", id).maybeSingle();
  if (error) lancarErroAmigavel(error, "Não foi possível carregar o serviço.");
  return data ? mapServico(data) : undefined;
}

export const listarServicos = getServicos;
export const buscarServicoPorId = getServicoPorId;

export interface DadosServico {
  nome: string;
  valor: number;
  ativo: boolean;
}

export async function criarServico(dados: DadosServico): Promise<Servico> {
  // "pontos: 0" garante compatibilidade com a coluna legada (os pontos agora
  // são calculados automaticamente pelo valor, ver Programa de Pontos).
  const { data, error } = await supabase
    .from("servicos")
    .insert({ ...dados, pontos: 0 })
    .select()
    .single();
  if (error) lancarErroAmigavel(error, "Não foi possível cadastrar o serviço.");
  return mapServico(data);
}

export async function atualizarServico(id: string, dados: DadosServico): Promise<Servico> {
  const { data, error } = await supabase
    .from("servicos")
    .update(dados)
    .eq("id", id)
    .select()
    .single();

  if (error) lancarErroAmigavel(error, "Não foi possível atualizar o serviço.");
  return mapServico(data);
}

export async function excluirServico(id: string): Promise<void> {
  const { error } = await supabase.from("servicos").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      lancarErroAmigavel(error, "Não é possível excluir: existem atendimentos registrados para este serviço.");
    }
    lancarErroAmigavel(error, "Não foi possível excluir o serviço.");
  }
}

import type { Beneficio } from "@/types";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";

interface BeneficioRow {
  id: string;
  nome: string;
  descricao: string;
  pontos_necessarios: number;
  imagem_url: string | null;
  ativo: boolean;
}

function mapBeneficio(row: BeneficioRow): Beneficio {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    pontosNecessarios: row.pontos_necessarios,
    imagemUrl: row.imagem_url ?? undefined,
    ativo: row.ativo,
  };
}

export async function getBeneficiosAtivos(): Promise<Beneficio[]> {
  const { data, error } = await supabase
    .from("beneficios")
    .select("*")
    .eq("ativo", true)
    .order("pontos_necessarios");

  if (error) lancarErroAmigavel(error, "Não foi possível carregar os benefícios.");
  return (data ?? []).map(mapBeneficio);
}

export async function listarBeneficios(): Promise<Beneficio[]> {
  const { data, error } = await supabase.from("beneficios").select("*").order("pontos_necessarios");
  if (error) lancarErroAmigavel(error, "Não foi possível carregar os benefícios.");
  return (data ?? []).map(mapBeneficio);
}

export async function buscarBeneficioPorId(id: string): Promise<Beneficio | undefined> {
  const { data, error } = await supabase.from("beneficios").select("*").eq("id", id).maybeSingle();
  if (error) lancarErroAmigavel(error, "Não foi possível carregar o benefício.");
  return data ? mapBeneficio(data) : undefined;
}

export interface DadosBeneficio {
  nome: string;
  descricao: string;
  pontosNecessarios: number;
  imagemUrl?: string;
  ativo: boolean;
}

export async function criarBeneficio(dados: DadosBeneficio): Promise<Beneficio> {
  const { data, error } = await supabase
    .from("beneficios")
    .insert({
      nome: dados.nome,
      descricao: dados.descricao,
      pontos_necessarios: dados.pontosNecessarios,
      imagem_url: dados.imagemUrl ?? null,
      ativo: dados.ativo,
    })
    .select()
    .single();

  if (error) lancarErroAmigavel(error, "Não foi possível cadastrar o benefício.");
  return mapBeneficio(data);
}

export async function atualizarBeneficio(id: string, dados: DadosBeneficio): Promise<Beneficio> {
  const { data, error } = await supabase
    .from("beneficios")
    .update({
      nome: dados.nome,
      descricao: dados.descricao,
      pontos_necessarios: dados.pontosNecessarios,
      imagem_url: dados.imagemUrl ?? null,
      ativo: dados.ativo,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) lancarErroAmigavel(error, "Não foi possível atualizar o benefício.");
  return mapBeneficio(data);
}

export async function excluirBeneficio(id: string): Promise<void> {
  const { error } = await supabase.from("beneficios").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      lancarErroAmigavel(error, "Não é possível excluir: existem resgates registrados para este benefício.");
    }
    lancarErroAmigavel(error, "Não foi possível excluir o benefício.");
  }
}

export async function alternarStatusBeneficio(id: string): Promise<Beneficio> {
  const atual = await buscarBeneficioPorId(id);

  if (!atual) {
    throw new Error("Benefício não encontrado.");
  }

  const { data, error } = await supabase
    .from("beneficios")
    .update({ ativo: !atual.ativo })
    .eq("id", id)
    .select()
    .single();

  if (error) lancarErroAmigavel(error, "Não foi possível atualizar o status do benefício.");
  return mapBeneficio(data);
}

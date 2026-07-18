import type { ResumoValidadePontos } from "@/types";
import { supabase } from "./supabase";

// Janela (em dias) para considerar um ponto como "vencendo em breve".
const DIAS_AVISO_VENCIMENTO = 30;

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function diasEntre(deISO: string, ateISO: string): number {
  const ms = new Date(`${ateISO}T00:00:00Z`).getTime() - new Date(`${deISO}T00:00:00Z`).getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

// Resumo de validade para o cliente: quantos pontos vencem em breve e quando é
// o próximo vencimento. Lotes sem data de vencimento (validade desligada) não
// entram nesse cálculo.
export async function getResumoValidadePontos(clienteId: string): Promise<ResumoValidadePontos> {
  const hoje = hojeISO();

  const { data, error } = await supabase
    .from("pontos_lotes")
    .select("pontos_restantes, data_vencimento")
    .eq("cliente_id", clienteId)
    .gt("pontos_restantes", 0)
    .not("data_vencimento", "is", null)
    .gte("data_vencimento", hoje)
    .order("data_vencimento", { ascending: true });

  if (error) {
    console.error(error);
    return { pontosVencendoEmBreve: 0, dataProximoVencimento: null, diasParaVencimento: null };
  }

  const lotes = (data ?? []) as { pontos_restantes: number; data_vencimento: string }[];
  if (lotes.length === 0) {
    return { pontosVencendoEmBreve: 0, dataProximoVencimento: null, diasParaVencimento: null };
  }

  const dataProximo = lotes[0].data_vencimento;
  const diasParaVencimento = diasEntre(hoje, dataProximo);

  const limite = new Date(`${hoje}T00:00:00Z`);
  limite.setUTCDate(limite.getUTCDate() + DIAS_AVISO_VENCIMENTO);
  const limiteISO = limite.toISOString().slice(0, 10);

  const pontosVencendoEmBreve = lotes
    .filter((lote) => lote.data_vencimento <= limiteISO)
    .reduce((total, lote) => total + lote.pontos_restantes, 0);

  return { pontosVencendoEmBreve, dataProximoVencimento: dataProximo, diasParaVencimento };
}

export interface DescontoCliente {
  id: string;
  pontos: number;
  descontoReais: number;
  data: string;
}

export async function listarDescontosCliente(clienteId: string): Promise<DescontoCliente[]> {
  const { data, error } = await supabase
    .from("descontos_pontos")
    .select("id, pontos_utilizados, desconto_reais, created_at")
    .eq("cliente_id", clienteId);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((linha) => {
    const d = linha as { id: string; pontos_utilizados: number; desconto_reais: number; created_at: string };
    return { id: d.id, pontos: d.pontos_utilizados, descontoReais: d.desconto_reais, data: d.created_at };
  });
}

export interface LoteExpirado {
  id: string;
  pontos: number;
  data: string;
}

// Lotes já vencidos que ainda tinham pontos — usados só para o histórico
// (esses pontos já não contam no saldo disponível).
export async function listarLotesExpirados(clienteId: string): Promise<LoteExpirado[]> {
  const hoje = hojeISO();

  const { data, error } = await supabase
    .from("pontos_lotes")
    .select("id, pontos_restantes, data_vencimento")
    .eq("cliente_id", clienteId)
    .gt("pontos_restantes", 0)
    .not("data_vencimento", "is", null)
    .lt("data_vencimento", hoje);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((linha) => {
    const l = linha as { id: string; pontos_restantes: number; data_vencimento: string };
    return { id: l.id, pontos: l.pontos_restantes, data: l.data_vencimento };
  });
}

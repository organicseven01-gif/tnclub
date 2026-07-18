import type { Cliente } from "@/types";
import { getNivelPorPontos } from "@/utils/tier";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";
import { buscarClientePorId } from "./clienteService";

// Ajustes de saldo de uso geral (ex.: correção manual futura). Os fluxos
// críticos (registrar atendimento, resgatar benefício) NÃO usam estas
// funções — eles chamam funções SQL transacionais (ver pontuacaoService e
// resgateService) para garantir atomicidade real no banco.
export async function adicionarPontos(clienteId: string, pontos: number): Promise<Cliente> {
  const cliente = await buscarClientePorId(clienteId);

  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }

  const novoSaldo = cliente.saldoPontos + pontos;

  const { error } = await supabase
    .from("clientes")
    .update({ saldo_pontos: novoSaldo, nivel: getNivelPorPontos(novoSaldo) })
    .eq("id", clienteId);

  if (error) lancarErroAmigavel(error, "Não foi possível atualizar o saldo do cliente.");

  return (await buscarClientePorId(clienteId))!;
}

export async function removerPontos(clienteId: string, pontos: number): Promise<Cliente> {
  const cliente = await buscarClientePorId(clienteId);

  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }

  if (cliente.saldoPontos < pontos) {
    throw new Error("Saldo de pontos insuficiente.");
  }

  const novoSaldo = cliente.saldoPontos - pontos;

  const { error } = await supabase
    .from("clientes")
    .update({ saldo_pontos: novoSaldo, nivel: getNivelPorPontos(novoSaldo) })
    .eq("id", clienteId);

  if (error) lancarErroAmigavel(error, "Não foi possível atualizar o saldo do cliente.");

  return (await buscarClientePorId(clienteId))!;
}

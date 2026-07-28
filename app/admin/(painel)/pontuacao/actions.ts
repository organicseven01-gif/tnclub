"use server";

import { revalidatePath } from "next/cache";
import { registrarVenda, type ItemAtendimento } from "@/services/pontuacaoService";
import { enviarEmailPontuacao } from "@/services/emailService";
import { formatCurrency, formatPoints } from "@/utils/formatters";
import type { FormState } from "@/types";

export async function registrarAtendimentoAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const clienteId = String(formData.get("clienteId") ?? "");
  const observacao = String(formData.get("observacao") ?? "");
  const descontoReais = Math.max(0, Math.floor(Number(formData.get("descontoReais") ?? 0)) || 0);

  if (!clienteId) {
    return { error: "Selecione um cliente." };
  }

  let itensBrutos: unknown;
  try {
    itensBrutos = JSON.parse(String(formData.get("itens") ?? "[]"));
  } catch {
    return { error: "Não foi possível ler os serviços informados." };
  }

  if (!Array.isArray(itensBrutos)) {
    return { error: "Não foi possível ler os serviços informados." };
  }

  const itens: ItemAtendimento[] = itensBrutos
    .filter(
      (item): item is { servicoId: string; quantidade: number } =>
        !!item && typeof item.servicoId === "string" && item.servicoId.length > 0 && Number(item.quantidade) > 0
    )
    .map((item) => ({ servicoId: item.servicoId, quantidade: Number(item.quantidade) }));

  if (itens.length === 0) {
    return { error: "Adicione ao menos um serviço." };
  }

  let resumo;
  try {
    resumo = await registrarVenda(clienteId, itens, observacao, descontoReais);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Não foi possível registrar o atendimento.",
    };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/historico");
  revalidatePath("/admin/clientes");
  revalidatePath("/dashboard");
  revalidatePath("/pontos");
  revalidatePath("/historico");
  revalidatePath("/perfil");

  const info =
    resumo.descontoReais > 0
      ? `Valor a pagar: ${formatCurrency(resumo.valorPagar)} · Desconto de ${formatCurrency(
          resumo.descontoReais
        )} (${formatPoints(resumo.pontosUtilizados)}) · +${formatPoints(resumo.pontosGerados)} gerados`
      : `Valor: ${formatCurrency(resumo.valorTotal)} · +${formatPoints(resumo.pontosGerados)} gerados`;

  return { success: true, info };
}

export interface DadosEmailPontuacao {
  email: string;
  nome: string;
  pontosGerados: number;
  descontoReais: number;
  valorTotal: number;
  valorPagar: number;
}

// Envia ao cliente o resumo da pontuação por e-mail (acionado pelo botão no
// modal de confirmação, após o atendimento ser registrado).
export async function enviarPontuacaoEmailAction(
  dados: DadosEmailPontuacao
): Promise<{ ok: boolean; erro?: string }> {
  if (!dados.email) {
    return { ok: false, erro: "Este cliente não tem e-mail cadastrado." };
  }

  const enviado = await enviarEmailPontuacao(dados.email, {
    nome: dados.nome,
    pontosGerados: dados.pontosGerados,
    descontoReais: dados.descontoReais,
    valorTotal: dados.valorTotal,
    valorPagar: dados.valorPagar,
  });

  if (!enviado) {
    return { ok: false, erro: "Não foi possível enviar o e-mail agora. Tente novamente." };
  }

  return { ok: true };
}

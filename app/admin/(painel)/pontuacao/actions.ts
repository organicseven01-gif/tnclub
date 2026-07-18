"use server";

import { revalidatePath } from "next/cache";
import { registrarMultiplosAtendimentos, type ItemAtendimento } from "@/services/pontuacaoService";
import type { FormState } from "@/types";

export async function registrarAtendimentoAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const clienteId = String(formData.get("clienteId") ?? "");
  const observacao = String(formData.get("observacao") ?? "");

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

  try {
    await registrarMultiplosAtendimentos(clienteId, observacao, itens);
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

  return { success: true };
}

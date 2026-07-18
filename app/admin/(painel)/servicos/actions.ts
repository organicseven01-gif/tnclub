"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarServico, atualizarServico, excluirServico } from "@/services/servicoService";
import type { FormState } from "@/types";

function lerCampos(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const valor = Number(formData.get("valor") ?? 0);
  const pontos = Number(formData.get("pontos") ?? 0);
  const ativo = formData.get("ativo") === "true";

  if (!nome) {
    throw new Error("Informe o nome do serviço.");
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error("Informe um valor válido.");
  }

  if (!Number.isFinite(pontos) || pontos < 0) {
    throw new Error("Os pontos não podem ser negativos.");
  }

  return { nome, valor, pontos, ativo };
}

export async function criarServicoAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await criarServico(lerCampos(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível cadastrar o serviço." };
  }

  revalidatePath("/admin/servicos");
  redirect("/admin/servicos");
}

export async function atualizarServicoAction(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await atualizarServico(id, lerCampos(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível atualizar o serviço." };
  }

  revalidatePath("/admin/servicos");
  redirect("/admin/servicos");
}

export async function excluirServicoAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (id) {
    await excluirServico(id);
    revalidatePath("/admin/servicos");
  }
}

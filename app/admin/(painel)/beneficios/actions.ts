"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  criarBeneficio,
  atualizarBeneficio,
  excluirBeneficio,
  alternarStatusBeneficio,
} from "@/services/beneficioService";
import type { FormState } from "@/types";

function lerCampos(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const pontosNecessarios = Number(formData.get("pontosNecessarios") ?? 0);
  const imagemUrl = String(formData.get("imagemUrl") ?? "").trim() || undefined;
  const ativo = formData.get("ativo") === "true";

  if (!nome) {
    throw new Error("Informe o nome do benefício.");
  }

  if (!descricao) {
    throw new Error("Informe a descrição do benefício.");
  }

  if (!Number.isFinite(pontosNecessarios) || pontosNecessarios <= 0) {
    throw new Error("Informe uma quantidade de pontos válida.");
  }

  return { nome, descricao, pontosNecessarios, imagemUrl, ativo };
}

export async function criarBeneficioAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await criarBeneficio(lerCampos(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível cadastrar o benefício." };
  }

  revalidatePath("/admin/beneficios");
  revalidatePath("/beneficios");
  redirect("/admin/beneficios");
}

export async function atualizarBeneficioAction(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await atualizarBeneficio(id, lerCampos(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível atualizar o benefício." };
  }

  revalidatePath("/admin/beneficios");
  revalidatePath("/beneficios");
  redirect("/admin/beneficios");
}

export async function excluirBeneficioAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (id) {
    await excluirBeneficio(id);
    revalidatePath("/admin/beneficios");
    revalidatePath("/beneficios");
  }
}

export async function alternarStatusBeneficioAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (id) {
    await alternarStatusBeneficio(id);
    revalidatePath("/admin/beneficios");
    revalidatePath("/beneficios");
  }
}

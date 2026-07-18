"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarCliente, atualizarCliente } from "@/services/clienteService";
import { enviarEmailBoasVindas } from "@/services/emailService";
import type { FormState, NivelFidelidade, StatusCliente } from "@/types";

function lerDadosBasicos(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const cpf = String(formData.get("cpf") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const status = String(formData.get("status") ?? "ativo") as StatusCliente;

  if (!nome || !telefone || !cpf || !email) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  return { nome, telefone, cpf, email, status };
}

function revalidarTelasDoCliente(id?: string) {
  revalidatePath("/admin/clientes");
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard");
  revalidatePath("/perfil");
  if (id) revalidatePath(`/admin/clientes/${id}`);
}

export async function criarClienteAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  let novoClienteId: string;

  try {
    const dados = lerDadosBasicos(formData);
    const cliente = await criarCliente(dados);
    novoClienteId = cliente.id;
    // Boas-vindas por e-mail (best-effort: não bloqueia o cadastro se falhar).
    await enviarEmailBoasVindas(cliente);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível cadastrar o cliente." };
  }

  revalidarTelasDoCliente(novoClienteId);
  // Vai para a ficha do cliente, onde fica o botão de boas-vindas no WhatsApp.
  redirect(`/admin/clientes/${novoClienteId}`);
}

export async function atualizarClienteAction(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const dados = lerDadosBasicos(formData);
    const nivel = String(formData.get("nivel") ?? "bronze") as NivelFidelidade;
    const saldoPontos = Number(formData.get("saldoPontos") ?? 0);
    await atualizarCliente(id, { ...dados, nivel, saldoPontos });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível atualizar o cliente." };
  }

  revalidarTelasDoCliente(id);
  redirect("/admin/clientes");
}

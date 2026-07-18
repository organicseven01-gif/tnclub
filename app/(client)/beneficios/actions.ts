"use server";

import { revalidatePath } from "next/cache";
import { getClienteAtual } from "@/services/clienteService";
import { resgatarBeneficio } from "@/services/resgateService";
import type { FormState } from "@/types";

export async function resgatarBeneficioAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const beneficioId = String(formData.get("beneficioId") ?? "");

  if (!beneficioId) {
    return { error: "Benefício inválido." };
  }

  const cliente = await getClienteAtual();

  if (!cliente) {
    return { error: "Você precisa entrar antes de resgatar um benefício." };
  }

  const resultado = await resgatarBeneficio(cliente.id, beneficioId);

  if (!resultado.sucesso) {
    return { error: resultado.mensagem };
  }

  revalidatePath("/beneficios");
  revalidatePath("/pontos");
  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/clientes");
  revalidatePath("/admin/historico");

  return { success: true };
}

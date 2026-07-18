"use server";

import { revalidatePath } from "next/cache";
import { salvarConfiguracao } from "@/services/configuracaoService";
import type { FormState } from "@/types";

export async function salvarConfiguracaoAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const limitePrata = Number(formData.get("limitePrata") ?? 0);
  const limiteOuro = Number(formData.get("limiteOuro") ?? 0);
  const limitePlatina = Number(formData.get("limitePlatina") ?? 0);
  const limiteDiamante = Number(formData.get("limiteDiamante") ?? 0);

  const limites = [limitePrata, limiteOuro, limitePlatina, limiteDiamante];

  if (limites.some((valor) => !Number.isFinite(valor) || valor <= 0)) {
    return { error: "Os pontos de cada nível devem ser números maiores que zero." };
  }

  // Cada nível precisa exigir mais pontos que o anterior.
  if (
    !(limitePrata < limiteOuro && limiteOuro < limitePlatina && limitePlatina < limiteDiamante)
  ) {
    return {
      error: "Os níveis devem estar em ordem crescente: Prata < Ouro < Platina < Diamante.",
    };
  }

  try {
    await salvarConfiguracao({ whatsapp, limitePrata, limiteOuro, limitePlatina, limiteDiamante });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Não foi possível salvar as configurações.",
    };
  }

  // Os novos limites afetam níveis exibidos ao cliente e no painel.
  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin/clientes");
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard");
  revalidatePath("/pontos");
  revalidatePath("/perfil");

  return { success: true };
}

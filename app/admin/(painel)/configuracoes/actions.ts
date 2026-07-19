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
  const limiteDiamante = Number(formData.get("limiteDiamante") ?? 0);

  const reaisPorPonto = Number(formData.get("reaisPorPonto") ?? 0);
  const pontosPorRealDesconto = Number(formData.get("pontosPorRealDesconto") ?? 0);
  const validadePontosAtiva = formData.get("validadePontosAtiva") === "true";
  const validadePontosDias = Number(formData.get("validadePontosDias") ?? 0);

  const limites = [limitePrata, limiteOuro, limiteDiamante];

  if (limites.some((valor) => !Number.isInteger(valor) || valor <= 0)) {
    return { error: "A quantidade de serviços de cada nível deve ser um número inteiro maior que zero." };
  }

  // Cada nível precisa exigir mais serviços que o anterior.
  if (!(limitePrata < limiteOuro && limiteOuro < limiteDiamante)) {
    return {
      error: "Os níveis devem estar em ordem crescente: Prata < Ouro < Diamante.",
    };
  }

  if (!Number.isFinite(reaisPorPonto) || reaisPorPonto <= 0) {
    return { error: "Informe quantos reais valem 1 ponto (maior que zero)." };
  }

  if (!Number.isInteger(pontosPorRealDesconto) || pontosPorRealDesconto <= 0) {
    return { error: "Informe quantos pontos valem R$ 1,00 de desconto (número inteiro maior que zero)." };
  }

  if (!Number.isInteger(validadePontosDias) || validadePontosDias <= 0) {
    return { error: "Informe o período de validade dos pontos em dias (maior que zero)." };
  }

  try {
    await salvarConfiguracao({
      whatsapp,
      limitePrata,
      limiteOuro,
      limiteDiamante,
      reaisPorPonto,
      pontosPorRealDesconto,
      validadePontosAtiva,
      validadePontosDias,
    });
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

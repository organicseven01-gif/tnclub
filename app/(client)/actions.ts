"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { buscarClientePorCpfOuTelefone, COOKIE_CLIENTE_ID } from "@/services/clienteService";
import type { FormState } from "@/types";

export async function entrarComoClienteAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const termo = String(formData.get("termo") ?? "").trim();

  if (!termo) {
    return { error: "Informe seu CPF ou telefone." };
  }

  const cliente = await buscarClientePorCpfOuTelefone(termo);

  if (!cliente) {
    return { error: "Não encontramos seu cadastro." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_CLIENTE_ID, cliente.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/dashboard");
}

export async function sairClienteAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_CLIENTE_ID);
  redirect("/");
}

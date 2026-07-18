"use server";

import { redirect } from "next/navigation";
import { criarClienteSupabaseServidor } from "@/services/supabaseServer";
import type { FormState } from "@/types";

export async function entrarComoAdminAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await criarClienteSupabaseServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  redirect("/admin/dashboard");
}

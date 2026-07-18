"use server";

import { redirect } from "next/navigation";
import { criarClienteSupabaseServidor } from "@/services/supabaseServer";

export async function sairAdminAction() {
  const supabase = await criarClienteSupabaseServidor();
  await supabase.auth.signOut();
  redirect("/");
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variáveis NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. " +
      "Copie .env.local.example para .env.local e preencha com os dados do seu projeto Supabase."
  );
}

// Cliente Supabase ciente de cookies, usado apenas para Auth (login/logout do
// painel administrativo). Consultas de dados seguem usando o cliente simples
// em "services/supabase.ts" — nenhuma sessão de usuário é necessária ali.
export async function criarClienteSupabaseServidor() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado a partir de um Server Component sem permissão de escrita —
          // seguro ignorar, pois o middleware já cuida de renovar a sessão.
        }
      },
    },
  });
}

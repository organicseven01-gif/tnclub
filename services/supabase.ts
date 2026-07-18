import { createClient } from "@supabase/supabase-js";

// Ponto único de acesso ao Supabase. Todos os services importam este cliente
// em vez de criar suas próprias instâncias — quando a Etapa 6 (autenticação)
// chegar, este é o único arquivo que precisa migrar para @supabase/ssr
// (cliente por requisição, ciente da sessão do usuário).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variáveis NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. " +
      "Copie .env.local.example para .env.local e preencha com os dados do seu projeto Supabase."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

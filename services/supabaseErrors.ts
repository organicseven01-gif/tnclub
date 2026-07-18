import type { PostgrestError } from "@supabase/supabase-js";

// Registra o erro real (para depuração) e lança uma mensagem amigável para a tela.
export function lancarErroAmigavel(erro: PostgrestError | Error, mensagem: string): never {
  console.error(erro);
  throw new Error(mensagem);
}

// Monta um link wa.me com mensagem pronta. Mantém só os dígitos e adiciona o
// código do Brasil (55) quando o número vem sem ele. Retorna null se não houver
// número configurado (aí o botão simplesmente não aparece).
export function linkWhatsApp(numero: string, mensagem: string): string | null {
  let digitos = numero.replace(/\D/g, "");
  if (!digitos) return null;
  if (!digitos.startsWith("55") && digitos.length <= 11) {
    digitos = `55${digitos}`;
  }
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

export const MENSAGEM_AJUDA = "Olá! Preciso de ajuda com o Clube de Benefícios TN Club.";

// Atalho usado pelo botão "Ajuda" no topo da área do cliente.
export function linkWhatsAppAjuda(numero: string, mensagem = MENSAGEM_AJUDA): string | null {
  return linkWhatsApp(numero, mensagem);
}

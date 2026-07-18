// Monta o link wa.me para o botão de "Ajuda" do cliente. Mantém só os dígitos
// e adiciona o código do Brasil (55) quando o número vem sem ele. Retorna null
// se não houver número configurado (aí o botão simplesmente não aparece).
export function linkWhatsAppAjuda(
  numero: string,
  mensagem = "Olá! Preciso de ajuda com o Clube de Benefícios TN Club."
): string | null {
  let digitos = numero.replace(/\D/g, "");
  if (!digitos) return null;
  if (!digitos.startsWith("55") && digitos.length <= 11) {
    digitos = `55${digitos}`;
  }
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

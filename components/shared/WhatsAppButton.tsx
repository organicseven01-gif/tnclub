import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  numero: string;
  mensagem?: string;
}

// Monta o link wa.me a partir do número cadastrado pelo admin. Mantém só os
// dígitos e adiciona o código do Brasil (55) quando o número vem sem ele.
function montarLink(numero: string, mensagem: string): string | null {
  let digitos = numero.replace(/\D/g, "");
  if (!digitos) return null;
  if (!digitos.startsWith("55") && digitos.length <= 11) {
    digitos = `55${digitos}`;
  }
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

export function WhatsAppButton({
  numero,
  mensagem = "Olá! Preciso de ajuda com o Clube de Benefícios TN Club.",
}: WhatsAppButtonProps) {
  const link = montarLink(numero, mensagem);

  // Sem número cadastrado nas configurações, o botão simplesmente não aparece.
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform active:scale-95"
    >
      <MessageCircle size={26} strokeWidth={2} fill="currentColor" className="text-white" />
    </a>
  );
}

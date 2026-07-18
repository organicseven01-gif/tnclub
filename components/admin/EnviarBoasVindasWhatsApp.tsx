import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { linkWhatsAppBoasVindas } from "@/utils/boasVindas";
import type { Cliente } from "@/types";

interface EnviarBoasVindasWhatsAppProps {
  cliente: Cliente;
}

// Botão semi-automático: abre o WhatsApp com a mensagem de boas-vindas pronta
// para o telefone do cliente. O admin só confere e aperta enviar.
export function EnviarBoasVindasWhatsApp({ cliente }: EnviarBoasVindasWhatsAppProps) {
  const link = linkWhatsAppBoasVindas(cliente);

  return (
    <Card padding="lg" className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-ink">Boas-vindas ao cliente</h3>
        <p className="mt-1 text-xs text-ink/50">
          Um e-mail de boas-vindas é enviado automaticamente no cadastro. Envie também pelo WhatsApp
          com um clique — a mensagem já vai pronta.
        </p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <MessageCircle size={18} strokeWidth={2} />
        Enviar boas-vindas no WhatsApp
      </a>
    </Card>
  );
}

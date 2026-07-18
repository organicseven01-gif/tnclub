import type { Cliente } from "@/types";
import { assuntoBoasVindas, htmlBoasVindas } from "@/utils/boasVindas";

// Remetente: começa com o domínio de teste do Resend. Depois de verificar o
// domínio tnclub.com.br no Resend, troque para "TN Club <contato@tnclub.com.br>"
// pela variável EMAIL_REMETENTE.
const REMETENTE_PADRAO = "TN Club <onboarding@resend.dev>";

// Envia o e-mail de boas-vindas via API do Resend. É "best-effort": nunca lança
// erro para não impedir o cadastro do cliente. Retorna true se enviou.
export async function enviarEmailBoasVindas(cliente: Cliente): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  // Sem chave configurada (ex.: antes de criar a conta no Resend), apenas
  // ignora — o cadastro continua funcionando normalmente.
  if (!apiKey) {
    console.warn("RESEND_API_KEY não configurada: e-mail de boas-vindas não enviado.");
    return false;
  }

  if (!cliente.email) return false;

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_REMETENTE || REMETENTE_PADRAO,
        to: [cliente.email],
        subject: assuntoBoasVindas(),
        html: htmlBoasVindas(cliente),
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("Falha ao enviar e-mail de boas-vindas:", resposta.status, detalhe);
      return false;
    }

    return true;
  } catch (erro) {
    console.error("Erro ao enviar e-mail de boas-vindas:", erro);
    return false;
  }
}

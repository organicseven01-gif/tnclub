import type { Cliente } from "@/types";
import { assuntoBoasVindas, htmlBoasVindas } from "@/utils/boasVindas";
import { assuntoPontuacao, htmlPontuacao, type ResumoPontuacao } from "@/utils/mensagemPontuacao";

// Remetente padrão: domínio tnclub.com.br já verificado no Resend. Pode ser
// sobrescrito pela variável EMAIL_REMETENTE (ex.: outro endereço @tnclub.com.br).
const REMETENTE_PADRAO = "TN Club <contato@tnclub.com.br>";

// Envio genérico via API do Resend. É "best-effort": nunca lança erro.
// Retorna true se enviou.
async function enviarEmail(para: string, assunto: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("RESEND_API_KEY não configurada: e-mail não enviado.");
    return false;
  }
  if (!para) return false;

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_REMETENTE || REMETENTE_PADRAO,
        to: [para],
        subject: assunto,
        html,
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("Falha ao enviar e-mail:", resposta.status, detalhe);
      return false;
    }

    return true;
  } catch (erro) {
    console.error("Erro ao enviar e-mail:", erro);
    return false;
  }
}

// E-mail de boas-vindas (enviado no cadastro do cliente).
export async function enviarEmailBoasVindas(cliente: Cliente): Promise<boolean> {
  return enviarEmail(cliente.email, assuntoBoasVindas(), htmlBoasVindas(cliente));
}

// E-mail com o resumo da pontuação (enviado pelo admin após registrar o atendimento).
export async function enviarEmailPontuacao(email: string, resumo: ResumoPontuacao): Promise<boolean> {
  return enviarEmail(email, assuntoPontuacao(), htmlPontuacao(resumo));
}

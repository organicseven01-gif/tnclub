import type { Cliente } from "@/types";

// URL pública da plataforma (onde o cliente entra com CPF/telefone). Vem do
// ambiente para funcionar igual em produção e em testes.
export function getLinkPlataforma(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://tnclub.com.br";
}

// ------------------------------------------------------------------------
// Conteúdo das boas-vindas, centralizado aqui para WhatsApp e e-mail usarem
// o mesmo texto. Quando as REGRAS do clube forem definidas, basta ajustar o
// bloco "comoFunciona" / adicionar uma seção de regras — os dois canais
// (WhatsApp e e-mail) refletem a mudança automaticamente.
// ------------------------------------------------------------------------

const comoFunciona = [
  "⭐ A cada serviço realizado, você acumula pontos.",
  "🎁 Troque seus pontos por benefícios exclusivos.",
  "📈 Acompanhe seu histórico e saldo quando quiser.",
];

// TODO (regras): quando as regras oficiais do clube forem definidas, incluir
// aqui os detalhes (ex.: quantos pontos por real, validade, condições) — o
// texto abaixo já está preparado para receber essa seção.

export function assuntoBoasVindas(): string {
  return "Bem-vindo(a) ao TN Club! 🌱";
}

// Versão em texto puro — usada no link do WhatsApp.
export function textoBoasVindas(cliente: Cliente): string {
  const link = getLinkPlataforma();
  const primeiroNome = cliente.nome.split(" ")[0];

  return [
    `Olá, ${primeiroNome}! 👋`,
    "",
    "Você agora faz parte do TN Club, o Clube de Benefícios da TN Clean! 🎉",
    "",
    "Como funciona:",
    ...comoFunciona,
    "",
    `Acesse sua conta com seu CPF ou telefone: ${link}`,
    "",
    "Qualquer dúvida, é só chamar. Bem-vindo(a)!",
    "Equipe TN Clean",
  ].join("\n");
}

// Monta o link wa.me para enviar as boas-vindas ao telefone do cliente
// (o admin clica e só aperta enviar no WhatsApp).
export function linkWhatsAppBoasVindas(cliente: Cliente): string {
  let digitos = cliente.telefone.replace(/\D/g, "");
  if (!digitos.startsWith("55") && digitos.length <= 11) {
    digitos = `55${digitos}`;
  }
  return `https://wa.me/${digitos}?text=${encodeURIComponent(textoBoasVindas(cliente))}`;
}

// Versão em HTML — usada no corpo do e-mail.
export function htmlBoasVindas(cliente: Cliente): string {
  const link = getLinkPlataforma();
  const primeiroNome = cliente.nome.split(" ")[0];
  const itens = comoFunciona.map((item) => `<li style="margin-bottom:8px">${item}</li>`).join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#222">
    <h1 style="color:#124734;font-size:22px">Bem-vindo(a) ao TN Club! 🌱</h1>
    <p>Olá, <strong>${primeiroNome}</strong>! 👋</p>
    <p>Você agora faz parte do <strong>TN Club</strong>, o Clube de Benefícios da TN Clean! 🎉</p>
    <p style="margin-bottom:6px"><strong>Como funciona:</strong></p>
    <ul style="padding-left:18px;margin-top:0">${itens}</ul>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:#1F7A4A;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:bold;display:inline-block">
        Acessar minha conta
      </a>
    </p>
    <p style="color:#666;font-size:13px">Entre com seu CPF ou telefone em <a href="${link}">${link}</a>.</p>
    <p style="color:#666;font-size:13px">Qualquer dúvida, estamos à disposição.<br/>Equipe TN Clean</p>
  </div>`;
}

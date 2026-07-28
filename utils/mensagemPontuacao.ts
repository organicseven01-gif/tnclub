import { getLinkPlataforma } from "./boasVindas";

export interface ResumoPontuacao {
  nome: string;
  pontosGerados: number;
  descontoReais: number;
  valorTotal: number;
  valorPagar: number;
}

function reais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function assuntoPontuacao(): string {
  return "Seus pontos no TN Club 🌱";
}

// Texto puro — usado no link do WhatsApp enviado ao cliente.
export function textoPontuacao(r: ResumoPontuacao): string {
  const link = getLinkPlataforma();
  const primeiroNome = r.nome.split(" ")[0];

  const linhas = [
    `Olá, ${primeiroNome}! 🎉`,
    `Seu atendimento na TN Clean foi registrado no TN Club.`,
    ``,
    `Você ganhou ${r.pontosGerados} pontos nesta visita!`,
  ];
  if (r.descontoReais > 0) {
    linhas.push(`Desconto usado com pontos: ${reais(r.descontoReais)}`);
  }
  linhas.push(``, `Acompanhe seus pontos e benefícios em: ${link}`);

  return linhas.join("\n");
}

// HTML — usado no corpo do e-mail enviado ao cliente.
export function htmlPontuacao(r: ResumoPontuacao): string {
  const link = getLinkPlataforma();
  const primeiroNome = r.nome.split(" ")[0];
  const desconto =
    r.descontoReais > 0
      ? `<p style="margin:4px 0">Desconto usado com pontos: <strong>${reais(r.descontoReais)}</strong></p>`
      : "";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#222">
    <h1 style="color:#124734;font-size:22px">Seus pontos no TN Club 🌱</h1>
    <p>Olá, <strong>${primeiroNome}</strong>! 🎉</p>
    <p>Seu atendimento na TN Clean foi registrado. Veja o resumo:</p>
    <div style="background:#f5f5f5;border-radius:12px;padding:16px;margin:16px 0">
      <p style="margin:4px 0">Pontos ganhos nesta visita: <strong>${r.pontosGerados}</strong></p>
      ${desconto}
    </div>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:#1F7A4A;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:bold;display:inline-block">
        Ver meus pontos
      </a>
    </p>
    <p style="color:#666;font-size:13px">Entre com seu CPF ou telefone em <a href="${link}">${link}</a>.</p>
    <p style="color:#666;font-size:13px">Obrigado por escolher a TN Clean!</p>
  </div>`;
}

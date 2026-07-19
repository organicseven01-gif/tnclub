"use client";

import { useActionState } from "react";
import { CheckCircle2, Gift, MessageCircle } from "lucide-react";
import { Card, Button, Alert } from "@/components/ui";
import { formatCurrency, formatPoints } from "@/utils/formatters";
import { linkWhatsApp } from "@/utils/whatsapp";
import { initialFormState } from "@/types";
import type { Beneficio, FormState } from "@/types";

interface RewardCardProps {
  beneficio: Beneficio;
  clienteNome: string;
  saldoCliente: number;
  pontosPorRealDesconto: number;
  whatsapp: string;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

// Botão verde que abre o WhatsApp da TN Clean com o resumo pronto.
function BotaoAtendente({ link, texto }: { link: string; texto: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90"
    >
      <MessageCircle size={15} strokeWidth={2} />
      {texto}
    </a>
  );
}

export function RewardCard({
  beneficio,
  clienteNome,
  saldoCliente,
  pontosPorRealDesconto,
  whatsapp,
  action,
}: RewardCardProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const suficiente = saldoCliente >= beneficio.pontosNecessarios;
  const faltamPontos = Math.max(0, beneficio.pontosNecessarios - saldoCliente);
  const faltamReais =
    pontosPorRealDesconto > 0 ? Math.ceil(faltamPontos / pontosPorRealDesconto) : 0;

  // Resumo enviado ao atendente após o resgate ser registrado.
  const linkResgatado = linkWhatsApp(
    whatsapp,
    [
      `Olá! Acabei de resgatar um benefício no TN Club.`,
      ``,
      `Cliente: ${clienteNome}`,
      `Benefício: ${beneficio.nome}`,
      `Pontos utilizados: ${beneficio.pontosNecessarios}`,
      ``,
      `Podemos combinar como fica o restante?`,
    ].join("\n")
  );

  // Resumo para quem ainda não tem pontos suficientes (combinar o complemento).
  const linkFaltando = linkWhatsApp(
    whatsapp,
    [
      `Olá! Quero resgatar um benefício no TN Club.`,
      ``,
      `Cliente: ${clienteNome}`,
      `Benefício: ${beneficio.nome} (${beneficio.pontosNecessarios} pontos)`,
      `Tenho: ${saldoCliente} pontos`,
      `Faltam: ${faltamPontos} pontos (${formatCurrency(faltamReais)})`,
      ``,
      `Podemos combinar?`,
    ].join("\n")
  );

  return (
    <Card padding="md" className="flex flex-col">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10">
        <Gift size={22} className="text-brand" strokeWidth={1.75} />
      </div>

      <h3 className="mt-4 text-base font-bold text-ink">{beneficio.nome}</h3>
      <p className="mt-1 flex-1 text-xs text-ink/50">{beneficio.descricao}</p>

      <p className="mt-4 text-sm font-bold text-brand-dark">
        {formatPoints(beneficio.pontosNecessarios)}
      </p>

      {state.success ? (
        <>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-brand-light/15 py-3 text-sm font-semibold text-brand-dark">
            <CheckCircle2 size={16} />
            Resgate confirmado!
          </div>
          {linkResgatado ? (
            <BotaoAtendente link={linkResgatado} texto="Avisar atendente" />
          ) : (
            <p className="mt-3 text-center text-xs text-ink/50">
              Fale com a TN Clean para combinar a retirada.
            </p>
          )}
        </>
      ) : suficiente ? (
        <form action={formAction} className="mt-3">
          <input type="hidden" name="beneficioId" value={beneficio.id} />
          {state.error && (
            <Alert variant="error" className="mb-3">
              {state.error}
            </Alert>
          )}
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Resgatando..." : "Resgatar"}
          </Button>
        </form>
      ) : (
        <>
          <div className="mt-3 rounded-2xl bg-surface px-3 py-3">
            <p className="text-xs font-semibold text-ink">Você tem {formatPoints(saldoCliente)}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/55">
              Faltam {formatPoints(faltamPontos)} — complete com{" "}
              <strong className="text-brand-dark">{formatCurrency(faltamReais)}</strong> no
              atendimento para resgatar.
            </p>
          </div>
          {linkFaltando && <BotaoAtendente link={linkFaltando} texto="Falar com atendente" />}
        </>
      )}
    </Card>
  );
}

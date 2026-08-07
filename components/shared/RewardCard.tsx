"use client";

import { useActionState, useEffect, useState } from "react";
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

export function RewardCard({
  beneficio,
  clienteNome,
  saldoCliente,
  pontosPorRealDesconto,
  whatsapp,
  action,
}: RewardCardProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const [aberto, setAberto] = useState(false);

  const suficiente = saldoCliente >= beneficio.pontosNecessarios;
  // Pontos que serão usados neste resgate (todos, se não bastar para o custo).
  const pontosUsados = Math.min(saldoCliente, beneficio.pontosNecessarios);
  const faltamPontos = Math.max(0, beneficio.pontosNecessarios - saldoCliente);
  const diferencaReais =
    pontosPorRealDesconto > 0 ? Math.ceil(faltamPontos / pontosPorRealDesconto) : 0;

  // Mensagem enviada ao WhatsApp da empresa após confirmar o resgate.
  const linkResgatado = linkWhatsApp(
    whatsapp,
    (suficiente
      ? [
          `Olá! Acabei de resgatar um benefício no TN Club.`,
          ``,
          `Cliente: ${clienteNome}`,
          `Benefício: ${beneficio.nome}`,
          `Pontos utilizados: ${pontosUsados}`,
          ``,
          `Podemos agendar o serviço?`,
        ]
      : [
          `Olá! Acabei de resgatar um benefício no TN Club.`,
          ``,
          `Cliente: ${clienteNome}`,
          `Benefício: ${beneficio.nome} (${beneficio.pontosNecessarios} pontos)`,
          `Usei meus ${pontosUsados} pontos.`,
          `Falta pagar: ${formatCurrency(diferencaReais)}`,
          ``,
          `Podemos agendar o serviço?`,
        ]
    ).join("\n")
  );

  // Após confirmar o resgate, direciona o cliente ao WhatsApp da empresa.
  useEffect(() => {
    if (state.success && linkResgatado) {
      const t = setTimeout(() => {
        window.location.href = linkResgatado;
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [state.success, linkResgatado]);

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

      {/* Quando o cliente não tem o saldo cheio, avisa a diferença a pagar. */}
      {!suficiente && (
        <div className="mt-3 rounded-2xl bg-surface px-3 py-3">
          <p className="text-xs font-semibold text-ink">Você tem {formatPoints(saldoCliente)}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink/55">
            Pode resgatar usando seus pontos e pagando{" "}
            <strong className="text-brand-dark">{formatCurrency(diferencaReais)}</strong> de diferença
            no atendimento.
          </p>
        </div>
      )}

      <Button type="button" size="md" className="mt-3" onClick={() => setAberto(true)}>
        Quero resgatar
      </Button>

      {/* Modal: confirmação do resgate → depois, WhatsApp da empresa */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => !pending && setAberto(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {state.success ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light/15">
                  <CheckCircle2 size={28} className="text-brand-dark" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">Resgate confirmado!</h3>
                <p className="mt-2 text-sm text-ink">
                  Você usou <strong>{formatPoints(pontosUsados)}</strong> neste resgate.
                </p>
                {!suficiente && diferencaReais > 0 && (
                  <p className="mt-1 text-sm text-ink/60">
                    Falta pagar{" "}
                    <strong className="text-brand-dark">{formatCurrency(diferencaReais)}</strong> de
                    diferença no atendimento.
                  </p>
                )}
                <p className="mt-2 text-sm text-ink/60">
                  {linkResgatado
                    ? "Abrindo o WhatsApp da TN Clean para você combinar a retirada..."
                    : "Fale com a TN Clean para combinar a retirada do seu benefício."}
                </p>

                {linkResgatado && (
                  <a
                    href={linkResgatado}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle size={17} strokeWidth={2} />
                    Abrir o WhatsApp
                  </a>
                )}

                {linkResgatado && (
                  <p className="mt-2 text-[11px] text-ink/40">
                    Se não abrir sozinho, toque no botão acima.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="mt-3 w-full text-sm font-medium text-ink/50"
                >
                  Fechar
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
                  <Gift size={26} className="text-brand" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">Confirmar resgate</h3>
                <p className="mt-1 text-sm text-ink/60">
                  {suficiente ? (
                    <>
                      Você quer resgatar <strong className="text-ink">{beneficio.nome}</strong>? Serão
                      usados{" "}
                      <strong className="text-ink">{formatPoints(beneficio.pontosNecessarios)}</strong>{" "}
                      do seu saldo.
                    </>
                  ) : (
                    <>
                      Você quer resgatar <strong className="text-ink">{beneficio.nome}</strong>? Serão
                      usados seus <strong className="text-ink">{formatPoints(pontosUsados)}</strong> e
                      você paga{" "}
                      <strong className="text-brand-dark">{formatCurrency(diferencaReais)}</strong> de
                      diferença no atendimento.
                    </>
                  )}
                </p>

                {state.error && (
                  <Alert variant="error" className="mt-3 text-left">
                    {state.error}
                  </Alert>
                )}

                <form action={formAction} className="mt-5">
                  <input type="hidden" name="beneficioId" value={beneficio.id} />
                  <Button type="submit" size="md" disabled={pending}>
                    {pending ? "Resgatando..." : "Sim, resgatar"}
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  disabled={pending}
                  className="mt-3 w-full text-sm font-medium text-ink/50 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

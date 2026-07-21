"use client";

import { useActionState } from "react";
import { AlertCircle, MessageCircle } from "lucide-react";
import { Card, MaskedInput, Button } from "@/components/ui";
import { maskCpf } from "@/utils/formatters";
import { linkWhatsApp } from "@/utils/whatsapp";
import { initialFormState } from "@/types";
import { entrarComoClienteAction } from "./actions";

// Mensagem devolvida pela action quando o CPF/telefone não existe no sistema.
const NAO_ENCONTRADO = "Não encontramos seu cadastro.";

interface LoginCardProps {
  whatsapp: string;
}

export function LoginCard({ whatsapp }: LoginCardProps) {
  const [state, formAction, pending] = useActionState(entrarComoClienteAction, initialFormState);

  const naoEncontrado = state.error === NAO_ENCONTRADO;
  const linkCadastro = linkWhatsApp(
    whatsapp,
    "Olá! Tentei acessar o TN Club e não encontrei meu cadastro. Podem me cadastrar no Clube de Benefícios?"
  );

  return (
    <Card
      padding="lg"
      className="animate-fade-in-up mt-8 shadow-soft"
      style={{ animationDelay: "120ms" }}
    >
      <h2 className="text-lg font-bold text-ink">Acesse sua conta</h2>
      <p className="mt-1 text-sm text-ink/55">
        Consulte seus pontos, acompanhe seu histórico e descubra seus benefícios.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        {state.error && (
          <div
            className={
              naoEncontrado
                ? "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-left"
                : "rounded-2xl bg-surface px-4 py-3.5 text-left"
            }
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={18}
                className={naoEncontrado ? "mt-0.5 shrink-0 text-amber-600" : "mt-0.5 shrink-0 text-brand-dark"}
                strokeWidth={2}
              />
              <div>
                <p
                  className={
                    naoEncontrado ? "text-sm font-semibold text-amber-900" : "text-sm font-semibold text-ink"
                  }
                >
                  {state.error}
                </p>
                {naoEncontrado && (
                  <p className="mt-1 text-xs leading-relaxed text-amber-800">
                    Confira se digitou corretamente. Se você ainda não faz parte do clube, fale com a
                    TN Clean para ativar sua participação.
                  </p>
                )}
              </div>
            </div>

            {naoEncontrado && linkCadastro && (
              <a
                href={linkCadastro}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Falar com a TN Clean
              </a>
            )}
          </div>
        )}

        <MaskedInput name="termo" mask={maskCpf} placeholder="Digite seu CPF" required />

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Entrando..." : "Entrar no TN Club"}
        </Button>
      </form>
    </Card>
  );
}

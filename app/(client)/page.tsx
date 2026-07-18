"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Sparkles, Star, Gift, TrendingUp, Info } from "lucide-react";
import { Card, MaskedInput, Button } from "@/components/ui";
import { maskCpfOuTelefone } from "@/utils/formatters";
import { initialFormState } from "@/types";
import { entrarComoClienteAction } from "./actions";

const beneficios = [
  {
    icon: Star,
    titulo: "Acumule Pontos",
    descricao: "Ganhe pontos em todos os serviços.",
  },
  {
    icon: Gift,
    titulo: "Troque por Benefícios",
    descricao: "Resgate vantagens exclusivas.",
  },
  {
    icon: TrendingUp,
    titulo: "Acompanhe seu Histórico",
    descricao: "Veja todos os serviços realizados.",
  },
];

export default function LandingPage() {
  const [state, formAction, pending] = useActionState(entrarComoClienteAction, initialFormState);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white px-6 py-12">
      {/* Detalhes discretos em verde claro, puramente decorativos */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-light/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 top-[38%] h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-brand-light/15 blur-3xl" />

      <div className="relative flex flex-1 flex-col">
        <div className="animate-fade-in-up flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-[28px] shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icone.jpg" alt="TN Club" className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">
            Clube de Benefícios TN Clean
          </h1>
          <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-ink/55">
            A cada serviço realizado você acumula pontos e troca por benefícios exclusivos.
          </p>
          <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-light/15">
            <Sparkles size={18} className="text-brand" strokeWidth={1.75} />
          </div>
        </div>

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
              <div className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3.5 text-left">
                <Info size={17} className="mt-0.5 shrink-0 text-brand-dark" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-semibold text-ink">{state.error}</p>
                  {state.error === "Não encontramos seu cadastro." && (
                    <p className="mt-1 text-xs leading-relaxed text-ink/50">
                      Entre em contato com a TN Clean para ativar sua participação no Clube de
                      Benefícios.
                    </p>
                  )}
                </div>
              </div>
            )}

            <MaskedInput name="termo" mask={maskCpfOuTelefone} placeholder="Digite seu CPF ou telefone" required />

            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "Entrando..." : "Entrar no TN Club"}
            </Button>
          </form>
        </Card>

        <div
          className="animate-fade-in-up mt-8 space-y-3"
          style={{ animationDelay: "220ms" }}
        >
          {beneficios.map((item) => (
            <div
              key={item.titulo}
              className="flex items-center gap-4 rounded-3xl bg-surface px-5 py-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-card">
                <item.icon size={19} className="text-brand" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{item.titulo}</p>
                <p className="text-xs text-ink/50">{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-10 border-t border-black/5 pt-6 text-center">
        <p className="text-xs text-ink/40">© 2026 TN Club</p>
        <p className="mt-0.5 text-xs text-ink/40">Programa Oficial de Benefícios da TN Clean.</p>
        <Link
          href="/admin/login"
          className="mt-4 inline-block text-[11px] text-ink/30 transition-colors hover:text-ink/50"
        >
          Acesso Administrativo
        </Link>
      </div>
    </div>
  );
}

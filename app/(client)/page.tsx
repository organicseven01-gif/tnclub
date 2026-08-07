import Link from "next/link";
import { Sparkles, Star, Gift, TrendingUp } from "lucide-react";
import { getConfiguracao } from "@/services/configuracaoService";
import { LoginCard } from "./LoginCard";

// Lê o WhatsApp das configurações a cada acesso (usado no aviso de cadastro
// não encontrado), então a página não pode ser pré-renderizada estaticamente.
export const dynamic = "force-dynamic";

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

export default async function LandingPage() {
  const { whatsapp } = await getConfiguracao();

  return (
    <div className="login-atmosphere relative flex min-h-screen flex-col overflow-hidden px-6 py-14">
      {/* Brilho verde-claro sutil atrás do topo/logo */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3CCB6C]/20 blur-3xl" />

      {/* Ondas orgânicas na base — curvas suaves, baixa opacidade (5–15%),
          nos três verdes da marca. Criam profundidade sem competir com o
          conteúdo. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] w-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="onda1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0D7A43" />
            <stop offset="1" stopColor="#18A558" />
          </linearGradient>
          <linearGradient id="onda2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#18A558" />
            <stop offset="1" stopColor="#3CCB6C" />
          </linearGradient>
          <linearGradient id="onda3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3CCB6C" />
            <stop offset="1" stopColor="#18A558" />
          </linearGradient>
        </defs>
        <path
          d="M0,132 C90,86 150,150 220,124 C298,95 356,150 400,116 L400,300 L0,300 Z"
          fill="url(#onda1)"
          opacity="0.06"
        />
        <path
          d="M0,182 C96,140 168,206 256,172 C324,146 372,196 400,168 L400,300 L0,300 Z"
          fill="url(#onda2)"
          opacity="0.09"
        />
        <path
          d="M0,228 C104,196 176,252 262,224 C332,202 380,236 400,220 L400,300 L0,300 Z"
          fill="url(#onda3)"
          opacity="0.12"
        />
      </svg>

      {/* Foco de luz suave que mantém o centro (cartão) em evidência */}
      <div className="login-spotlight pointer-events-none absolute inset-0" />

      <div className="relative flex flex-1 flex-col">
        <div className="animate-fade-in-up flex flex-col items-center text-center">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full bg-brand-light/20 blur-2xl" />
            <div className="h-28 w-28 overflow-hidden rounded-[32px] shadow-premium ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icone.jpg" alt="TN Club" className="h-full w-full object-cover" />
            </div>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-dark">
            <Sparkles size={13} className="text-brand" strokeWidth={2} />
            Clube de Benefícios
          </span>
          <h1 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight text-ink">
            Clube de Benefícios TN Clean
          </h1>
          <p className="mt-3 max-w-[290px] text-sm leading-relaxed text-ink/55">
            A cada serviço realizado você acumula pontos e troca por benefícios exclusivos.
          </p>
        </div>

        <LoginCard whatsapp={whatsapp} />

        <div className="animate-fade-in-up mt-8 space-y-3" style={{ animationDelay: "220ms" }}>
          {beneficios.map((item) => (
            <div
              key={item.titulo}
              className="flex items-center gap-4 rounded-3xl border border-white/60 bg-white/70 px-5 py-4 shadow-card ring-1 ring-black/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 ring-1 ring-brand/10">
                <item.icon size={20} className="text-brand" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{item.titulo}</p>
                <p className="mt-0.5 text-xs text-ink/50">{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-12 border-t border-black/5 pt-6 text-center">
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

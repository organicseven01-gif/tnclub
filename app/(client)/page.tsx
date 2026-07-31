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
    <div className="app-surface relative flex min-h-screen flex-col overflow-hidden px-6 py-14">
      {/* Detalhes discretos em verde claro, puramente decorativos */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-light/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 top-[38%] h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-brand-light/20 blur-3xl" />

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

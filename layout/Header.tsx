import { HelpCircle } from "lucide-react";
import { linkWhatsAppAjuda } from "@/utils/whatsapp";

interface HeaderProps {
  title: string;
  subtitle?: string;
  whatsapp?: string;
}

export function Header({ title, subtitle, whatsapp }: HeaderProps) {
  const ajudaLink = whatsapp ? linkWhatsAppAjuda(whatsapp) : null;

  return (
    <header className="glass sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/[0.05] px-5 pb-4 pt-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icone.jpg" alt="TN Club" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="truncate text-xs text-ink/50">{subtitle}</p>}
        </div>
      </div>
      {ajudaLink && (
        <a
          href={ajudaLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ajuda pelo WhatsApp"
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand-gradient px-4 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:shadow-cta-hover active:translate-y-0"
        >
          <HelpCircle size={16} strokeWidth={2} />
          Ajuda
        </a>
      )}
    </header>
  );
}

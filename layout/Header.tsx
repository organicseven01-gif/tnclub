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
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/90 px-5 pb-4 pt-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icone.jpg" alt="TN Club" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-ink">{title}</h1>
          {subtitle && <p className="text-xs text-ink/50">{subtitle}</p>}
        </div>
      </div>
      {ajudaLink && (
        <a
          href={ajudaLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ajuda pelo WhatsApp"
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <HelpCircle size={16} strokeWidth={2} />
          Ajuda
        </a>
      )}
    </header>
  );
}

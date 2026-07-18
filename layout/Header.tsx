import { Droplets, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/90 px-5 pb-4 pt-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-dark">
          <Droplets size={20} className="text-brand-light" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-ink">{title}</h1>
          {subtitle && <p className="text-xs text-ink/50">{subtitle}</p>}
        </div>
      </div>
      <button
        type="button"
        aria-label="Notificações"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-ink/60"
      >
        <Bell size={18} strokeWidth={2} />
      </button>
    </header>
  );
}

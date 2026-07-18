"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ADMIN_NAV_ITEMS, APP_NAME } from "@/utils/constants";
import { sairAdminAction } from "@/app/admin/(painel)/actions";

function Brand() {
  return (
    <div className="flex items-center gap-3 px-6 py-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-light/15">
        <Droplets size={20} className="text-brand-light" strokeWidth={2} />
      </div>
      <div>
        <p className="text-sm font-bold leading-tight text-white">{APP_NAME}</p>
        <p className="text-xs text-white/50">Painel administrativo</p>
      </div>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-4">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
              isActive ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SairButton() {
  return (
    <form action={sairAdminAction} className="px-4">
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
      >
        <LogOut size={18} strokeWidth={1.75} />
        Sair
      </button>
    </form>
  );
}

export function AdminSidebar() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-black/5 bg-brand-dark px-4 py-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <Droplets size={18} className="text-brand-light" strokeWidth={2} />
          <span className="text-sm font-bold text-white">{APP_NAME} Admin</span>
        </div>
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setAberto(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
        >
          <Menu size={20} />
        </button>
      </header>

      {aberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAberto(false)} />
          <div className="relative flex h-full w-72 flex-col bg-brand-dark pb-6">
            <div className="flex items-center justify-between px-4 pt-4">
              <Brand />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setAberto(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white"
              >
                <X size={18} />
              </button>
            </div>
            <NavLinks onNavigate={() => setAberto(false)} />
            <div className="mt-2 border-t border-white/10 pt-2">
              <SairButton />
            </div>
          </div>
        </div>
      )}

      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-brand-dark">
        <Brand />
        <NavLinks />
        <div className="border-t border-white/10 py-2">
          <SairButton />
        </div>
        <p className="px-6 pb-6 text-[11px] text-white/30">Conectado ao Supabase.</p>
      </aside>
    </>
  );
}

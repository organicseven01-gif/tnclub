import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import { getConfiguracao } from "@/services/configuracaoService";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export async function PageShell({ title, subtitle, children }: PageShellProps) {
  const { whatsapp } = await getConfiguracao();

  return (
    <div className="app-surface flex min-h-screen flex-col">
      <Header title={title} subtitle={subtitle} whatsapp={whatsapp} />
      <main className="flex-1 space-y-8 px-5 pb-12 pt-7">{children}</main>
      <BottomNavigation />
    </div>
  );
}

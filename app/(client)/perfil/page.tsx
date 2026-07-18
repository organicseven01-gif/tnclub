import { LogOut } from "lucide-react";
import { PageShell } from "@/layout/PageShell";
import { Button } from "@/components/ui";
import { ProfileCard, SemClienteState } from "@/components/shared";
import { getClienteAtual } from "@/services/clienteService";
import { sairClienteAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const cliente = await getClienteAtual();

  return (
    <PageShell title="Perfil" subtitle="Seus dados e preferências">
      {cliente ? (
        <>
          <ProfileCard cliente={cliente} />
          <form action={sairClienteAction} className="mt-4">
            <Button type="submit" variant="outline" size="md" icon={<LogOut size={18} strokeWidth={1.75} />}>
              Sair
            </Button>
          </form>
        </>
      ) : (
        <SemClienteState />
      )}
    </PageShell>
  );
}

import { ClipboardList } from "lucide-react";
import { PageShell } from "@/layout/PageShell";
import { EmptyState } from "@/components/ui";
import { HistoryCard, SemClienteState } from "@/components/shared";
import { getClienteAtual } from "@/services/clienteService";
import { getHistoricoDetalhado } from "@/services/historicoService";

export const dynamic = "force-dynamic";

export default async function HistoricoPage() {
  const cliente = await getClienteAtual();

  if (!cliente) {
    return (
      <PageShell title="Histórico" subtitle="Seus serviços realizados">
        <SemClienteState />
      </PageShell>
    );
  }

  const historico = await getHistoricoDetalhado(cliente.id);

  return (
    <PageShell title="Histórico" subtitle="Seus serviços realizados">
      {historico.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nenhum atendimento ainda"
          description="Os serviços realizados vão aparecer aqui."
        />
      ) : (
        <div className="space-y-3">
          {historico.map((item) => (
            <HistoryCard key={item.id} historico={item} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

import { ClipboardList } from "lucide-react";
import { PageHeader, HistoricoFilters } from "@/components/admin";
import { HistoryCard } from "@/components/shared";
import { EmptyState } from "@/components/ui";
import { getClientes } from "@/services/clienteService";
import { getServicos } from "@/services/servicoService";
import { listarHistoricoDetalhado } from "@/services/historicoService";

export const dynamic = "force-dynamic";

interface HistoricoAdminPageProps {
  searchParams: Promise<{
    clienteId?: string;
    servicoId?: string;
    status?: string;
    dataInicio?: string;
    dataFim?: string;
  }>;
}

export default async function HistoricoAdminPage({ searchParams }: HistoricoAdminPageProps) {
  const filtros = await searchParams;
  const status = filtros.status === "concluido" || filtros.status === "cancelado" ? filtros.status : undefined;

  const [clientes, servicos, historico] = await Promise.all([
    getClientes(),
    getServicos(),
    listarHistoricoDetalhado({
      clienteId: filtros.clienteId || undefined,
      servicoId: filtros.servicoId || undefined,
      status,
      dataInicio: filtros.dataInicio || undefined,
      dataFim: filtros.dataFim || undefined,
    }),
  ]);

  const clientesPorId = new Map(clientes.map((cliente) => [cliente.id, cliente.nome]));

  return (
    <div>
      <PageHeader title="Histórico" subtitle="Todos os atendimentos realizados, ordenados por data" />

      <div className="mb-6">
        <HistoricoFilters clientes={clientes} servicos={servicos} />
      </div>

      {historico.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nenhum atendimento encontrado"
          description="Ajuste os filtros para ver outros resultados."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {historico.map((item) => (
            <HistoryCard key={item.id} historico={item} clienteNome={clientesPorId.get(item.clienteId)} />
          ))}
        </div>
      )}
    </div>
  );
}

import { Clock, Gift } from "lucide-react";
import { PageShell } from "@/layout/PageShell";
import { SectionTitle } from "@/components/ui";
import { PointsCard, HistoryCard, QuickActionButton, SemClienteState } from "@/components/shared";
import { getClienteAtual } from "@/services/clienteService";
import { getHistoricoDetalhado } from "@/services/historicoService";
import { getConfiguracao, getLimitesNivel } from "@/services/configuracaoService";

// Dados vêm do Supabase e mudam a cada atendimento/resgate — nunca pré-renderizar estaticamente.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cliente = await getClienteAtual();

  if (!cliente) {
    return (
      <PageShell title="Dashboard" subtitle="Clube de fidelidade">
        <SemClienteState />
      </PageShell>
    );
  }

  const [historico, configuracao] = await Promise.all([
    getHistoricoDetalhado(cliente.id),
    getConfiguracao(),
  ]);
  const ultimoServico = historico[0];

  return (
    <PageShell title="Dashboard" subtitle={`Olá, ${cliente.nome.split(" ")[0]}`}>
      <PointsCard
        saldoPontos={cliente.saldoPontos}
        nivel={cliente.nivel}
        limites={getLimitesNivel(configuracao)}
      />

      {ultimoServico && (
        <div>
          <SectionTitle title="Último serviço realizado" />
          <HistoryCard historico={ultimoServico} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <QuickActionButton href="/historico" label="Ver Histórico" icon={Clock} />
        <QuickActionButton href="/beneficios" label="Benefícios" icon={Gift} variant="primary" />
      </div>
    </PageShell>
  );
}

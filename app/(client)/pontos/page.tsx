import { Receipt } from "lucide-react";
import { PageShell } from "@/layout/PageShell";
import { SectionTitle, EmptyState } from "@/components/ui";
import { PointsCard, PointsMovementCard, SemClienteState } from "@/components/shared";
import { getClienteAtual } from "@/services/clienteService";
import { listarExtratoPontos } from "@/services/extratoService";
import { getConfiguracao, getLimitesNivel } from "@/services/configuracaoService";

export const dynamic = "force-dynamic";

export default async function MeusPontosPage() {
  const cliente = await getClienteAtual();

  if (!cliente) {
    return (
      <PageShell title="Meus pontos" subtitle="Consulta de saldo e progresso">
        <SemClienteState />
      </PageShell>
    );
  }

  const [extrato, configuracao] = await Promise.all([
    listarExtratoPontos(cliente.id),
    getConfiguracao(),
  ]);

  return (
    <PageShell title="Meus pontos" subtitle="Consulta de saldo e progresso">
      <PointsCard
        saldoPontos={cliente.saldoPontos}
        nivel={cliente.nivel}
        limites={getLimitesNivel(configuracao)}
      />

      <div>
        <SectionTitle title="Extrato de pontos" />
        {extrato.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhuma movimentação ainda"
            description="Seus ganhos e resgates de pontos aparecerão aqui."
          />
        ) : (
          <div className="space-y-3">
            {extrato.map((movimento) => (
              <PointsMovementCard key={movimento.id} movimento={movimento} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

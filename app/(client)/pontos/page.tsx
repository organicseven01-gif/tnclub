import { Receipt } from "lucide-react";
import { PageShell } from "@/layout/PageShell";
import { SectionTitle, EmptyState } from "@/components/ui";
import { PointsCard, PointsMovementCard, PointsExpiryAlert, SemClienteState } from "@/components/shared";
import { getClienteAtual } from "@/services/clienteService";
import { listarExtratoPontos } from "@/services/extratoService";
import { contarServicosCliente } from "@/services/historicoService";
import { getConfiguracao, getLimitesNivel } from "@/services/configuracaoService";
import { getResumoValidadePontos } from "@/services/programaPontosService";
import { formatDateShort } from "@/utils/formatters";

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

  const [extrato, configuracao, resumoValidade, servicosRealizados] = await Promise.all([
    listarExtratoPontos(cliente.id),
    getConfiguracao(),
    getResumoValidadePontos(cliente.id),
    contarServicosCliente(cliente.id),
  ]);

  return (
    <PageShell title="Meus pontos" subtitle="Consulta de saldo e progresso">
      <PointsCard
        saldoPontos={cliente.saldoPontos}
        nivel={cliente.nivel}
        servicosRealizados={servicosRealizados}
        limites={getLimitesNivel(configuracao)}
      />

      <PointsExpiryAlert resumo={resumoValidade} />

      {resumoValidade.dataProximoVencimento && resumoValidade.pontosVencendoEmBreve <= 0 && (
        <p className="text-center text-xs text-ink/45">
          Próximos pontos a vencer em {formatDateShort(resumoValidade.dataProximoVencimento)}.
        </p>
      )}

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

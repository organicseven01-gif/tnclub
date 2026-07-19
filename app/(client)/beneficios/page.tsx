import { Gift, Sparkles } from "lucide-react";
import { PageShell } from "@/layout/PageShell";
import { EmptyState } from "@/components/ui";
import { RewardCard, SemClienteState } from "@/components/shared";
import { getClienteAtual } from "@/services/clienteService";
import { getBeneficiosAtivos } from "@/services/beneficioService";
import { getConfiguracao } from "@/services/configuracaoService";
import { formatPoints } from "@/utils/formatters";
import { resgatarBeneficioAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function BeneficiosPage() {
  const cliente = await getClienteAtual();

  if (!cliente) {
    return (
      <PageShell title="Benefícios" subtitle="Troque seus pontos por vantagens">
        <SemClienteState />
      </PageShell>
    );
  }

  const [beneficios, configuracao] = await Promise.all([getBeneficiosAtivos(), getConfiguracao()]);

  return (
    <PageShell title="Benefícios" subtitle="Troque seus pontos por vantagens">
      <div className="flex items-center justify-between rounded-3xl bg-brand-dark px-5 py-4 text-white">
        <span className="flex items-center gap-2 text-sm font-medium text-brand-light">
          <Sparkles size={16} /> Seu saldo
        </span>
        <span className="text-xl font-extrabold">{formatPoints(cliente.saldoPontos)}</span>
      </div>

      {beneficios.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="Nenhum benefício disponível"
          description="Novos benefícios aparecerão aqui em breve."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {beneficios.map((beneficio) => (
            <RewardCard
              key={beneficio.id}
              beneficio={beneficio}
              saldoCliente={cliente.saldoPontos}
              pontosPorRealDesconto={configuracao.pontosPorRealDesconto}
              action={resgatarBeneficioAction}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

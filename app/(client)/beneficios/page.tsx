import { PageShell } from "@/layout/PageShell";
import { RewardCard, SemClienteState } from "@/components/shared";
import { getClienteAtual } from "@/services/clienteService";
import { getBeneficiosAtivos } from "@/services/beneficioService";
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

  const beneficios = await getBeneficiosAtivos();

  return (
    <PageShell title="Benefícios" subtitle="Troque seus pontos por vantagens">
      <div className="grid grid-cols-2 gap-3">
        {beneficios.map((beneficio) => (
          <RewardCard key={beneficio.id} beneficio={beneficio} action={resgatarBeneficioAction} />
        ))}
      </div>
    </PageShell>
  );
}

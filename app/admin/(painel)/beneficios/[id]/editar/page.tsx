import { notFound } from "next/navigation";
import { PageHeader, BeneficioForm } from "@/components/admin";
import { buscarBeneficioPorId } from "@/services/beneficioService";
import { atualizarBeneficioAction } from "../../actions";

export const dynamic = "force-dynamic";

interface EditarBeneficioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarBeneficioPage({ params }: EditarBeneficioPageProps) {
  const { id } = await params;
  const beneficio = await buscarBeneficioPorId(id);

  if (!beneficio) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Editar benefício" subtitle={beneficio.nome} />
      <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-card">
        <BeneficioForm beneficio={beneficio} action={atualizarBeneficioAction.bind(null, beneficio.id)} />
      </div>
    </div>
  );
}

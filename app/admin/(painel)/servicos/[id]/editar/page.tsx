import { notFound } from "next/navigation";
import { PageHeader, ServicoForm } from "@/components/admin";
import { buscarServicoPorId } from "@/services/servicoService";
import { atualizarServicoAction } from "../../actions";

export const dynamic = "force-dynamic";

interface EditarServicoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarServicoPage({ params }: EditarServicoPageProps) {
  const { id } = await params;
  const servico = await buscarServicoPorId(id);

  if (!servico) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Editar serviço" subtitle={servico.nome} />
      <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-card">
        <ServicoForm servico={servico} action={atualizarServicoAction.bind(null, servico.id)} />
      </div>
    </div>
  );
}

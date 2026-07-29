import { notFound } from "next/navigation";
import { PageHeader, EnviarBoasVindasWhatsApp, ResgatesCliente } from "@/components/admin";
import { ProfileCard } from "@/components/shared";
import { buscarClientePorId } from "@/services/clienteService";
import { listarResgatesDetalhadosPorCliente } from "@/services/resgateService";
import { estornarResgateAction } from "../actions";

export const dynamic = "force-dynamic";

interface VisualizarClientePageProps {
  params: Promise<{ id: string }>;
}

export default async function VisualizarClientePage({ params }: VisualizarClientePageProps) {
  const { id } = await params;
  const cliente = await buscarClientePorId(id);

  if (!cliente) {
    notFound();
  }

  const resgates = await listarResgatesDetalhadosPorCliente(cliente.id);

  return (
    <div>
      <PageHeader title="Detalhes do cliente" subtitle={cliente.nome} />
      <div className="max-w-md space-y-6">
        <ProfileCard cliente={cliente} editarHref={`/admin/clientes/${cliente.id}/editar`} />
        <ResgatesCliente clienteId={cliente.id} resgates={resgates} action={estornarResgateAction} />
        <EnviarBoasVindasWhatsApp cliente={cliente} />
      </div>
    </div>
  );
}

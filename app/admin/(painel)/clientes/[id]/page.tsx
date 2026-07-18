import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin";
import { ProfileCard } from "@/components/shared";
import { buscarClientePorId } from "@/services/clienteService";

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

  return (
    <div>
      <PageHeader title="Detalhes do cliente" subtitle={cliente.nome} />
      <div className="max-w-md">
        <ProfileCard cliente={cliente} editarHref={`/admin/clientes/${cliente.id}/editar`} />
      </div>
    </div>
  );
}

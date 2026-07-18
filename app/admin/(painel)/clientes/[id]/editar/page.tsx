import { notFound } from "next/navigation";
import { PageHeader, ClienteForm } from "@/components/admin";
import { buscarClientePorId } from "@/services/clienteService";
import { atualizarClienteAction } from "../../actions";

export const dynamic = "force-dynamic";

interface EditarClientePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: EditarClientePageProps) {
  const { id } = await params;
  const cliente = await buscarClientePorId(id);

  if (!cliente) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Editar cliente" subtitle={cliente.nome} />
      <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-card">
        <ClienteForm cliente={cliente} action={atualizarClienteAction.bind(null, cliente.id)} />
      </div>
    </div>
  );
}

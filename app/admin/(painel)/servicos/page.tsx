import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, ConfirmSubmitButton } from "@/components/admin";
import { Table, Badge, Button } from "@/components/ui";
import type { TableColumn } from "@/components/ui";
import { listarServicos } from "@/services/servicoService";
import { formatCurrency, formatPoints } from "@/utils/formatters";
import { excluirServicoAction } from "./actions";
import type { Servico } from "@/types";

export const dynamic = "force-dynamic";

export default async function ServicosPage() {
  const servicos = await listarServicos();

  const columns: TableColumn<Servico>[] = [
    {
      header: "Nome",
      render: (servico) => <span className="font-medium text-ink">{servico.nome}</span>,
    },
    { header: "Valor", render: (servico) => formatCurrency(servico.valor) },
    { header: "Pontos", render: (servico) => formatPoints(servico.pontos) },
    {
      header: "Status",
      render: (servico) => (
        <Badge variant={servico.ativo ? "success" : "neutral"}>
          {servico.ativo ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      header: "Ações",
      render: (servico) => (
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/servicos/${servico.id}/editar`}
            className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark"
          >
            <Pencil size={14} /> Editar
          </Link>
          <form action={excluirServicoAction}>
            <input type="hidden" name="id" value={servico.id} />
            <ConfirmSubmitButton
              confirmMessage={`Excluir o serviço "${servico.nome}"?`}
              className="text-xs font-semibold text-red-500 hover:text-red-600"
            >
              <Trash2 size={14} /> Excluir
            </ConfirmSubmitButton>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Serviços"
        subtitle="Cadastro de serviços de higienização"
        action={
          <Button href="/admin/servicos/novo" fullWidth={false} icon={<Plus size={16} />}>
            Novo Serviço
          </Button>
        }
      />

      <Table
        columns={columns}
        data={servicos}
        keyExtractor={(servico) => servico.id}
        emptyTitle="Nenhum serviço cadastrado ainda"
        emptyDescription="Cadastre o primeiro serviço do catálogo de higienização."
        emptyAction={
          <Button href="/admin/servicos/novo" fullWidth={false} icon={<Plus size={16} />}>
            Cadastrar primeiro serviço
          </Button>
        }
      />
    </div>
  );
}

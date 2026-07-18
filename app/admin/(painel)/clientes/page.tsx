import Link from "next/link";
import { Plus, Eye, Pencil } from "lucide-react";
import { PageHeader, SearchBar } from "@/components/admin";
import { Table, Badge, Button } from "@/components/ui";
import type { TableColumn } from "@/components/ui";
import { listarClientes } from "@/services/clienteService";
import { TIER_LABELS, STATUS_CLIENTE_LABELS } from "@/utils/constants";
import { formatPoints } from "@/utils/formatters";
import type { Cliente } from "@/types";

export const dynamic = "force-dynamic";

interface ClientesPageProps {
  searchParams: Promise<{ busca?: string }>;
}

export default async function ClientesPage({ searchParams }: ClientesPageProps) {
  const { busca } = await searchParams;
  const clientes = await listarClientes({ busca });

  const columns: TableColumn<Cliente>[] = [
    {
      header: "Nome",
      render: (cliente) => <span className="font-medium text-ink">{cliente.nome}</span>,
    },
    { header: "Telefone", render: (cliente) => cliente.telefone },
    { header: "Saldo de pontos", render: (cliente) => formatPoints(cliente.saldoPontos) },
    {
      header: "Nível",
      render: (cliente) => <Badge variant="brand">{TIER_LABELS[cliente.nivel]}</Badge>,
    },
    {
      header: "Status",
      render: (cliente) => (
        <Badge variant={cliente.status === "ativo" ? "success" : "neutral"}>
          {STATUS_CLIENTE_LABELS[cliente.status]}
        </Badge>
      ),
    },
    {
      header: "Ações",
      render: (cliente) => (
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/clientes/${cliente.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-ink/60 hover:text-brand"
          >
            <Eye size={14} /> Visualizar
          </Link>
          <Link
            href={`/admin/clientes/${cliente.id}/editar`}
            className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark"
          >
            <Pencil size={14} /> Editar
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Gerencie a base de clientes do clube de fidelidade"
        action={
          <Button href="/admin/clientes/novo" fullWidth={false} icon={<Plus size={16} />}>
            Novo Cliente
          </Button>
        }
      />

      <div className="mb-6">
        <SearchBar paramName="busca" placeholder="Buscar por nome, telefone ou CPF" />
      </div>

      <Table
        columns={columns}
        data={clientes}
        keyExtractor={(cliente) => cliente.id}
        emptyTitle={busca ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}
        emptyDescription={
          busca
            ? "Ajuste sua busca ou cadastre um novo cliente."
            : "Cadastre o primeiro cliente para começar a usar o clube de fidelidade."
        }
        emptyAction={
          !busca && (
            <Button href="/admin/clientes/novo" fullWidth={false} icon={<Plus size={16} />}>
              Cadastrar primeiro cliente
            </Button>
          )
        }
      />
    </div>
  );
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, Input } from "@/components/ui";
import type { Cliente, Servico } from "@/types";

interface HistoricoFiltersProps {
  clientes: Cliente[];
  servicos: Servico[];
}

export function HistoricoFilters({ clientes, servicos }: HistoricoFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function atualizarParametro(nome: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (valor) {
      params.set(nome, valor);
    } else {
      params.delete(nome);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Select
        value={searchParams.get("clienteId") ?? ""}
        onChange={(event) => atualizarParametro("clienteId", event.target.value)}
        options={[
          { value: "", label: "Todos os clientes" },
          ...clientes.map((cliente) => ({ value: cliente.id, label: cliente.nome })),
        ]}
      />
      <Select
        value={searchParams.get("servicoId") ?? ""}
        onChange={(event) => atualizarParametro("servicoId", event.target.value)}
        options={[
          { value: "", label: "Todos os serviços" },
          ...servicos.map((servico) => ({ value: servico.id, label: servico.nome })),
        ]}
      />
      <Select
        value={searchParams.get("status") ?? ""}
        onChange={(event) => atualizarParametro("status", event.target.value)}
        options={[
          { value: "", label: "Todos os status" },
          { value: "concluido", label: "Concluído" },
          { value: "cancelado", label: "Cancelado" },
        ]}
      />
      <Input
        type="date"
        aria-label="Data inicial"
        value={searchParams.get("dataInicio") ?? ""}
        onChange={(event) => atualizarParametro("dataInicio", event.target.value)}
      />
      <Input
        type="date"
        aria-label="Data final"
        value={searchParams.get("dataFim") ?? ""}
        onChange={(event) => atualizarParametro("dataFim", event.target.value)}
      />
    </div>
  );
}

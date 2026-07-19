"use client";

import { useMemo, useState } from "react";
import { Card, EmptyState } from "@/components/ui";
import { formatCurrency, formatPoints } from "@/utils/formatters";
import { Users } from "lucide-react";
import type { ClienteRanking, CriterioRanking } from "@/services/rankingService";

interface RankingTableProps {
  ranking: ClienteRanking[];
}

const criterios: { valor: CriterioRanking; label: string }[] = [
  { valor: "valorGasto", label: "Valor gasto" },
  { valor: "pontosAcumulados", label: "Pontos acumulados" },
  { valor: "saldoAtual", label: "Saldo atual" },
  { valor: "visitas", label: "Visitas" },
];

const medalha: Record<number, string> = { 0: "🥇", 1: "🥈", 2: "🥉" };

export function RankingTable({ ranking }: RankingTableProps) {
  const [criterio, setCriterio] = useState<CriterioRanking>("valorGasto");

  const ordenado = useMemo(
    () => [...ranking].sort((a, b) => b[criterio] - a[criterio]),
    [ranking, criterio]
  );

  if (ranking.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum cliente para ranquear"
        description="Cadastre clientes e registre atendimentos para ver o ranking."
      />
    );
  }

  function celula(item: ClienteRanking, chave: CriterioRanking) {
    const ativo = chave === criterio;
    const conteudo =
      chave === "valorGasto"
        ? formatCurrency(item.valorGasto)
        : chave === "visitas"
          ? String(item.visitas)
          : formatPoints(item[chave]);
    return (
      <td
        key={chave}
        className={`whitespace-nowrap px-4 py-3 text-right text-sm ${
          ativo ? "font-bold text-ink" : "text-ink/60"
        }`}
      >
        {conteudo}
      </td>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {criterios.map((c) => (
          <button
            key={c.valor}
            type="button"
            onClick={() => setCriterio(c.valor)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              criterio === c.valor
                ? "bg-brand text-white"
                : "bg-surface text-ink/60 hover:bg-black/5"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <Card padding="sm" className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/40">
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Cliente</th>
              {criterios.map((c) => (
                <th
                  key={c.valor}
                  className={`px-4 py-3 text-right font-semibold ${
                    c.valor === criterio ? "text-brand" : ""
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {ordenado.map((item, index) => (
              <tr key={item.clienteId} className={index < 3 ? "bg-brand/5" : ""}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-ink/70">
                  {medalha[index] ?? index + 1}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-ink">
                  {item.nome}
                </td>
                {criterios.map((c) => celula(item, c.valor))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

import type { PontoCrescimentoMensal } from "@/mock/indicadores";

interface GrowthChartProps {
  dados: PontoCrescimentoMensal[];
}

export function GrowthChart({ dados }: GrowthChartProps) {
  const maximo = Math.max(...dados.map((ponto) => ponto.atendimentos), 1);

  return (
    <div className="flex h-48 items-end gap-3 sm:gap-4">
      {dados.map((ponto) => {
        const altura = Math.max(8, Math.round((ponto.atendimentos / maximo) * 100));

        return (
          <div key={ponto.mes} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full items-end overflow-hidden rounded-xl bg-surface">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-brand to-brand-light transition-all"
                style={{ height: `${altura}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-ink/60">{ponto.atendimentos}</span>
            <span className="text-[11px] text-ink/40">{ponto.mes}</span>
          </div>
        );
      })}
    </div>
  );
}

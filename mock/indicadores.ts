// Série fictícia exclusiva do gráfico de crescimento do Dashboard administrativo.
// Os demais indicadores do Dashboard já são calculados a partir dos dados reais
// (clientes, histórico e resgates).
export interface PontoCrescimentoMensal {
  mes: string;
  atendimentos: number;
}

export const crescimentoMensal: PontoCrescimentoMensal[] = [
  { mes: "Fev", atendimentos: 8 },
  { mes: "Mar", atendimentos: 11 },
  { mes: "Abr", atendimentos: 9 },
  { mes: "Mai", atendimentos: 14 },
  { mes: "Jun", atendimentos: 18 },
  { mes: "Jul", atendimentos: 22 },
];

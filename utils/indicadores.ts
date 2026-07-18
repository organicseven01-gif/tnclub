// Indicadores derivados dos dados reais do banco (usados no Dashboard admin).

const MESES_ABREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export interface PontoCrescimentoMensal {
  mes: string;
  atendimentos: number;
}

// Conta quantos atendimentos caíram em cada um dos últimos N meses (incluindo o
// mês atual), a partir do histórico real. Meses sem atendimento aparecem com 0,
// para o gráfico manter a régua de tempo contínua.
export function calcularCrescimentoMensal(
  historico: { data: string }[],
  quantidadeMeses = 6,
  referencia: Date = new Date()
): PontoCrescimentoMensal[] {
  const anoRef = referencia.getFullYear();
  const mesRef = referencia.getMonth(); // 0-11

  const baldes = Array.from({ length: quantidadeMeses }, (_, posicao) => {
    const i = quantidadeMeses - 1 - posicao;
    const d = new Date(anoRef, mesRef - i, 1);
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { chave, mes: MESES_ABREV[d.getMonth()], atendimentos: 0 };
  });

  const indicePorChave = new Map(baldes.map((balde, idx) => [balde.chave, idx]));

  for (const item of historico) {
    // "data" vem como "YYYY-MM-DD" (ou ISO completo); os 7 primeiros caracteres
    // já identificam o ano-mês sem risco de fuso horário.
    const chave = item.data.slice(0, 7);
    const idx = indicePorChave.get(chave);
    if (idx !== undefined) baldes[idx].atendimentos += 1;
  }

  return baldes.map(({ mes, atendimentos }) => ({ mes, atendimentos }));
}

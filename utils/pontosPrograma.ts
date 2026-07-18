// Cálculos puros do Programa de Pontos, a partir das regras configuradas.
// As mesmas fórmulas são usadas na prévia (tela) e nas funções do banco.

// Pontos gerados por um valor gasto: valor ÷ reais por ponto (parte inteira).
export function calcularPontosPorValor(valorTotal: number, reaisPorPonto: number): number {
  if (!reaisPorPonto || reaisPorPonto <= 0) return 0;
  return Math.floor(valorTotal / reaisPorPonto);
}

// Desconto máximo (em R$) que os pontos disponíveis conseguem gerar.
// Ex.: 90 pontos, 3 pontos = R$1  ->  R$30.
export function descontoMaximoReais(pontosDisponiveis: number, pontosPorRealDesconto: number): number {
  if (!pontosPorRealDesconto || pontosPorRealDesconto <= 0) return 0;
  return Math.floor(pontosDisponiveis / pontosPorRealDesconto);
}

// Quantos pontos são consumidos para um determinado desconto em R$ (inteiro).
export function pontosParaDesconto(descontoReais: number, pontosPorRealDesconto: number): number {
  return Math.max(0, Math.floor(descontoReais)) * pontosPorRealDesconto;
}

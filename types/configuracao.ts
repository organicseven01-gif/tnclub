export interface Configuracao {
  whatsapp: string;
  limitePrata: number;
  limiteOuro: number;
  limitePlatina: number;
  limiteDiamante: number;
  // Programa de pontos
  reaisPorPonto: number; // R$ necessários para gerar 1 ponto
  pontosPorRealDesconto: number; // pontos necessários para R$ 1,00 de desconto
  validadePontosAtiva: boolean;
  validadePontosDias: number;
}

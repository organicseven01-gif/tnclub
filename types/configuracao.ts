export interface Configuracao {
  whatsapp: string;
  // Níveis: quantidade mínima de SERVIÇOS realizados para alcançar cada nível.
  limitePrata: number;
  limiteOuro: number;
  limiteDiamante: number;
  // Programa de pontos
  reaisPorPonto: number; // R$ necessários para gerar 1 ponto
  pontosPorRealDesconto: number; // pontos necessários para R$ 1,00 de desconto
  validadePontosAtiva: boolean;
  validadePontosDias: number;
}

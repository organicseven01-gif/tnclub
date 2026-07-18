export type TipoMovimentoPontos = "ganho" | "resgate" | "desconto" | "expiracao";

export interface MovimentoPontos {
  id: string;
  tipo: TipoMovimentoPontos;
  descricao: string;
  pontos: number;
  data: string;
}

export interface ResumoValidadePontos {
  pontosVencendoEmBreve: number;
  dataProximoVencimento: string | null;
  diasParaVencimento: number | null;
}

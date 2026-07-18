export type TipoMovimentoPontos = "ganho" | "resgate";

export interface MovimentoPontos {
  id: string;
  tipo: TipoMovimentoPontos;
  descricao: string;
  pontos: number;
  data: string;
}

export type NivelFidelidade = "bronze" | "prata" | "ouro" | "diamante";

export type StatusCliente = "ativo" | "inativo";

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  saldoPontos: number;
  nivel: NivelFidelidade;
  status: StatusCliente;
  dataCadastro: string;
}

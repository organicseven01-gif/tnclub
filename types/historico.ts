import type { Servico } from "./servico";

export interface Historico {
  id: string;
  clienteId: string;
  servicoId: string;
  quantidade: number;
  valorTotal: number;
  data: string;
  pontosGerados: number;
  observacao: string;
}

export interface HistoricoDetalhado extends Historico {
  servico: Servico;
}

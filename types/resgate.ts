export type StatusResgate = "concluido" | "cancelado";

export interface Resgate {
  id: string;
  clienteId: string;
  beneficioId: string;
  pontosUtilizados: number;
  status: StatusResgate;
  data: string;
}

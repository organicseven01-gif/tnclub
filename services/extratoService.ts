import type { MovimentoPontos } from "@/types";
import { getHistoricoPorCliente } from "./historicoService";
import { getServicos } from "./servicoService";
import { listarBeneficios } from "./beneficioService";
import { listarResgatesPorCliente } from "./resgateService";

export async function listarExtratoPontos(clienteId: string): Promise<MovimentoPontos[]> {
  const [historico, resgatesDoCliente, servicos, beneficios] = await Promise.all([
    getHistoricoPorCliente(clienteId),
    listarResgatesPorCliente(clienteId),
    getServicos(),
    listarBeneficios(),
  ]);

  const ganhos: MovimentoPontos[] = historico.map((item) => ({
    id: item.id,
    tipo: "ganho",
    descricao: servicos.find((servico) => servico.id === item.servicoId)?.nome ?? "Serviço",
    pontos: item.pontosGerados,
    data: item.data,
  }));

  const perdas: MovimentoPontos[] = resgatesDoCliente.map((resgate) => ({
    id: resgate.id,
    tipo: "resgate",
    descricao: beneficios.find((beneficio) => beneficio.id === resgate.beneficioId)?.nome ?? "Benefício resgatado",
    pontos: -resgate.pontosUtilizados,
    data: resgate.data,
  }));

  return [...ganhos, ...perdas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

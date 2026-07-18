import type { MovimentoPontos } from "@/types";
import { getHistoricoPorCliente } from "./historicoService";
import { getServicos } from "./servicoService";
import { listarBeneficios } from "./beneficioService";
import { listarResgatesPorCliente } from "./resgateService";
import { listarDescontosCliente, listarLotesExpirados } from "./programaPontosService";
import { formatCurrency } from "@/utils/formatters";

export async function listarExtratoPontos(clienteId: string): Promise<MovimentoPontos[]> {
  const [historico, resgatesDoCliente, servicos, beneficios, descontos, expirados] = await Promise.all([
    getHistoricoPorCliente(clienteId),
    listarResgatesPorCliente(clienteId),
    getServicos(),
    listarBeneficios(),
    listarDescontosCliente(clienteId),
    listarLotesExpirados(clienteId),
  ]);

  // Ganhos: pontos gerados por atendimento (só os que geraram pontos).
  const ganhos: MovimentoPontos[] = historico
    .filter((item) => item.pontosGerados > 0)
    .map((item) => ({
      id: `g-${item.id}`,
      tipo: "ganho",
      descricao: servicos.find((servico) => servico.id === item.servicoId)?.nome ?? "Serviço",
      pontos: item.pontosGerados,
      data: item.data,
    }));

  // Resgates de benefícios.
  const resgates: MovimentoPontos[] = resgatesDoCliente.map((resgate) => ({
    id: `r-${resgate.id}`,
    tipo: "resgate",
    descricao: beneficios.find((b) => b.id === resgate.beneficioId)?.nome ?? "Benefício resgatado",
    pontos: -resgate.pontosUtilizados,
    data: resgate.data,
  }));

  // Pontos usados como desconto em serviços.
  const descontosMov: MovimentoPontos[] = descontos.map((desconto) => ({
    id: `d-${desconto.id}`,
    tipo: "desconto",
    descricao: `Desconto em serviço (${formatCurrency(desconto.descontoReais)})`,
    pontos: -desconto.pontos,
    data: desconto.data,
  }));

  // Pontos que expiraram.
  const expiracoes: MovimentoPontos[] = expirados.map((lote) => ({
    id: `e-${lote.id}`,
    tipo: "expiracao",
    descricao: "Pontos expirados",
    pontos: -lote.pontos,
    data: lote.data,
  }));

  return [...ganhos, ...resgates, ...descontosMov, ...expiracoes].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
}

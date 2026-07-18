import type { HistoricoDetalhado } from "@/types";
import { supabase } from "./supabase";
import { getServicoPorId } from "./servicoService";
import { getConfiguracao } from "./configuracaoService";
import { calcularPontosPorValor } from "@/utils/pontosPrograma";

export interface DadosAtendimento {
  clienteId: string;
  servicoId: string;
  quantidade: number;
  observacao: string;
}

export interface ResumoAtendimento {
  valorTotal: number;
  pontosGerados: number;
}

export async function calcularResumoAtendimento(
  servicoId: string,
  quantidade: number
): Promise<ResumoAtendimento | null> {
  const [servico, config] = await Promise.all([getServicoPorId(servicoId), getConfiguracao()]);

  if (!servico || quantidade <= 0) return null;

  const valorTotal = servico.valor * quantidade;

  return {
    valorTotal,
    pontosGerados: calcularPontosPorValor(valorTotal, config.reaisPorPonto),
  };
}

interface AtendimentoRpcRow {
  id: string;
  cliente_id: string;
  servico_id: string;
  quantidade: number;
  valor_total: number;
  pontos_gerados: number;
  observacao: string;
  data_atendimento: string;
}

// Chama a função SQL "registrar_atendimento" (supabase/schema.sql), que
// insere o atendimento e atualiza saldo/nível do cliente em uma única
// transação no banco — se qualquer etapa falhar, nada é gravado.
export async function registrarAtendimento(dados: DadosAtendimento): Promise<HistoricoDetalhado> {
  if (dados.quantidade <= 0) {
    throw new Error("A quantidade deve ser maior que zero.");
  }

  const { data, error } = await supabase.rpc("registrar_atendimento", {
    p_cliente_id: dados.clienteId,
    p_servico_id: dados.servicoId,
    p_quantidade: dados.quantidade,
    p_observacao: dados.observacao,
  });

  if (error) {
    throw new Error(error.message);
  }

  const row = data as AtendimentoRpcRow;
  const servico = await getServicoPorId(row.servico_id);

  if (!servico) {
    throw new Error("Serviço não encontrado.");
  }

  return {
    id: row.id,
    clienteId: row.cliente_id,
    servicoId: row.servico_id,
    quantidade: row.quantidade,
    valorTotal: row.valor_total,
    data: row.data_atendimento,
    pontosGerados: row.pontos_gerados,
    observacao: row.observacao,
    servico,
  };
}

export interface ItemAtendimento {
  servicoId: string;
  quantidade: number;
}

export interface ResumoVenda {
  valorTotal: number;
  descontoReais: number;
  pontosUtilizados: number;
  valorPagar: number;
  pontosGerados: number;
}

// Registra a venda completa (itens + acúmulo + desconto FIFO) em uma única
// chamada transacional ao banco (função SQL registrar_venda).
export async function registrarVenda(
  clienteId: string,
  itens: ItemAtendimento[],
  observacao: string,
  descontoReais: number
): Promise<ResumoVenda> {
  const { data, error } = await supabase.rpc("registrar_venda", {
    p_cliente_id: clienteId,
    p_itens: itens,
    p_observacao: observacao,
    p_desconto_reais: descontoReais,
  });

  if (error) throw new Error(error.message);

  const r = data as {
    valor_total: number;
    desconto_reais: number;
    pontos_utilizados: number;
    valor_pagar: number;
    pontos_gerados: number;
  };

  return {
    valorTotal: r.valor_total,
    descontoReais: r.desconto_reais,
    pontosUtilizados: r.pontos_utilizados,
    valorPagar: r.valor_pagar,
    pontosGerados: r.pontos_gerados,
  };
}

// Um cliente pode realizar mais de um serviço na mesma visita. Cada item vira
// seu próprio atendimento (mesma chamada transacional de sempre), já que o
// histórico é organizado por serviço — se um item falhar no meio da lista, os
// anteriores já registrados permanecem (assim como se o admin repetisse o
// cadastro manualmente, um serviço por vez).
export async function registrarMultiplosAtendimentos(
  clienteId: string,
  observacao: string,
  itens: ItemAtendimento[]
): Promise<HistoricoDetalhado[]> {
  const registrados: HistoricoDetalhado[] = [];

  for (const item of itens) {
    const atendimento = await registrarAtendimento({
      clienteId,
      servicoId: item.servicoId,
      quantidade: item.quantidade,
      observacao,
    });
    registrados.push(atendimento);
  }

  return registrados;
}

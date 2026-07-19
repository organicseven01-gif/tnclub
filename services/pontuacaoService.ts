import { supabase } from "./supabase";

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

// Registra a venda completa (itens + acúmulo de pontos + desconto FIFO) em uma
// única chamada transacional ao banco (função SQL registrar_venda).
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

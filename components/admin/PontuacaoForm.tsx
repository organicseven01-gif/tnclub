"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Coins } from "lucide-react";
import { Button, Card, Input, Select, Textarea, Alert } from "@/components/ui";
import { formatCurrency, formatPoints } from "@/utils/formatters";
import {
  calcularPontosPorValor,
  descontoMaximoReais,
  pontosParaDesconto,
} from "@/utils/pontosPrograma";
import { initialFormState } from "@/types";
import type { Cliente, Servico, FormState } from "@/types";

interface PontuacaoFormProps {
  clientes: Cliente[];
  servicos: Servico[];
  reaisPorPonto: number;
  pontosPorRealDesconto: number;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

interface ItemAtendimento {
  chave: number;
  servicoId: string;
  quantidade: number;
}

let proximaChave = 1;

function criarItem(servicoId: string): ItemAtendimento {
  return { chave: proximaChave++, servicoId, quantidade: 1 };
}

export function PontuacaoForm({
  clientes,
  servicos,
  reaisPorPonto,
  pontosPorRealDesconto,
  action,
}: PontuacaoFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(async (prevState: FormState, formData: FormData) => {
    const resultado = await action(prevState, formData);
    if (!resultado.error) router.refresh();
    return resultado;
  }, initialFormState);

  const [clienteId, setClienteId] = useState("");
  const [itens, setItens] = useState<ItemAtendimento[]>([criarItem(servicos[0]?.id ?? "")]);
  const [usarDesconto, setUsarDesconto] = useState(false);
  const [descontoReais, setDescontoReais] = useState(0);

  function adicionarItem() {
    setItens((atual) => [...atual, criarItem(servicos[0]?.id ?? "")]);
  }

  function removerItem(chave: number) {
    setItens((atual) => atual.filter((item) => item.chave !== chave));
  }

  function atualizarItem(chave: number, alteracoes: Partial<Pick<ItemAtendimento, "servicoId" | "quantidade">>) {
    setItens((atual) => atual.map((item) => (item.chave === chave ? { ...item, ...alteracoes } : item)));
  }

  const { valorTotal, pontosGerados } = useMemo(() => {
    let valor = 0;
    let pontos = 0;
    for (const item of itens) {
      const servico = servicos.find((s) => s.id === item.servicoId);
      if (!servico || item.quantidade <= 0) continue;
      const valorItem = servico.valor * item.quantidade;
      valor += valorItem;
      pontos += calcularPontosPorValor(valorItem, reaisPorPonto);
    }
    return { valorTotal: valor, pontosGerados: pontos };
  }, [itens, servicos, reaisPorPonto]);

  const clienteSelecionado = clientes.find((c) => c.id === clienteId);
  const saldoCliente = clienteSelecionado?.saldoPontos ?? 0;

  // Desconto máximo: limitado pelos pontos do cliente e pelo valor da venda.
  const descontoMax = Math.min(
    descontoMaximoReais(saldoCliente, pontosPorRealDesconto),
    Math.floor(valorTotal)
  );

  const podeUsarDesconto = descontoMax > 0;
  const descontoAplicado = usarDesconto ? Math.min(descontoReais, descontoMax) : 0;
  const pontosConsumidos = pontosParaDesconto(descontoAplicado, pontosPorRealDesconto);
  const valorPagar = valorTotal - descontoAplicado;

  // Ao ativar o desconto (ou quando o máximo muda), ajusta o valor para caber.
  useEffect(() => {
    if (!usarDesconto) return;
    setDescontoReais((atual) => Math.min(atual === 0 ? descontoMax : atual, descontoMax));
  }, [usarDesconto, descontoMax]);

  const itensValidos = itens.some((item) => item.servicoId && item.quantidade > 0);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <input
        type="hidden"
        name="itens"
        value={JSON.stringify(itens.map(({ servicoId, quantidade }) => ({ servicoId, quantidade })))}
      />
      <input type="hidden" name="descontoReais" value={descontoAplicado} />

      <Card padding="lg" className="space-y-5">
        {state.error && <Alert variant="error">{state.error}</Alert>}
        {state.success && (
          <Alert variant="success">
            Atendimento registrado com sucesso!
            {state.info ? <span className="mt-1 block text-xs font-normal">{state.info}</span> : null}
          </Alert>
        )}

        <Select
          label="Cliente"
          name="clienteId"
          placeholder="Selecione um cliente"
          value={clienteId}
          onChange={(event) => setClienteId(event.target.value)}
          options={clientes.map((cliente) => ({ value: cliente.id, label: cliente.nome }))}
          required
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-ink/70">Serviços realizados</p>

          {itens.map((item, index) => (
            <div key={item.chave} className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label={index === 0 ? "Serviço" : undefined}
                  value={item.servicoId}
                  onChange={(event) => atualizarItem(item.chave, { servicoId: event.target.value })}
                  options={servicos.map((servico) => ({ value: servico.id, label: servico.nome }))}
                  required
                />
              </div>
              <div className="w-24">
                <Input
                  label={index === 0 ? "Qtd." : undefined}
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={(event) =>
                    atualizarItem(item.chave, { quantidade: Number(event.target.value) || 1 })
                  }
                />
              </div>
              {itens.length > 1 && (
                <button
                  type="button"
                  aria-label="Remover serviço"
                  onClick={() => removerItem(item.chave)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-ink/40 transition-colors hover:bg-surface hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth={false}
            icon={<Plus size={16} />}
            onClick={adicionarItem}
          >
            Adicionar serviço
          </Button>
        </div>

        <Textarea label="Observação" name="observacao" placeholder="Detalhes do atendimento (opcional)" />

        <Button type="submit" disabled={pending || !itensValidos}>
          {pending ? "Registrando..." : "Registrar Atendimento"}
        </Button>
      </Card>

      <Card padding="lg" className="h-fit space-y-5 bg-brand-dark text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">
          Resumo do atendimento
        </p>

        <div>
          <p className="text-xs text-white/60">Valor total</p>
          <p className="mt-1 text-3xl font-extrabold">{formatCurrency(valorTotal)}</p>
        </div>

        {/* Desconto com pontos do cliente */}
        {clienteSelecionado && (
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-light">
                <Coins size={14} /> Pontos do cliente
              </span>
              <span className="text-sm font-bold">{formatPoints(saldoCliente)}</span>
            </div>

            {podeUsarDesconto ? (
              <>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={usarDesconto}
                    onChange={(event) => setUsarDesconto(event.target.checked)}
                    className="h-4 w-4 rounded border-white/30 accent-brand-light"
                  />
                  Usar pontos como desconto
                </label>

                {usarDesconto && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-xl bg-white/10 px-3">
                        <span className="text-xs text-white/60">R$</span>
                        <input
                          type="number"
                          min={0}
                          max={descontoMax}
                          value={descontoReais}
                          onChange={(event) =>
                            setDescontoReais(
                              Math.max(0, Math.min(Number(event.target.value) || 0, descontoMax))
                            )
                          }
                          className="w-20 bg-transparent py-2 text-sm font-semibold text-white outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setDescontoReais(descontoMax)}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-brand-light hover:bg-white/20"
                      >
                        Usar máx ({formatCurrency(descontoMax)})
                      </button>
                    </div>
                    <p className="text-[11px] text-white/50">
                      {formatPoints(pontosConsumidos)} serão usados neste desconto.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2 text-[11px] text-white/50">
                Sem pontos suficientes para desconto nesta venda.
              </p>
            )}
          </div>
        )}

        {descontoAplicado > 0 && (
          <div>
            <p className="text-xs text-white/60">Desconto</p>
            <p className="mt-1 text-xl font-bold text-brand-light">− {formatCurrency(descontoAplicado)}</p>
          </div>
        )}

        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-white/60">Valor a pagar</p>
          <p className="mt-1 text-3xl font-extrabold">{formatCurrency(valorPagar)}</p>
          <p className="mt-1 text-xs text-white/50">Pix, cartão ou dinheiro</p>
        </div>

        <div>
          <p className="text-xs text-white/60">Pontos gerados nesta venda</p>
          <p className="mt-1 text-lg font-bold text-brand-light">+ {formatPoints(pontosGerados)}</p>
        </div>
      </Card>
    </form>
  );
}

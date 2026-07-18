"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button, Card, Input, Select, Textarea, Alert } from "@/components/ui";
import { formatCurrency, formatPoints } from "@/utils/formatters";
import { initialFormState } from "@/types";
import type { Cliente, Servico, FormState } from "@/types";

interface PontuacaoFormProps {
  clientes: Cliente[];
  servicos: Servico[];
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

export function PontuacaoForm({ clientes, servicos, action }: PontuacaoFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(async (prevState: FormState, formData: FormData) => {
    const resultado = await action(prevState, formData);
    if (!resultado.error) router.refresh();
    return resultado;
  }, initialFormState);

  const [itens, setItens] = useState<ItemAtendimento[]>([criarItem(servicos[0]?.id ?? "")]);

  function adicionarItem() {
    setItens((atual) => [...atual, criarItem(servicos[0]?.id ?? "")]);
  }

  function removerItem(chave: number) {
    setItens((atual) => atual.filter((item) => item.chave !== chave));
  }

  function atualizarItem(chave: number, alteracoes: Partial<Pick<ItemAtendimento, "servicoId" | "quantidade">>) {
    setItens((atual) => atual.map((item) => (item.chave === chave ? { ...item, ...alteracoes } : item)));
  }

  const resumo = useMemo(() => {
    let valorTotal = 0;
    let pontosGerados = 0;

    for (const item of itens) {
      const servico = servicos.find((s) => s.id === item.servicoId);
      if (!servico || item.quantidade <= 0) continue;
      valorTotal += servico.valor * item.quantidade;
      pontosGerados += servico.pontos * item.quantidade;
    }

    return valorTotal > 0 || pontosGerados > 0 ? { valorTotal, pontosGerados } : null;
  }, [itens, servicos]);

  const itensValidos = itens.some((item) => item.servicoId && item.quantidade > 0);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <input
        type="hidden"
        name="itens"
        value={JSON.stringify(itens.map(({ servicoId, quantidade }) => ({ servicoId, quantidade })))}
      />

      <Card padding="lg" className="space-y-5">
        {state.error && <Alert variant="error">{state.error}</Alert>}
        {state.success && <Alert variant="success">Atendimento registrado com sucesso!</Alert>}

        <Select
          label="Cliente"
          name="clienteId"
          placeholder="Selecione um cliente"
          defaultValue=""
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
          <p className="mt-1 text-3xl font-extrabold">
            {resumo ? formatCurrency(resumo.valorTotal) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/60">Pontos gerados</p>
          <p className="mt-1 text-2xl font-bold text-brand-light">
            {resumo ? formatPoints(resumo.pontosGerados) : "—"}
          </p>
        </div>
      </Card>
    </form>
  );
}

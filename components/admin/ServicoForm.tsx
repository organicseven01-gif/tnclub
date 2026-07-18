"use client";

import { useActionState } from "react";
import { Button, Input, Select, Alert } from "@/components/ui";
import { initialFormState } from "@/types";
import type { Servico, FormState } from "@/types";

interface ServicoFormProps {
  servico?: Servico;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export function ServicoForm({ servico, action }: ServicoFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const emEdicao = Boolean(servico);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <Alert variant="error">{state.error}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Nome do serviço"
          name="nome"
          defaultValue={servico?.nome}
          placeholder="Ex: Sofá 3 lugares"
          required
          className="sm:col-span-2"
        />
        <Input
          label="Valor (R$)"
          name="valor"
          type="number"
          min={0}
          step="0.01"
          defaultValue={servico?.valor}
          placeholder="0,00"
          required
        />
        <Select
          label="Status"
          name="ativo"
          defaultValue={servico ? String(servico.ativo) : "true"}
          options={[
            { value: "true", label: "Ativo" },
            { value: "false", label: "Inativo" },
          ]}
        />
      </div>

      <p className="rounded-2xl bg-surface px-4 py-3 text-xs text-ink/50">
        Os pontos são calculados automaticamente pelo valor do serviço, conforme as regras em{" "}
        <strong>Configurações → Programa de pontos</strong>. Não é preciso informar pontos por serviço.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} fullWidth={false}>
          {pending ? "Salvando..." : emEdicao ? "Salvar alterações" : "Cadastrar serviço"}
        </Button>
        <Button href="/admin/servicos" variant="outline" fullWidth={false}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

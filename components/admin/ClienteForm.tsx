"use client";

import { useActionState } from "react";
import { Button, Input, MaskedInput, Select, Alert } from "@/components/ui";
import { maskCpf, maskTelefone } from "@/utils/formatters";
import { TIER_LABELS, TIER_ORDER, STATUS_CLIENTE_LABELS } from "@/utils/constants";
import { initialFormState } from "@/types";
import type { Cliente, FormState } from "@/types";

interface ClienteFormProps {
  cliente?: Cliente;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export function ClienteForm({ cliente, action }: ClienteFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const emEdicao = Boolean(cliente);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <Alert variant="error">{state.error}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Nome completo" name="nome" defaultValue={cliente?.nome} placeholder="Ex: Marina Torres" required />
        <MaskedInput
          label="Telefone"
          name="telefone"
          mask={maskTelefone}
          defaultValue={cliente?.telefone}
          placeholder="(11) 90000-0000"
          required
        />
        <MaskedInput
          label="CPF"
          name="cpf"
          mask={maskCpf}
          defaultValue={cliente?.cpf}
          placeholder="000.000.000-00"
          required
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          defaultValue={cliente?.email}
          placeholder="cliente@email.com"
          required
        />
        <Select
          label="Status"
          name="status"
          defaultValue={cliente?.status ?? "ativo"}
          options={[
            { value: "ativo", label: STATUS_CLIENTE_LABELS.ativo },
            { value: "inativo", label: STATUS_CLIENTE_LABELS.inativo },
          ]}
        />
        {emEdicao && (
          <>
            <Select
              label="Nível de fidelidade"
              name="nivel"
              defaultValue={cliente?.nivel}
              options={TIER_ORDER.map((nivel) => ({ value: nivel, label: TIER_LABELS[nivel] }))}
            />
            <Input
              label="Saldo de pontos"
              name="saldoPontos"
              type="number"
              min={0}
              defaultValue={cliente?.saldoPontos}
            />
          </>
        )}
      </div>

      {!emEdicao && (
        <p className="rounded-2xl bg-surface px-4 py-3 text-xs text-ink/50">
          Todo novo cliente inicia automaticamente no nível <strong>Bronze</strong>, com saldo de{" "}
          <strong>0 pontos</strong> e data de cadastro definida pelo sistema.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} fullWidth={false}>
          {pending ? "Salvando..." : emEdicao ? "Salvar alterações" : "Cadastrar cliente"}
        </Button>
        <Button href="/admin/clientes" variant="outline" fullWidth={false}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { MessageCircle, Award, Coins } from "lucide-react";
import { Card, Input, MaskedInput, Select, SectionTitle, Button, Alert } from "@/components/ui";
import { maskTelefone } from "@/utils/formatters";
import { TIER_LABELS } from "@/utils/constants";
import { initialFormState } from "@/types";
import type { Configuracao, FormState } from "@/types";

interface ConfiguracoesFormProps {
  configuracao: Configuracao;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export function ConfiguracoesForm({ configuracao, action }: ConfiguracoesFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const niveis = [
    { name: "limitePrata", label: TIER_LABELS.prata, valor: configuracao.limitePrata },
    { name: "limiteOuro", label: TIER_LABELS.ouro, valor: configuracao.limiteOuro },
    { name: "limitePlatina", label: TIER_LABELS.platina, valor: configuracao.limitePlatina },
    { name: "limiteDiamante", label: TIER_LABELS.diamante, valor: configuracao.limiteDiamante },
  ];

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <Alert variant="error">{state.error}</Alert>}
      {state.success && <Alert variant="success">Configurações salvas com sucesso!</Alert>}

      <Card padding="lg" className="space-y-5">
        <SectionTitle
          title="Atendimento ao cliente"
          subtitle="Número de WhatsApp usado no botão de ajuda que o cliente vê no aplicativo"
        />
        <MaskedInput
          label="WhatsApp"
          name="whatsapp"
          mask={maskTelefone}
          defaultValue={configuracao.whatsapp}
          placeholder="(11) 90000-0000"
          icon={<MessageCircle size={16} />}
        />
        <p className="text-xs text-ink/50">
          Deixe em branco para esconder o botão de WhatsApp no aplicativo do cliente.
        </p>
      </Card>

      <Card padding="lg" className="space-y-5">
        <SectionTitle
          title="Programa de pontos"
          subtitle="Regras de acúmulo, desconto e validade dos pontos"
        />

        <div className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3">
          <Coins size={18} className="mt-0.5 shrink-0 text-brand-dark" strokeWidth={1.75} />
          <p className="text-xs leading-relaxed text-ink/60">
            Os pontos são calculados automaticamente pelo valor do serviço. Ex.: com{" "}
            <strong className="text-ink">R$ {configuracao.reaisPorPonto} = 1 ponto</strong> e{" "}
            <strong className="text-ink">{configuracao.pontosPorRealDesconto} pontos = R$ 1,00</strong>,
            um serviço de R$ 270 gera 90 pontos, que valem R$ 30 de desconto.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Reais por 1 ponto (acúmulo)"
            name="reaisPorPonto"
            type="number"
            min={0.01}
            step="0.01"
            defaultValue={configuracao.reaisPorPonto}
            required
          />
          <Input
            label="Pontos por R$ 1,00 de desconto"
            name="pontosPorRealDesconto"
            type="number"
            min={1}
            defaultValue={configuracao.pontosPorRealDesconto}
            required
          />
          <Select
            label="Validade dos pontos"
            name="validadePontosAtiva"
            defaultValue={String(configuracao.validadePontosAtiva)}
            options={[
              { value: "true", label: "Ativada" },
              { value: "false", label: "Desativada (não expiram)" },
            ]}
          />
          <Input
            label="Período de validade (dias)"
            name="validadePontosDias"
            type="number"
            min={1}
            defaultValue={configuracao.validadePontosDias}
            required
          />
        </div>
      </Card>

      <Card padding="lg" className="space-y-5">
        <SectionTitle
          title="Níveis de fidelidade"
          subtitle="Pontuação mínima para o cliente alcançar cada nível. Ao salvar, todos os clientes são reclassificados automaticamente."
        />

        <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">
          <Award size={18} className="text-brand-dark" strokeWidth={1.75} />
          <p className="text-sm text-ink/60">
            <strong className="text-ink">{TIER_LABELS.bronze}</strong> é o nível inicial de todo
            cliente (a partir de 0 pontos).
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {niveis.map((nivel) => (
            <Input
              key={nivel.name}
              label={`${nivel.label} — a partir de`}
              name={nivel.name}
              type="number"
              min={1}
              defaultValue={nivel.valor}
              required
            />
          ))}
        </div>
      </Card>

      <Button type="submit" disabled={pending} fullWidth={false}>
        {pending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}

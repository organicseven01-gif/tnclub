"use client";

import { useActionState } from "react";
import { ImageIcon } from "lucide-react";
import { Button, Input, Select, Textarea, Alert } from "@/components/ui";
import { initialFormState } from "@/types";
import type { Beneficio, FormState } from "@/types";

interface BeneficioFormProps {
  beneficio?: Beneficio;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export function BeneficioForm({ beneficio, action }: BeneficioFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const emEdicao = Boolean(beneficio);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <Alert variant="error">{state.error}</Alert>}

      <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white">
          <ImageIcon size={28} className="text-ink/30" strokeWidth={1.5} />
        </div>
        <p className="text-xs text-ink/40">Upload de imagem disponível em uma etapa futura</p>
        <Input
          name="imagemUrl"
          defaultValue={beneficio?.imagemUrl}
          placeholder="URL da imagem (opcional)"
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Nome do benefício"
          name="nome"
          defaultValue={beneficio?.nome}
          placeholder="Ex: 10% de desconto"
          required
          className="sm:col-span-2"
        />
        <Textarea
          label="Descrição"
          name="descricao"
          defaultValue={beneficio?.descricao}
          placeholder="Descreva o benefício oferecido"
          required
          className="sm:col-span-2"
        />
        <Input
          label="Pontos necessários"
          name="pontosNecessarios"
          type="number"
          min={0}
          defaultValue={beneficio?.pontosNecessarios}
          placeholder="0"
          required
        />
        <Select
          label="Status"
          name="ativo"
          defaultValue={beneficio ? String(beneficio.ativo) : "true"}
          options={[
            { value: "true", label: "Ativo" },
            { value: "false", label: "Inativo" },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} fullWidth={false}>
          {pending ? "Salvando..." : emEdicao ? "Salvar alterações" : "Cadastrar benefício"}
        </Button>
        <Button href="/admin/beneficios" variant="outline" fullWidth={false}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

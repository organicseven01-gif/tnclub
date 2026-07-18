"use client";

import { useActionState } from "react";
import { CheckCircle2, Gift } from "lucide-react";
import { Card, Button, Alert } from "@/components/ui";
import { formatPoints } from "@/utils/formatters";
import { initialFormState } from "@/types";
import type { Beneficio, FormState } from "@/types";

interface RewardCardProps {
  beneficio: Beneficio;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export function RewardCard({ beneficio, action }: RewardCardProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  return (
    <Card padding="md" className="flex flex-col">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10">
        <Gift size={22} className="text-brand" strokeWidth={1.75} />
      </div>

      <h3 className="mt-4 text-base font-bold text-ink">{beneficio.nome}</h3>
      <p className="mt-1 flex-1 text-xs text-ink/50">{beneficio.descricao}</p>

      <p className="mt-4 text-sm font-bold text-brand-dark">
        {formatPoints(beneficio.pontosNecessarios)}
      </p>

      {state.success ? (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-brand-light/15 py-3 text-sm font-semibold text-brand-dark">
          <CheckCircle2 size={16} />
          Resgate confirmado!
        </div>
      ) : (
        <form action={formAction} className="mt-3">
          <input type="hidden" name="beneficioId" value={beneficio.id} />
          {state.error && (
            <Alert variant="error" className="mb-3">
              {state.error}
            </Alert>
          )}
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Resgatando..." : "Resgatar"}
          </Button>
        </form>
      )}
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Droplets } from "lucide-react";
import { Card, Input, Button, Alert } from "@/components/ui";
import { initialFormState } from "@/types";
import { entrarComoAdminAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(entrarComoAdminAction, initialFormState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-10">
      <Link href="/" className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink/50">
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <Card padding="lg" className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark">
            <Droplets size={22} className="text-brand-light" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-ink">Login Administrativo</h1>
          <p className="mt-1 text-sm text-ink/55">Acesse o painel de gestão do Clube de Benefícios.</p>
        </div>

        <form action={formAction} className="mt-6 space-y-5">
          {state.error && <Alert variant="error">{state.error}</Alert>}

          <Input label="E-mail" name="email" type="email" placeholder="voce@tnclean.com" required />
          <Input label="Senha" name="senha" type="password" placeholder="••••••••" required />

          <Button type="submit" variant="secondary" size="lg" disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

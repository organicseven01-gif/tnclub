import { UserRound } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { LevelBadge } from "./LevelBadge";
import { formatDate, formatPoints } from "@/utils/formatters";
import type { Cliente } from "@/types";

interface ProfileCardProps {
  cliente: Cliente;
  editarHref?: string;
}

export function ProfileCard({ cliente, editarHref }: ProfileCardProps) {
  const fields = [
    { label: "Telefone", value: cliente.telefone },
    { label: "CPF", value: cliente.cpf },
    { label: "E-mail", value: cliente.email },
    { label: "Cliente desde", value: formatDate(cliente.dataCadastro) },
  ];

  return (
    <Card padding="lg">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-dark/10">
          <UserRound size={36} className="text-brand-dark" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink">{cliente.nome}</h2>
        <div className="mt-2 flex items-center gap-2">
          <LevelBadge nivel={cliente.nivel} />
          <span className="text-xs font-semibold text-brand-dark">
            {formatPoints(cliente.saldoPontos)}
          </span>
        </div>
      </div>

      <div className="mt-6 divide-y divide-black/5 border-t border-black/5">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between py-3">
            <span className="text-xs text-ink/45">{field.label}</span>
            <span className="text-sm font-medium text-ink">{field.value}</span>
          </div>
        ))}
      </div>

      {editarHref ? (
        <Button href={editarHref} variant="outline" size="md" className="mt-2">
          Editar
        </Button>
      ) : (
        <Button variant="outline" size="md" className="mt-2">
          Editar
        </Button>
      )}
    </Card>
  );
}

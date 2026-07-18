import { UserPlus } from "lucide-react";
import { EmptyState, Button } from "@/components/ui";

export function SemClienteState() {
  return (
    <EmptyState
      icon={UserPlus}
      title="Você ainda não entrou"
      description="Faça login com seu CPF ou telefone para ver seus pontos, histórico e benefícios."
      action={
        <Button href="/" fullWidth={false}>
          Ir para o login
        </Button>
      }
    />
  );
}

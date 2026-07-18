import { Switch } from "@/components/ui";

interface StatusToggleFormProps {
  id: string;
  ativo: boolean;
  action: (formData: FormData) => Promise<void>;
}

export function StatusToggleForm({ id, ativo, action }: StatusToggleFormProps) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Switch checked={ativo} aria-label={ativo ? "Desativar" : "Ativar"} />
    </form>
  );
}

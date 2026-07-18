import { PageHeader, ClienteForm } from "@/components/admin";
import { criarClienteAction } from "../actions";

export default function NovoClientePage() {
  return (
    <div>
      <PageHeader title="Novo cliente" subtitle="Cadastre um novo cliente no clube de fidelidade" />
      <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-card">
        <ClienteForm action={criarClienteAction} />
      </div>
    </div>
  );
}

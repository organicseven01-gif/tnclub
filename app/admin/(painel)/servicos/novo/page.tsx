import { PageHeader, ServicoForm } from "@/components/admin";
import { criarServicoAction } from "../actions";

export default function NovoServicoPage() {
  return (
    <div>
      <PageHeader title="Novo serviço" subtitle="Cadastre um novo serviço de higienização" />
      <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-card">
        <ServicoForm action={criarServicoAction} />
      </div>
    </div>
  );
}

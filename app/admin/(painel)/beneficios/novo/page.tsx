import { PageHeader, BeneficioForm } from "@/components/admin";
import { criarBeneficioAction } from "../actions";

export default function NovoBeneficioPage() {
  return (
    <div>
      <PageHeader title="Novo benefício" subtitle="Cadastre uma nova recompensa para o clube" />
      <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-card">
        <BeneficioForm action={criarBeneficioAction} />
      </div>
    </div>
  );
}

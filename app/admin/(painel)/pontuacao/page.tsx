import { PageHeader, PontuacaoForm } from "@/components/admin";
import { getClientes } from "@/services/clienteService";
import { getServicos } from "@/services/servicoService";
import { registrarAtendimentoAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PontuacaoPage() {
  const [clientes, servicos] = await Promise.all([getClientes(), getServicos()]);

  const clientesAtivos = clientes.filter((cliente) => cliente.status === "ativo");
  const servicosAtivos = servicos.filter((servico) => servico.ativo);

  return (
    <div>
      <PageHeader
        title="Pontuação"
        subtitle="Registre um atendimento e gere pontos automaticamente para o cliente"
      />
      <PontuacaoForm clientes={clientesAtivos} servicos={servicosAtivos} action={registrarAtendimentoAction} />
    </div>
  );
}

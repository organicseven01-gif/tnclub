import { PageHeader, PontuacaoForm } from "@/components/admin";
import { getClientes } from "@/services/clienteService";
import { getServicos } from "@/services/servicoService";
import { getConfiguracao } from "@/services/configuracaoService";
import { registrarAtendimentoAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PontuacaoPage() {
  const [clientes, servicos, configuracao] = await Promise.all([
    getClientes(),
    getServicos(),
    getConfiguracao(),
  ]);

  const clientesAtivos = clientes.filter((cliente) => cliente.status === "ativo");
  const servicosAtivos = servicos.filter((servico) => servico.ativo);

  return (
    <div>
      <PageHeader
        title="Pontuação"
        subtitle="Registre um atendimento e gere pontos automaticamente para o cliente"
      />
      <PontuacaoForm
        clientes={clientesAtivos}
        servicos={servicosAtivos}
        reaisPorPonto={configuracao.reaisPorPonto}
        pontosPorRealDesconto={configuracao.pontosPorRealDesconto}
        action={registrarAtendimentoAction}
      />
    </div>
  );
}

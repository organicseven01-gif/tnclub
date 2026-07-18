import { PageHeader, ConfiguracoesForm } from "@/components/admin";
import { getConfiguracao } from "@/services/configuracaoService";
import { salvarConfiguracaoAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const configuracao = await getConfiguracao();

  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Defina o WhatsApp de atendimento e os pontos de cada nível de fidelidade"
      />
      <ConfiguracoesForm configuracao={configuracao} action={salvarConfiguracaoAction} />
    </div>
  );
}

import { Users, UserCheck, Sparkles, Gift, Award, ClipboardList, Wallet, Wrench, Plus } from "lucide-react";
import { SectionTitle, Card, Button, EmptyState } from "@/components/ui";
import { PageHeader, StatCard, GrowthChart } from "@/components/admin";
import { HistoryCard } from "@/components/shared";
import { getClientes } from "@/services/clienteService";
import { getServicos } from "@/services/servicoService";
import { listarBeneficios } from "@/services/beneficioService";
import { listarHistoricoDetalhado } from "@/services/historicoService";
import { listarResgates } from "@/services/resgateService";
import { formatPoints } from "@/utils/formatters";
import { calcularCrescimentoMensal } from "@/utils/indicadores";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [clientes, servicos, beneficios, historico, resgates] = await Promise.all([
    getClientes(),
    getServicos(),
    listarBeneficios(),
    listarHistoricoDetalhado(),
    listarResgates(),
  ]);

  const clientesAtivos = clientes.filter((cliente) => cliente.status === "ativo").length;
  const pontosEmitidos = historico.reduce((total, item) => total + item.pontosGerados, 0);
  const pontosResgatados = resgates.reduce((total, resgate) => total + resgate.pontosUtilizados, 0);
  const saldoTotal = clientes.reduce((total, cliente) => total + cliente.saldoPontos, 0);
  const ultimosAtendimentos = historico.slice(0, 5);
  const clientesPorId = new Map(clientes.map((cliente) => [cliente.id, cliente.nome]));

  const crescimentoMensal = calcularCrescimentoMensal(historico);

  const semClientes = clientes.length === 0;
  const semServicos = servicos.length === 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral do Clube TN Club" />

      {(semClientes || semServicos) && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {semClientes && (
            <Card padding="lg" className="flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10">
                <Users size={20} className="text-brand" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Nenhum cliente cadastrado ainda</p>
                <p className="mt-1 text-xs text-ink/50">
                  Cadastre o primeiro cliente para começar a usar o clube de fidelidade.
                </p>
              </div>
              <Button href="/admin/clientes/novo" fullWidth={false} icon={<Plus size={16} />}>
                Cadastrar primeiro cliente
              </Button>
            </Card>
          )}

          {semServicos && (
            <Card padding="lg" className="flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10">
                <Wrench size={20} className="text-brand" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Nenhum serviço cadastrado ainda</p>
                <p className="mt-1 text-xs text-ink/50">
                  Cadastre o primeiro serviço do catálogo de higienização.
                </p>
              </div>
              <Button href="/admin/servicos/novo" fullWidth={false} icon={<Plus size={16} />}>
                Cadastrar primeiro serviço
              </Button>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Clientes cadastrados" value={String(clientes.length)} />
        <StatCard icon={UserCheck} label="Clientes ativos" value={String(clientesAtivos)} />
        <StatCard icon={Wrench} label="Serviços cadastrados" value={String(servicos.length)} />
        <StatCard icon={Gift} label="Benefícios cadastrados" value={String(beneficios.length)} />
        <StatCard icon={Sparkles} label="Pontos emitidos" value={formatPoints(pontosEmitidos)} />
        <StatCard icon={Award} label="Pontos resgatados" value={formatPoints(pontosResgatados)} />
        <StatCard icon={Wallet} label="Saldo total em pontos" value={formatPoints(saldoTotal)} />
        <StatCard icon={ClipboardList} label="Atendimentos realizados" value={String(historico.length)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card padding="lg">
          <SectionTitle title="Crescimento de atendimentos" subtitle="Últimos 6 meses" />
          <GrowthChart dados={crescimentoMensal} />
        </Card>

        <div>
          <SectionTitle title="Últimos atendimentos" />
          {ultimosAtendimentos.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nenhum atendimento registrado"
              description="Os atendimentos aparecerão aqui assim que forem registrados."
            />
          ) : (
            <div className="space-y-3">
              {ultimosAtendimentos.map((item) => (
                <HistoryCard key={item.id} historico={item} clienteNome={clientesPorId.get(item.clienteId)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

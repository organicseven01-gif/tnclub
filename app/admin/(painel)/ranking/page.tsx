import { PageHeader, RankingTable } from "@/components/admin";
import { getRankingClientes } from "@/services/rankingService";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const ranking = await getRankingClientes();

  return (
    <div>
      <PageHeader
        title="Ranking de clientes"
        subtitle="Ordene pelos melhores clientes por valor gasto, pontos, saldo ou visitas"
      />
      <RankingTable ranking={ranking} />
    </div>
  );
}

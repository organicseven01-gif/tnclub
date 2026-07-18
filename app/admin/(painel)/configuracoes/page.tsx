import { Card, Input, SectionTitle, Button } from "@/components/ui";
import { PageHeader } from "@/components/admin";
import { APP_NAME, TIER_LABELS, TIER_ORDER, TIER_THRESHOLDS } from "@/utils/constants";
import { formatPoints } from "@/utils/formatters";

export default function ConfiguracoesPage() {
  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Estrutura preparada para uma etapa futura — nenhum salvamento é realizado ainda"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg" className="space-y-5">
          <SectionTitle title="Identidade da empresa" subtitle="Dados exibidos no aplicativo do cliente" />
          <Input label="Nome da empresa" defaultValue={APP_NAME} disabled />
          <div>
            <p className="mb-2 text-sm font-medium text-ink/70">Logo</p>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface text-xs text-ink/40">
              Logo
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm font-medium text-ink/70">Cor principal</p>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-brand" />
                <span className="text-sm text-ink/50">#1F7A4A</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink/70">Cor secundária</p>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-brand-dark" />
                <span className="text-sm text-ink/50">#124734</span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="space-y-5">
          <SectionTitle title="Contato" subtitle="Canais exibidos para o cliente" />
          <Input label="WhatsApp" defaultValue="(11) 90000-0000" disabled />
          <Input label="E-mail" defaultValue="contato@tnclean.com.br" disabled />
        </Card>

        <Card padding="lg" className="space-y-5 lg:col-span-2">
          <SectionTitle title="Programa de pontos" subtitle="Regras gerais de pontuação" />
          <Input label="Pontos por real gasto" defaultValue="1" disabled className="max-w-xs" />
        </Card>

        <Card padding="lg" className="space-y-4 lg:col-span-2">
          <SectionTitle title="Níveis de fidelidade" subtitle="Pontuação mínima para cada nível" />
          <div className="divide-y divide-black/5">
            {TIER_ORDER.map((nivel) => (
              <div key={nivel} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-ink">{TIER_LABELS[nivel]}</span>
                <span className="text-sm text-ink/50">
                  a partir de {formatPoints(TIER_THRESHOLDS[nivel])}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Button disabled className="mt-6" fullWidth={false}>
        Salvar alterações
      </Button>
    </div>
  );
}

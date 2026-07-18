import Link from "next/link";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { PageHeader, ConfirmSubmitButton, StatusToggleForm } from "@/components/admin";
import { Card, Badge, Button, EmptyState } from "@/components/ui";
import { listarBeneficios } from "@/services/beneficioService";
import { formatPoints } from "@/utils/formatters";
import { excluirBeneficioAction, alternarStatusBeneficioAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function BeneficiosAdminPage() {
  const beneficios = await listarBeneficios();

  return (
    <div>
      <PageHeader
        title="Benefícios"
        subtitle="Gerencie o catálogo de recompensas do clube"
        action={
          <Button href="/admin/beneficios/novo" fullWidth={false} icon={<Plus size={16} />}>
            Novo Benefício
          </Button>
        }
      />

      {beneficios.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Nenhum benefício cadastrado ainda"
          description="Cadastre o primeiro benefício para o clube de fidelidade."
          action={
            <Button href="/admin/beneficios/novo" fullWidth={false} icon={<Plus size={16} />}>
              Cadastrar primeiro benefício
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {beneficios.map((beneficio) => (
            <Card key={beneficio.id} padding="md" className="flex flex-col">
              {beneficio.imagemUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={beneficio.imagemUrl}
                  alt={beneficio.nome}
                  className="h-24 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-24 items-center justify-center rounded-2xl bg-surface">
                  <ImageIcon size={26} className="text-ink/25" strokeWidth={1.5} />
                </div>
              )}

              <div className="mt-4 flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-ink">{beneficio.nome}</h3>
                <Badge variant={beneficio.ativo ? "success" : "neutral"}>
                  {beneficio.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="mt-1 flex-1 text-xs text-ink/50">{beneficio.descricao}</p>
              <p className="mt-3 text-sm font-bold text-brand-dark">
                {formatPoints(beneficio.pontosNecessarios)}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                <StatusToggleForm
                  id={beneficio.id}
                  ativo={beneficio.ativo}
                  action={alternarStatusBeneficioAction}
                />
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/beneficios/${beneficio.id}/editar`}
                    className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark"
                  >
                    <Pencil size={14} /> Editar
                  </Link>
                  <form action={excluirBeneficioAction}>
                    <input type="hidden" name="id" value={beneficio.id} />
                    <ConfirmSubmitButton
                      confirmMessage={`Excluir o benefício "${beneficio.nome}"?`}
                      className="text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={14} /> Excluir
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

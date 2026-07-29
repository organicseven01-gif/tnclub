"use client";

import { useState } from "react";
import { RotateCcw, Gift } from "lucide-react";
import { Card, Button, Alert } from "@/components/ui";
import { formatPoints, formatDate } from "@/utils/formatters";
import type { ResgateDetalhado } from "@/services/resgateService";

interface ResgatesClienteProps {
  clienteId: string;
  resgates: ResgateDetalhado[];
  action: (clienteId: string, resgateId: string) => Promise<{ ok: boolean; erro?: string }>;
}

// Lista os resgates do cliente e permite ao admin estornar (devolver os pontos)
// quando um resgate não dá certo.
export function ResgatesCliente({ clienteId, resgates, action }: ResgatesClienteProps) {
  const [confirmar, setConfirmar] = useState<ResgateDetalhado | null>(null);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function estornar() {
    if (!confirmar) return;
    setProcessando(true);
    setErro(null);
    const resultado = await action(clienteId, confirmar.id);
    setProcessando(false);
    if (resultado.ok) {
      setConfirmar(null);
    } else {
      setErro(resultado.erro ?? "Não foi possível estornar.");
    }
  }

  return (
    <Card padding="lg" className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-ink">Resgates do cliente</h3>
        <p className="mt-1 text-xs text-ink/50">
          Se um resgate não der certo, use <strong>Estornar</strong> para devolver os pontos ao
          cliente.
        </p>
      </div>

      {resgates.length === 0 ? (
        <p className="text-xs text-ink/40">Este cliente ainda não resgatou benefícios.</p>
      ) : (
        <ul className="space-y-3">
          {resgates.map((resgate) => {
            const cancelado = resgate.status === "cancelado";
            return (
              <li
                key={resgate.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Gift size={15} className="shrink-0 text-brand" strokeWidth={1.75} />
                    <p className="truncate text-sm font-semibold text-ink">{resgate.beneficioNome}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {formatPoints(resgate.pontosUtilizados)} · {formatDate(resgate.data)}
                  </p>
                </div>

                {cancelado ? (
                  <span className="shrink-0 rounded-full bg-ink/5 px-3 py-1 text-[11px] font-semibold text-ink/40">
                    Estornado
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setErro(null);
                      setConfirmar(resgate);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-ink/5"
                  >
                    <RotateCcw size={13} strokeWidth={2} />
                    Estornar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal de confirmação do estorno */}
      {confirmar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => !processando && setConfirmar(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
              <RotateCcw size={26} className="text-brand" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">Estornar resgate</h3>
            <p className="mt-1 text-sm text-ink/60">
              Devolver <strong className="text-ink">{formatPoints(confirmar.pontosUtilizados)}</strong>{" "}
              ao cliente e cancelar o resgate de{" "}
              <strong className="text-ink">{confirmar.beneficioNome}</strong>?
            </p>

            {erro && (
              <Alert variant="error" className="mt-3 text-left">
                {erro}
              </Alert>
            )}

            <div className="mt-5 space-y-3">
              <Button type="button" size="md" onClick={estornar} disabled={processando}>
                {processando ? "Estornando..." : "Sim, devolver os pontos"}
              </Button>
              <button
                type="button"
                onClick={() => setConfirmar(null)}
                disabled={processando}
                className="w-full text-sm font-medium text-ink/50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

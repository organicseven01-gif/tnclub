"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button, Alert } from "@/components/ui";

interface ExcluirClienteButtonProps {
  clienteId: string;
  clienteNome: string;
  action: (id: string) => Promise<{ ok: boolean; erro?: string }>;
}

// Botão de exclusão de cliente (uso em testes): abre um modal de confirmação e,
// ao confirmar, apaga o cliente e todo o histórico dele.
export function ExcluirClienteButton({ clienteId, clienteNome, action }: ExcluirClienteButtonProps) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function excluir() {
    setProcessando(true);
    setErro(null);
    const resultado = await action(clienteId);
    if (resultado.ok) {
      setAberto(false);
      router.refresh();
    } else {
      setErro(resultado.erro ?? "Não foi possível excluir.");
    }
    setProcessando(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErro(null);
          setAberto(true);
        }}
        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
      >
        <Trash2 size={14} /> Excluir
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => !processando && setAberto(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <Trash2 size={26} className="text-red-600" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">Excluir cliente</h3>
            <p className="mt-1 text-sm text-ink/60">
              Excluir <strong className="text-ink">{clienteNome}</strong> e todo o histórico
              (atendimentos, pontos e resgates)? Esta ação não pode ser desfeita.
            </p>

            {erro && (
              <Alert variant="error" className="mt-3 text-left">
                {erro}
              </Alert>
            )}

            <div className="mt-5 space-y-3">
              <Button
                type="button"
                size="md"
                onClick={excluir}
                disabled={processando}
                className="bg-none bg-red-600 shadow-none hover:bg-red-700 hover:shadow-none"
              >
                {processando ? "Excluindo..." : "Sim, excluir"}
              </Button>
              <button
                type="button"
                onClick={() => setAberto(false)}
                disabled={processando}
                className="w-full text-sm font-medium text-ink/50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

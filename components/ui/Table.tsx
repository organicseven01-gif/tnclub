import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { EmptyState } from "./EmptyState";

export interface TableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Assim que houver dados, eles aparecerão aqui.",
  emptyAction,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} action={emptyAction} />
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 text-xs font-semibold uppercase tracking-wide text-ink/40">
            {columns.map((column) => (
              <th key={column.header} className="px-5 py-4 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="transition-colors hover:bg-surface/60">
              {columns.map((column) => (
                <td key={column.header} className={column.className ?? "px-5 py-4 text-ink"}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

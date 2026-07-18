import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card padding="md" className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10">
        <Icon size={20} className="text-brand" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-xs font-medium text-ink/50">{label}</p>
        <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-ink/40">{hint}</p>}
      </div>
    </Card>
  );
}

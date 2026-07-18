import { Badge } from "@/components/ui";
import { TIER_LABELS } from "@/utils/constants";
import type { NivelFidelidade } from "@/types";

interface LevelBadgeProps {
  nivel: NivelFidelidade;
  tone?: "solid" | "subtle";
}

export function LevelBadge({ nivel, tone = "solid" }: LevelBadgeProps) {
  return (
    <Badge variant="brand" className={tone === "subtle" ? "bg-white/15 text-white" : undefined}>
      {TIER_LABELS[nivel]}
    </Badge>
  );
}

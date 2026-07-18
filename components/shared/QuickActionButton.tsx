import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui";

interface QuickActionButtonProps {
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function QuickActionButton({ href, label, icon: Icon, variant = "outline" }: QuickActionButtonProps) {
  return (
    <Button href={href} variant={variant} size="md" icon={<Icon size={16} />}>
      {label}
    </Button>
  );
}

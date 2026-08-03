import {
  Home,
  Sparkles,
  Clock,
  Gift,
  User,
  LayoutDashboard,
  Users,
  Wrench,
  ClipboardPlus,
  Settings,
  Trophy,
} from "lucide-react";
import type { NavItem, NivelFidelidade, StatusCliente } from "@/types";

export const APP_NAME = "TN Club";
export const PROGRAM_NAME = "TN Club";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Pontos", href: "/pontos", icon: Sparkles },
  { label: "Histórico", href: "/historico", icon: Clock },
  { label: "Benefícios", href: "/beneficios", icon: Gift },
  { label: "Perfil", href: "/perfil", icon: User },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Ranking", href: "/admin/ranking", icon: Trophy },
  { label: "Serviços", href: "/admin/servicos", icon: Wrench },
  { label: "Pontuação", href: "/admin/pontuacao", icon: ClipboardPlus },
  { label: "Benefícios", href: "/admin/beneficios", icon: Gift },
  { label: "Histórico", href: "/admin/historico", icon: Clock },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export const TIER_LABELS: Record<NivelFidelidade, string> = {
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
  diamante: "Diamante",
};

export const TIER_ORDER: NivelFidelidade[] = ["bronze", "prata", "ouro", "diamante"];

// Quantidade mínima de SERVIÇOS realizados para alcançar cada nível.
// Padrão: 1-2 serviços Bronze, 3 Prata, 4 Ouro, 5 ou mais Diamante.
export const TIER_THRESHOLDS: Record<NivelFidelidade, number> = {
  bronze: 0,
  prata: 3,
  ouro: 4,
  diamante: 5,
};

export const STATUS_CLIENTE_LABELS: Record<StatusCliente, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
};

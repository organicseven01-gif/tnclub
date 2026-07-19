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
  { label: "Meus Pontos", href: "/pontos", icon: Sparkles },
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
  platina: "Platina",
  diamante: "Diamante",
};

export const TIER_ORDER: NivelFidelidade[] = ["bronze", "prata", "ouro", "platina", "diamante"];

// Único ponto de configuração dos limites de pontos de cada nível.
export const TIER_THRESHOLDS: Record<NivelFidelidade, number> = {
  bronze: 0,
  prata: 500,
  ouro: 1500,
  platina: 3000,
  diamante: 6000,
};

export const STATUS_CLIENTE_LABELS: Record<StatusCliente, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
};

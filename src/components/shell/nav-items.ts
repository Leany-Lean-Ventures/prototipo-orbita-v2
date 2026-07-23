import {
  LayoutDashboard,
  Store,
  Users,
  Building2,
  ClipboardList,
  AlertTriangle,
  MapPin,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

/**
 * Fonte única dos itens do menu principal (PRD-00 §4.1). Usada pelo
 * AppSidebar e por `resolveNavLabel` (título das páginas "Em construção") —
 * atualizar aqui ao adicionar uma página nova.
 */
export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Unidades", path: "/unidades", icon: Store },
  { label: "PVs", path: "/pvs", icon: Building2 },
  { label: "Consultores", path: "/consultores", icon: Users },
  { label: "Prévias", path: "/previas", icon: ClipboardList },
  { label: "Ocorrências", path: "/ocorrencias", icon: AlertTriangle },
  { label: "Visitas", path: "/visitas", icon: MapPin },
  { label: "Relatórios", path: "/relatorios", icon: BarChart3 },
  { label: "Configurações", path: "/configuracoes", icon: Settings },
];

/**
 * Resolve o label de navegação para uma rota — usado pelo título das
 * páginas "Em construção" (`ComingSoon.tsx`). Faz match exato primeiro;
 * cai para o prefixo mais longo (rotas de detalhe, ex.: /unidades/:id)
 * em seguida.
 */
export function resolveNavLabel(pathname: string): string {
  const exact = navItems.find((item) => item.path === pathname);
  if (exact) return exact.label;

  const byPrefix = [...navItems]
    .filter((item) => item.path !== "/" && pathname.startsWith(item.path))
    .sort((a, b) => b.path.length - a.path.length)[0];

  return byPrefix?.label ?? "Órbita";
}

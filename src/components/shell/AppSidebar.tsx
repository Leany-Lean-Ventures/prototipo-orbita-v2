import { NavLink, useNavigate } from "react-router-dom";
import { Bell, User, LogOut, MoreVertical } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useAlertsPanel } from "@/lib/alerts-panel-context";
import { alerts } from "@/lib/mock-data/alerts";
import ademIconVermelho from "@/assets/brand/ademicon-icone-vermelho.svg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from "./nav-items";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { open: openAlertsPanel } = useAlertsPanel();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-[236px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/50 bg-card/80 shadow-soft backdrop-blur-md dark:border-white/5">
      <div className="flex h-16 items-center justify-between px-5">
        <span className="flex items-center gap-2 font-display text-lg font-bold text-sidebar-foreground">
          <img src={ademIconVermelho} alt="" className="h-5 w-5" />
          Órbita
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Alertas (${alerts.length} ativos)`}
          className="relative h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={openAlertsPanel}
        >
          <Bell className="h-4 w-4" />
          {alerts.length > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-primary text-[10px] text-primary-foreground">
              {alerts.length}
            </span>
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-micro ease-micro",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className={[
                        "shrink-0 px-1.5 py-0 text-[10px] font-medium leading-4",
                        isActive
                          ? "border-sidebar-primary-foreground/40 bg-sidebar-primary-foreground/15 text-sidebar-primary-foreground"
                          : "border-sidebar-border/60 bg-transparent text-sidebar-foreground/70",
                      ].join(" ")}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 border-t border-sidebar-border p-4 text-left transition-colors duration-micro ease-micro hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <Avatar className="h-8 w-8 border-2 border-card shadow-md">
                <AvatarImage src="https://i.pravatar.cc/40?img=68" alt={user.name} />
                <AvatarFallback>{user.avatar}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/70">
                  {user.role}
                </p>
              </div>
              <MoreVertical className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user.role}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </aside>
  );
}

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { alerts } from "@/lib/mock-data/alerts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertsPanel } from "./AlertsPanel";
import { resolveNavLabel } from "./nav-items";

export function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [alertsOpen, setAlertsOpen] = useState(false);

  const breadcrumbLabel = resolveNavLabel(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-page-header mb-4 flex h-16 shrink-0 items-center justify-between rounded-2xl border border-white/50 bg-card/80 px-6 shadow-soft backdrop-blur-md dark:border-white/5">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{breadcrumbLabel}</span>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Alertas (${alerts.length} ativos)`}
            className="relative"
            onClick={() => setAlertsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {alerts.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-primary text-[10px] text-primary-foreground">
                {alerts.length}
              </span>
            )}
          </Button>

          <div className="mx-1 h-8 w-px bg-border" aria-hidden="true" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full transition-shadow duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Menu do usuário"
              >
                <Avatar className="h-9 w-9 border-2 border-card shadow-md">
                  <AvatarFallback>{user?.avatar}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {user?.role}
                </p>
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
        </div>
      </header>

      <AlertsPanel open={alertsOpen} onOpenChange={setAlertsOpen} />
    </>
  );
}

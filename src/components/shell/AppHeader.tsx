import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { alerts } from "@/lib/mock-data/alerts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
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
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full p-0 text-[10px]"
              >
                {alerts.length}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-1 rounded-full transition-shadow duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Menu do usuário"
              >
                <Avatar className="h-8 w-8">
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

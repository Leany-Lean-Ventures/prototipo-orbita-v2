import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { alerts, type AlertColorTheme } from "@/lib/mock-data/alerts";

const colorClasses: Record<AlertColorTheme, string> = {
  red: "bg-destructive/10 text-destructive",
  amber: "bg-warning/10 text-warning",
  gray: "bg-muted text-muted-foreground",
  green: "bg-success/10 text-success",
  blue: "bg-info/10 text-info",
  violet: "bg-secondary/20 text-foreground",
};

interface AlertsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertsPanel({ open, onOpenChange }: AlertsPanelProps) {
  const navigate = useNavigate();

  const handleResolve = (route: string) => {
    onOpenChange(false);
    navigate(route);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Alertas que exigem ação</SheetTitle>
          <SheetDescription>
            {alerts.length} alerta(s) ativo(s) na rede.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
            <div
              key={alert.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClasses[alert.colorTheme]}`}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {alert.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alert.count} ocorrência(s)
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResolve(alert.actionRoute)}
              >
                Resolver
              </Button>
            </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

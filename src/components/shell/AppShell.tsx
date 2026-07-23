import { Outlet } from "react-router-dom";

import { AlertsPanelProvider, useAlertsPanel } from "@/lib/alerts-panel-context";
import { AppSidebar } from "./AppSidebar";
import { AlertsPanel } from "./AlertsPanel";

function AppShellLayout() {
  const { isOpen, setOpen } = useAlertsPanel();

  return (
    <div className="flex min-h-screen gap-4 bg-background bg-mesh p-4">
      {/*
        Sem overflow-y-auto num container interno: a página inteira rola
        pelo scroll nativo do navegador (barra na borda real da janela,
        como no V1). Sidebar fica parada via position: sticky (não via um
        container de scroll isolado) — AppSidebar.tsx tem
        `sticky top-4 h-[calc(100vh-2rem)]`. Não reintroduzir
        overflow-y-auto aqui: já aconteceu de quebrar isso (ver MEMORY.md).
      */}
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <main>
          <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-6">
            <Outlet />
          </div>
        </main>
      </div>
      <AlertsPanel open={isOpen} onOpenChange={setOpen} />
    </div>
  );
}

export function AppShell() {
  return (
    <AlertsPanelProvider>
      <AppShellLayout />
    </AlertsPanelProvider>
  );
}

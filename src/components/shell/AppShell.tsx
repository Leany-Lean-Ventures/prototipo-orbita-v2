import { Outlet } from "react-router-dom";

import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppShell() {
  return (
    <div className="flex h-screen gap-4 overflow-hidden bg-background bg-mesh p-4">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

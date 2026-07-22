import { Outlet } from "react-router-dom";

import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppShell() {
  return (
    <div className="flex h-screen gap-4 overflow-hidden bg-background bg-mesh p-4">
      <AppSidebar />
      {/*
        min-w-0 + overflow-y-auto: este div é o container de scroll. O
        header vive dentro dele como sticky (não como irmão separado do
        <main>), para que o conteúdo role por baixo dele e apareça,
        borrado, através do backdrop-blur — em vez de só empilhar header
        e conteúdo com um gap fixo entre os dois.
      */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <AppHeader />
        <main>
          <div className="mx-auto max-w-[1440px] px-6 pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

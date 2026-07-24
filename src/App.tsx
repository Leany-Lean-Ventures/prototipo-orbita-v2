import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import UnidadesLista from "@/pages/UnidadesLista";
import UnidadeDetalhe from "@/pages/UnidadeDetalhe";
import ComingSoon from "@/pages/ComingSoon";
import PVsLista from "@/pages/PVsLista";
import PVDetalhe from "@/pages/PVDetalhe";
import ConsultoresLista from "@/pages/ConsultoresLista";
import ConsultorDetalhe from "@/pages/ConsultorDetalhe";
import OcorrenciasPage from "@/pages/OcorrenciasPage";
import VisitasPage from "@/pages/VisitasPage";
import PreviasPage from "@/pages/PreviasPage";
import PreviaProcessoPage from "@/pages/PreviaProcessoPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/unidades" element={<UnidadesLista />} />
              <Route path="/unidades/:id" element={<UnidadeDetalhe />} />
              <Route path="/consultores" element={<ConsultoresLista />} />
              <Route path="/consultores/:id" element={<ConsultorDetalhe />} />
              <Route path="/pvs" element={<PVsLista />} />
              <Route path="/pvs/:id" element={<PVDetalhe />} />
              <Route path="/previas" element={<PreviasPage />} />
              <Route path="/previas/:id" element={<PreviaProcessoPage />} />
              <Route path="/ocorrencias" element={<OcorrenciasPage />} />
              <Route path="/visitas" element={<VisitasPage />} />
              <Route path="/relatorios" element={<ComingSoon />} />
              <Route path="/configuracoes" element={<ComingSoon />} />
            </Route>
            {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

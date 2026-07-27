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
import RelatoriosPage from "@/pages/RelatoriosPage";
import RegistrarVisitaPage from "@/pages/RegistrarVisitaPage";
import VisitaRespostaPage from "@/pages/VisitaRespostaPage";
import PreviasPage from "@/pages/PreviasPage";
import PreviaProcessoPage from "@/pages/PreviaProcessoPage";
import EsteiraHubPage from "@/pages/EsteiraHubPage";
import AberturaUnidadesKanbanPage from "@/pages/AberturaUnidadesKanbanPage";
import PromocaoConsultoresKanbanPage from "@/pages/PromocaoConsultoresKanbanPage";
import PromocaoConsultorDetalhePage from "@/pages/PromocaoConsultorDetalhePage";
import NovoRegistroPromocaoPage from "@/pages/NovoRegistroPromocaoPage";
import AberturaUnidadeDetalhePage from "@/pages/AberturaUnidadeDetalhePage";
import NovoRegistroAberturaPage from "@/pages/NovoRegistroAberturaPage";
import SocioDetalhe from "@/pages/SocioDetalhe";
import ConfiguracoesHubPage from "@/pages/ConfiguracoesHubPage";
import FormTemplatesListPage from "@/pages/FormTemplatesListPage";
import FormTemplateBuilderPage from "@/pages/FormTemplateBuilderPage";
import EtapasAberturaConfigPage from "@/pages/EtapasAberturaConfigPage";
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
              <Route path="/socios/:id" element={<SocioDetalhe />} />
              <Route path="/previas" element={<PreviasPage />} />
              <Route path="/previas/:id" element={<PreviaProcessoPage />} />
              <Route path="/esteira" element={<EsteiraHubPage />} />
              <Route path="/esteira/abertura-unidades" element={<AberturaUnidadesKanbanPage />} />
              <Route path="/esteira/abertura-unidades/novo" element={<NovoRegistroAberturaPage />} />
              <Route path="/esteira/abertura-unidades/:id" element={<AberturaUnidadeDetalhePage />} />
              <Route path="/esteira/promocao-consultores" element={<PromocaoConsultoresKanbanPage />} />
              <Route path="/esteira/promocao-consultores/novo" element={<NovoRegistroPromocaoPage />} />
              <Route path="/esteira/promocao-consultores/:id" element={<PromocaoConsultorDetalhePage />} />
              <Route path="/ocorrencias" element={<OcorrenciasPage />} />
              <Route path="/visitas" element={<VisitasPage />} />
              <Route path="/visitas/novo" element={<RegistrarVisitaPage />} />
              <Route path="/visitas/:id" element={<VisitaRespostaPage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
              <Route path="/configuracoes" element={<ConfiguracoesHubPage />} />
              <Route path="/configuracoes/alertas" element={<ComingSoon />} />
              <Route path="/configuracoes/perfis-acesso" element={<ComingSoon />} />
              <Route path="/configuracoes/modelos-formularios" element={<FormTemplatesListPage />} />
              <Route path="/configuracoes/modelos-formularios/novo" element={<FormTemplateBuilderPage />} />
              <Route path="/configuracoes/modelos-formularios/:id" element={<FormTemplateBuilderPage />} />
              <Route path="/configuracoes/etapas-abertura-unidades" element={<EtapasAberturaConfigPage />} />
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

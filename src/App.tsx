import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import ComingSoon from "@/pages/ComingSoon";
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
              <Route path="/unidades" element={<ComingSoon />} />
              <Route path="/consultores" element={<ComingSoon />} />
              <Route path="/pvs" element={<ComingSoon />} />
              <Route path="/previas" element={<ComingSoon />} />
              <Route path="/ocorrencias" element={<ComingSoon />} />
              <Route path="/visitas" element={<ComingSoon />} />
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

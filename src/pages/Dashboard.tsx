import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircleCheck } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useAlertsPanel } from "@/lib/alerts-panel-context";
import { EASE_SIGNATURE } from "@/lib/motion";
import { selecaoDaURL, paramsDaSelecao, SELECAO_GLOBAL, type MapSelection } from "@/lib/geo/selection";
import { agregar, kpisDaSelecao } from "@/lib/mock-data/rede-agregada";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { BrazilMapCard } from "@/components/dashboard/BrazilMapCard";
import { RankingCard } from "@/components/dashboard/RankingCard";
import { OcorrenciasChartCard } from "@/components/dashboard/OcorrenciasChartCard";
import { Avaliacao360RadarCard } from "@/components/dashboard/Avaliacao360RadarCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { open: openAlertsPanel } = useAlertsPanel();
  const [searchParams, setSearchParams] = useSearchParams();

  // Seleção serializada na URL — deep-linkável
  const sel: MapSelection = selecaoDaURL(searchParams);

  // KPIs derivados da seleção (coerentes por construção)
  const rede = agregar(sel);
  const kpis = kpisDaSelecao(rede);

  const handleSelect = useCallback(
    (nova: MapSelection) => {
      setSearchParams(paramsDaSelecao(nova), { replace: true });
    },
    [setSearchParams],
  );

  const handleNivelChange = useCallback(
    (nivel: MapSelection["nivel"]) => {
      // Trocar de nível reseta a seleção de item (evita "Sudeste selecionado com nível=estados")
      const nova: MapSelection =
        nivel === "global" ? SELECAO_GLOBAL
        : nivel === "regioes" ? { nivel: "regioes", regiao: null }
        : { nivel: "estados", uf: null };
      setSearchParams(paramsDaSelecao(nova), { replace: true });
    },
    [setSearchParams],
  );

  const handleKpiClick = useCallback(
    (kpi: (typeof kpis)[number]) => {
      if (kpi.isAlert) { openAlertsPanel(); return; }
      navigate(kpi.route);
    },
    [navigate, openAlertsPanel],
  );

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".dashboard-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".kpi-card", vars: { y: 16, opacity: 0, scale: 0.97, duration: 0.35, stagger: { each: 0.045, from: "start" }, ease: EASE_SIGNATURE }, position: "-=0.15" },
    { selector: ".dashboard-section", vars: { y: 16, opacity: 0, duration: 0.35, stagger: 0.06 }, position: "-=0.2" },
  ]);

  return (
    <div ref={entranceRef} className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="dashboard-header flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral da rede — clique no mapa para filtrar por região ou estado.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 border-success/30 bg-success/10 text-success">
          <CircleCheck className="h-3.5 w-3.5" />
          Atualizado há 2h · fonte: Data Lake (Gold)
        </Badge>
      </div>

      {/* Seção Superior: Mapa (Esquerda) vs KPIs + Ranking (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Coluna da Esquerda: Mapa */}
        <div className="flex flex-col h-full">
          <BrazilMapCard
            sel={sel}
            onSelect={handleSelect}
            onNivelChange={handleNivelChange}
            className="flex-1 h-full"
          />
        </div>

        {/* Coluna da Direita: KPIs (2x2) + Ranking */}
        <div className="flex flex-col gap-6">
          {/* Grid 2x2 para KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} onClick={() => handleKpiClick(kpi)} />
            ))}
          </div>

          {/* Card de Ranking */}
          <RankingCard
            sel={sel}
            onSelect={handleSelect}
            className="flex-1"
          />
        </div>
      </div>

      {/* Seção Inferior: Ocorrências (Esquerda) vs Avaliação 360° (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OcorrenciasChartCard sel={sel} />
        <Avaliacao360RadarCard sel={sel} />
      </div>
    </div>
  );
};

export default Dashboard;



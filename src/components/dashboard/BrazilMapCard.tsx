import { Map } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { REGIOES, UFS, ESTADOS, type Regiao, type UF } from "@/lib/geo/estados";
import { rotuloSelecao, paramsDaSelecao, type MapSelection } from "@/lib/geo/selection";
import { BrazilMapSvg } from "./BrazilMapSvg";

interface BrazilMapCardProps {
  sel: MapSelection;
  onSelect: (sel: MapSelection) => void;
  onNivelChange: (nivel: MapSelection["nivel"]) => void;
  className?: string;
}

const NIVEL_LABELS: Record<MapSelection["nivel"], string> = {
  global: "Brasil",
  regioes: "Regiões",
  estados: "Estados",
};

export function BrazilMapCard({ sel, onSelect, onNivelChange, className }: BrazilMapCardProps) {
  const nivel = sel.nivel;
  const subtitulo = sel.nivel === "global"
    ? "Visão geral da rede"
    : `Filtrado por: ${rotuloSelecao(sel)}`;

  // Handler do Select de fallback (acessibilidade mobile/teclado)
  function handleFallbackSelect(value: string) {
    if (!value || value === "__brasil__") {
      onSelect({ nivel: "global" });
      return;
    }
    if (REGIOES.includes(value as Regiao)) {
      onSelect({ nivel: "regioes", regiao: value as Regiao });
    } else {
      onSelect({ nivel: "estados", uf: value as UF });
    }
  }

  // Valor atual do Select de fallback
  const fallbackValue = (() => {
    if (sel.nivel === "global") return "__brasil__";
    if (sel.nivel === "regioes") return sel.regiao ?? "__brasil__";
    return sel.uf ?? "__brasil__";
  })();

  // Serializa seleção como URL params (para deep-link)
  const params = paramsDaSelecao(sel);
  void params;

  return (
    <Card className={`dashboard-section flex flex-col gap-0 overflow-hidden p-0 ${className ?? ""}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-6 pb-4">
        <SectionHeader
          icon={Map}
          title="Mapa da Rede"
          subtitle={subtitulo}
        />

        {/* Seletor de granularidade */}
        <div
          className="flex items-center gap-1 rounded-xl bg-muted p-1"
          role="tablist"
          aria-label="Granularidade do mapa"
        >
          {(["global", "regioes", "estados"] as const).map((n) => (
            <button
              key={n}
              role="tab"
              aria-selected={nivel === n}
              onClick={() => onNivelChange(n)}
              className={[
                "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                nivel === n
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {NIVEL_LABELS[n]}
            </button>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div className="relative flex-1 px-4 pb-4" style={{ minHeight: 320 }}>
        <BrazilMapSvg
          sel={sel}
          nivel={nivel}
          onSelect={onSelect}
          className="h-full w-full"
        />
      </div>

      {/* Legenda + Select de fallback (acessibilidade) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: "hsl(var(--map-bubble-fill))" }} />
            <span className="text-[11px] text-muted-foreground">Presença da rede</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: "hsl(var(--map-empty))" }} />
            <span className="text-[11px] text-muted-foreground">Sem cobertura</span>
          </div>
        </div>

        {/* Select de fallback — alternativa de teclado/mobile para o SVG */}
        <label className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground sr-only sm:not-sr-only">Ir para:</span>
          <select
            className="h-7 rounded-lg border border-border bg-card px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={fallbackValue}
            onChange={(e) => handleFallbackSelect(e.target.value)}
            aria-label="Selecionar estado ou região no mapa"
          >
            <option value="__brasil__">Brasil (todos)</option>
            {nivel !== "estados" && (
              <optgroup label="Regiões">
                {REGIOES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </optgroup>
            )}
            {nivel !== "regioes" && (
              <optgroup label="Estados">
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{ESTADOS[uf].nome} ({uf})</option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
      </div>
    </Card>
  );
}

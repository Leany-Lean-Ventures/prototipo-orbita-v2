import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ESTADOS, type UF } from "@/lib/geo/estados";
import { type MapSelection } from "@/lib/geo/selection";
import { rankingDaSelecao, type RankingRow } from "@/lib/mock-data/rede-agregada";

interface RankingCardProps {
  sel: MapSelection;
  onSelect: (sel: MapSelection) => void;
  className?: string;
}

const BADGE_COLORS = [
  "bg-amber-400 text-white",     // 1º
  "bg-slate-400 text-white",     // 2º
  "bg-amber-700 text-white",     // 3º
  "bg-muted text-muted-foreground", // 4º+
];

function badgeClass(pos: number) {
  return BADGE_COLORS[Math.min(pos - 1, BADGE_COLORS.length - 1)];
}

function rowLabel(row: RankingRow, sel: MapSelection): string {
  // No nível de estados, mostra o nome completo
  if (sel.nivel === "estados" || sel.nivel === "global") {
    const uf = row.id as UF;
    if (uf in ESTADOS) return ESTADOS[uf].nome;
  }
  return row.label;
}

export function RankingCard({ sel, onSelect, className }: RankingCardProps) {
  const rows = rankingDaSelecao(sel);
  const maxLojas = Math.max(...rows.map((r) => r.lojas), 1);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);

  // Resetar página quando a seleção mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [sel]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = rows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const subtitulo = sel.nivel === "global"
    ? "por região"
    : sel.nivel === "regioes" && sel.regiao
      ? `estados do ${sel.regiao}`
      : sel.nivel === "estados" && sel.uf
        ? `região de ${sel.uf} · ${sel.uf} em destaque`
        : "top estados";

  function handleRowClick(row: RankingRow) {
    if (sel.nivel === "global" || (sel.nivel === "regioes" && !sel.regiao)) {
      onSelect({ nivel: "regioes", regiao: row.id as import("@/lib/geo/estados").Regiao });
    } else if (sel.nivel === "regioes" && sel.regiao) {
      onSelect({ nivel: "estados", uf: row.id as UF });
    } else {
      onSelect({ nivel: "estados", uf: row.id as UF });
    }
  }

  return (
    <Card className={`dashboard-section flex flex-col p-6 ${className ?? ""}`}>
      <SectionHeader
        icon={Trophy}
        title="Ranking de lojas"
        subtitle={subtitulo}
      />

      <div className="mt-4 flex-1 space-y-1">
        {paginatedRows.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma unidade nesta seleção
          </p>
        )}
        {paginatedRows.map((row, i) => {
          const globalPos = startIndex + i + 1;
          return (
            <button
              key={row.id}
              onClick={() => handleRowClick(row)}
              className={[
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                row.isHighlighted
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "hover:bg-accent",
              ].join(" ")}
            >
              {/* Badge de posição */}
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${badgeClass(globalPos)}`}
                aria-label={`Posição ${globalPos}`}
              >
                {globalPos}
              </span>

              {/* Nome */}
              <span className="flex-1 truncate text-sm font-medium text-foreground">
                {rowLabel(row, sel)}
                {row.isHighlighted && (
                  <span className="ml-1 text-xs text-primary">(selecionado)</span>
                )}
              </span>

              {/* Barra + valor */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.round((row.lojas / maxLojas) * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-semibold tabular-nums text-foreground">
                  {row.lojas}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 mt-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent text-foreground disabled:opacity-50 hover:bg-accent/80 transition-all"
          >
            Anterior
          </button>
          <span className="text-[11px] text-muted-foreground font-semibold">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent text-foreground disabled:opacity-50 hover:bg-accent/80 transition-all"
          >
            Próximo
          </button>
        </div>
      )}

      <p className="mt-3 text-[10px] text-muted-foreground">
        Clique numa linha para navegar a essa seleção
      </p>
    </Card>
  );
}

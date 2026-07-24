import { useState, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Calendar, User, FileText, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { HistoricoTipo } from "@/lib/mock-data/unidades";

export type TimelineColor = "gray" | "green" | "red" | "amber" | "blue" | "violet";

export interface TimelineEntry {
  data: string;
  icon: LucideIcon;
  color: TimelineColor;
  titulo: string;
  desc: string;
  status?: "Aberto" | "Resolvido";
  tipo?: HistoricoTipo;
  detalhe?: {
    responsavel?: string;
    observacao?: string;
    acao?: string;
    dataResolucao?: string;
  };
}

const COLOR_CLASSES: Record<TimelineColor, string> = {
  gray: "bg-muted text-muted-foreground",
  green: "bg-success/10 text-success",
  red: "bg-destructive/10 text-destructive",
  amber: "bg-warning/10 text-warning",
  blue: "bg-blue-500/10 text-blue-500",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
};

const BORDER_COLOR_CLASSES: Record<TimelineColor, string> = {
  gray: "border-l-muted-foreground",
  green: "border-l-success",
  red: "border-l-destructive",
  amber: "border-l-warning",
  blue: "border-l-blue-500",
  violet: "border-l-violet-600",
};

const TIPO_LABELS: Record<string, string> = {
  todos: "Todos os tipos",
  avaliacao: "Avaliação",
  promocao: "Promoção",
  ocorrencia: "Ocorrência",
  visita: "Visita",
  penalidade: "Penalidade",
  evento: "Evento",
};

function extractYear(data: string): string {
  const match = data.match(/\d{4}/);
  return match ? match[0] : "2026";
}

function extractMonth(data: string): string {
  return data.replace(/\d{4}/, "").trim();
}

interface TimelineProps {
  items: TimelineEntry[];
  /** Optional title rendered inline with filters. */
  title?: string;
  /** Optional subtitle below the title. */
  subtitle?: string;
}

/**
 * Timeline redesenhada: split layout (lista esquerda + detalhe direita),
 * filtro por ano e tipo na linha do título, breakpoints por mês, item selecionável.
 */
export function Timeline({ items, title, subtitle }: TimelineProps) {
  // Available years
  const years = useMemo(() => {
    const set = new Set(items.map((i) => extractYear(i.data)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [items]);

  const [selectedYear, setSelectedYear] = useState(years[0] ?? "2026");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items
  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (extractYear(item.data) !== selectedYear) return false;
      if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false;
      return true;
    });
  }, [items, selectedYear, tipoFiltro]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: { month: string; items: { item: TimelineEntry; globalIndex: number }[] }[] = [];
    let currentMonth = "";
    filtered.forEach((item, idx) => {
      const month = extractMonth(item.data);
      if (month !== currentMonth) {
        currentMonth = month;
        groups.push({ month, items: [] });
      }
      groups[groups.length - 1].items.push({ item, globalIndex: idx });
    });
    return groups;
  }, [filtered]);

  const selectedItem = filtered[selectedIndex] ?? null;

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhum evento registrado.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header: title left, filters right */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && (
            <div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setSelectedIndex(0); }}>
            <SelectTrigger className="h-8 w-[110px] text-xs" aria-label="Filtrar por ano">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoFiltro} onValueChange={(v) => { setTipoFiltro(v); setSelectedIndex(0); }}>
            <SelectTrigger className="h-8 w-[150px] text-xs" aria-label="Filtrar por tipo">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIPO_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum evento encontrado com os filtros aplicados.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Left: Timeline list */}
          <div className="lg:col-span-2">
            <div className="max-h-[520px] overflow-y-auto">
              {groupedByMonth.map((group) => (
                <div key={group.month}>
                  {/* Month breakpoint */}
                  <div className="sticky top-0 z-10 mb-2 mt-4 first:mt-0 bg-card">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {group.month}
                    </span>
                  </div>
                  {/* Items */}
                  <div className="space-y-1">
                    {group.items.map(({ item, globalIndex }) => {
                      const Icon = item.icon;
                      const isActive = globalIndex === selectedIndex;
                      return (
                        <button
                          key={`${item.data}-${globalIndex}`}
                          onClick={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border-l-4 px-3 py-3 text-left transition-all duration-150",
                            isActive
                              ? `bg-muted/40 ${BORDER_COLOR_CLASSES[item.color]}`
                              : "border-l-transparent hover:bg-muted/20"
                          )}
                        >
                          <span
                            className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", COLOR_CLASSES[item.color])}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-foreground">{item.titulo}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{item.desc}</p>
                          </div>
                          {item.status && (
                            <Badge
                              variant={item.status === "Resolvido" ? "success" : "destructive"}
                              className="shrink-0 text-[9px]"
                            >
                              {item.status}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detail panel */}
          <Card className="lg:col-span-3 p-6">
            {selectedItem ? (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <span
                    className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", COLOR_CLASSES[selectedItem.color])}
                  >
                    {(() => { const Icon = selectedItem.icon; return <Icon className="h-5 w-5" />; })()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-foreground">{selectedItem.titulo}</h4>
                      {selectedItem.status && (
                        <Badge variant={selectedItem.status === "Resolvido" ? "success" : "destructive"} className="text-[10px]">
                          {selectedItem.status}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{selectedItem.data}</p>
                    {selectedItem.tipo && (
                      <Badge variant="outline" className="mt-2 text-[10px]">
                        {TIPO_LABELS[selectedItem.tipo] ?? selectedItem.tipo}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-lg bg-muted/20 p-4">
                  <p className="text-sm leading-relaxed text-foreground">{selectedItem.desc}</p>
                </div>

                {/* Detail fields */}
                {selectedItem.detalhe && (
                  <div className="space-y-4">
                    {selectedItem.detalhe.responsavel && (
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Responsável</p>
                          <p className="text-sm text-foreground">{selectedItem.detalhe.responsavel}</p>
                        </div>
                      </div>
                    )}
                    {selectedItem.detalhe.observacao && (
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Observação</p>
                          <p className="text-sm leading-relaxed text-foreground">{selectedItem.detalhe.observacao}</p>
                        </div>
                      </div>
                    )}
                    {selectedItem.detalhe.acao && (
                      <div className="flex items-start gap-3">
                        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Ação</p>
                          <p className="text-sm text-foreground">{selectedItem.detalhe.acao}</p>
                        </div>
                      </div>
                    )}
                    {selectedItem.detalhe.dataResolucao && (
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Data de resolução</p>
                          <p className="text-sm text-foreground">{selectedItem.detalhe.dataResolucao}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Selecione um item do histórico para ver os detalhes.
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

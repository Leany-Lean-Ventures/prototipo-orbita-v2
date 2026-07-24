import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarPlus, User, FileText, Zap, CalendarCheck2, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
    penalidadeId?: string;
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
  /** Chamado quando o usuário clica em "Ver penalidade" num item tipo=penalidade. */
  onVerPenalidade?: (penalidadeId: string) => void;
}

/**
 * Timeline vertical de coluna única — linha conectora + chip de ícone por
 * item, expansão inline via Accordion (sem painel lateral sincronizado nem
 * scroll aninhado). Filtro por ano e tipo na linha do título, agrupamento
 * por mês.
 */
export function Timeline({ items, title, subtitle, onVerPenalidade }: TimelineProps) {
  const years = useMemo(() => {
    const set = new Set(items.map((i) => extractYear(i.data)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [items]);

  const [selectedYear, setSelectedYear] = useState(years[0] ?? "2026");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (extractYear(item.data) !== selectedYear) return false;
      if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false;
      return true;
    });
  }, [items, selectedYear, tipoFiltro]);

  const groupedByMonth = useMemo(() => {
    const groups: { month: string; items: { item: TimelineEntry; key: string }[] }[] = [];
    let currentMonth = "";
    filtered.forEach((item, idx) => {
      const month = extractMonth(item.data);
      if (month !== currentMonth) {
        currentMonth = month;
        groups.push({ month, items: [] });
      }
      groups[groups.length - 1].items.push({ item, key: `${item.data}-${idx}` });
    });
    return groups;
  }, [filtered]);

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
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-8 w-[110px] text-xs" aria-label="Filtrar por ano">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
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
        <div className="relative">
          {/* Linha conectora contínua, atrás dos chips de ícone */}
          <div className="absolute bottom-2 left-[26px] top-2 w-px bg-border" aria-hidden="true" />

          <Accordion type="single" collapsible className="relative space-y-1">
            {groupedByMonth.map((group) => (
              <div key={group.month}>
                <div className="relative mb-1 mt-5 bg-card pl-14 first:mt-0">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {group.month}
                  </span>
                </div>
                {group.items.map(({ item, key }) => {
                  const Icon = item.icon;
                  const temPenalidade = Boolean(onVerPenalidade && item.tipo === "penalidade" && item.detalhe?.penalidadeId);
                  return (
                    <AccordionItem key={key} value={key} className="border-none">
                      <AccordionTrigger className="rounded-xl px-2 py-2.5 hover:bg-muted/20 [&>svg]:mt-2.5">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <span
                            className={cn(
                              "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                              COLOR_CLASSES[item.color]
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1 pt-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[13px] font-medium text-foreground">{item.titulo}</p>
                              {item.status && (
                                <Badge
                                  variant={item.status === "Resolvido" ? "success" : "destructive"}
                                  className="text-[9px]"
                                >
                                  {item.status}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="ml-14 space-y-4 rounded-xl bg-muted/20 p-4">
                        <div className="flex items-start gap-3">
                          <CalendarPlus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Data de registro</p>
                            <p className="text-sm text-foreground">{item.data}</p>
                          </div>
                        </div>
                        {item.detalhe?.responsavel && (
                          <div className="flex items-start gap-3">
                            <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Responsável</p>
                              <p className="text-sm text-foreground">{item.detalhe.responsavel}</p>
                            </div>
                          </div>
                        )}
                        {item.detalhe?.observacao && (
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Observação</p>
                              <p className="text-sm leading-relaxed text-foreground">{item.detalhe.observacao}</p>
                            </div>
                          </div>
                        )}
                        {item.detalhe?.acao && (
                          <div className="flex items-start gap-3">
                            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Ação</p>
                              <p className="text-sm text-foreground">{item.detalhe.acao}</p>
                            </div>
                          </div>
                        )}
                        {item.detalhe?.dataResolucao && (
                          <div className="flex items-start gap-3">
                            <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Data de resolução</p>
                              <p className="text-sm text-foreground">{item.detalhe.dataResolucao}</p>
                            </div>
                          </div>
                        )}
                        {temPenalidade && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onVerPenalidade?.(item.detalhe!.penalidadeId!)}
                          >
                            <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                            Ver penalidade
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </div>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}

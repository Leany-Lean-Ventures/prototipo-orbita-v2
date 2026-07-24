import { TriangleAlert, ShieldAlert, CalendarClock, DollarSign, TrendingDown, CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Penalidade } from "@/lib/mock-data/unidades";

interface PenalidadesPanelProps {
  penalidades: Penalidade[];
  basePct: number;
}

function formatPct(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/**
 * Tab "Penalidades" — exibe penalidades ativas com resumo de impacto
 * na comissão e tabela detalhada.
 */
export function PenalidadesPanel({ penalidades, basePct }: PenalidadesPanelProps) {
  const totalDesconto = penalidades.reduce((acc, p) => acc + p.descontoPct, 0);
  const comissaoEfetiva = Math.max(0, basePct - totalDesconto);

  return (
    <div className="space-y-6">
      {/* Resumo de impacto — stat cards padrão */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={DollarSign} label="Comissão base" color="#6366f1">
          {formatPct(basePct)}%
        </StatCard>
        <StatCard icon={TrendingDown} label="Total descontos" color="#dc2626">
          -{formatPct(totalDesconto)}%
        </StatCard>
        <StatCard icon={CheckCircle2} label="Comissão efetiva" color="#16a34a">
          {formatPct(comissaoEfetiva)}%
        </StatCard>
      </div>

      {/* Tabela de penalidades */}
      <Card className="p-6">
        <SectionHeader
          icon={TriangleAlert}
          title="Detalhamento"
          subtitle={`${penalidades.length} penalidade${penalidades.length !== 1 ? "s" : ""} em vigor`}
        />

        {penalidades.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <ShieldAlert className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhuma penalidade ativa</p>
            <p className="text-sm text-muted-foreground">Esta unidade está em conformidade.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Desconto</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Vigência até
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penalidades.map((p, idx) => (
                <TableRow key={`${p.motivo}-${idx}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                        <TriangleAlert className="h-4 w-4 text-destructive" />
                      </span>
                      <span className="text-sm font-medium text-foreground">{p.motivo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-display font-bold text-destructive">-{formatPct(p.descontoPct)}%</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.vigenciaFim}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Ativa</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

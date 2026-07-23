import { TriangleAlert } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { ComissionamentoInfo } from "@/lib/mock-data/unidades";

function formatPct(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

interface ComissionamentoPanelProps {
  info: ComissionamentoInfo;
}

/** Aba Comissionamento (M3) — PRD-02 §3.3. Reutilizada por PV (PRD-04 §5). */
export function ComissionamentoPanel({ info }: ComissionamentoPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold text-foreground">
          {formatPct(info.basePct)}%
        </span>
        <span className="text-sm text-muted-foreground">comissão base</span>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">
          Cascata por nível hierárquico
        </h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">% Comissão</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {info.cascata.map((item) => (
              <TableRow key={item.nivel}>
                <TableCell className="font-medium text-foreground">{item.nivel}</TableCell>
                <TableCell className="text-right">{formatPct(item.pct)}%</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.qtd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">Penalidades ativas</h4>
        {info.penalidades.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma penalidade ativa.</p>
        ) : (
          <div className="divide-y divide-border">
            {info.penalidades.map((penalidade) => (
              <div
                key={penalidade.motivo}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
                  aria-hidden="true"
                >
                  <TriangleAlert className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{penalidade.motivo}</p>
                  <p className="text-xs text-muted-foreground">
                    Vigência até {penalidade.vigenciaFim}
                  </p>
                </div>
                <span className="font-display text-sm font-bold text-destructive">
                  -{formatPct(penalidade.descontoPct)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

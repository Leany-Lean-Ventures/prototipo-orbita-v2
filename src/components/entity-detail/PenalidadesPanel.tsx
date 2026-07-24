import { useEffect, useState } from "react";
import { TriangleAlert, ShieldAlert, CalendarClock, Eye } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PenalidadeDetalheModal } from "@/components/entity-detail/PenalidadeDetalheModal";
import type { Penalidade } from "@/lib/mock-data/unidades";

interface PenalidadesPanelProps {
  penalidades: Penalidade[];
  /** Id de uma penalidade a abrir automaticamente (vindo do botão "Ver penalidade" do Histórico). */
  abrirPenalidadeId?: string | null;
  /** Chamado depois de consumir `abrirPenalidadeId`, para o pai limpar o estado. */
  onPenalidadeAberta?: () => void;
}

function formatPct(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Tab "Penalidades" — exibe as penalidades ativas em tabela detalhada. */
export function PenalidadesPanel({ penalidades, abrirPenalidadeId, onPenalidadeAberta }: PenalidadesPanelProps) {
  const [selecionada, setSelecionada] = useState<Penalidade | null>(null);

  useEffect(() => {
    if (!abrirPenalidadeId) return;
    const match = penalidades.find((p) => p.id === abrirPenalidadeId);
    if (match) setSelecionada(match);
    onPenalidadeAberta?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abrirPenalidadeId]);

  return (
    <div className="space-y-6">
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penalidades.map((p) => (
                <TableRow key={p.id}>
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Ver detalhes da penalidade: ${p.motivo}`}
                      onClick={() => setSelecionada(p)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <PenalidadeDetalheModal
        penalidade={selecionada}
        onOpenChange={(open) => { if (!open) setSelecionada(null); }}
      />
    </div>
  );
}

import { TriangleAlert, CalendarClock, User, CalendarPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Penalidade } from "@/lib/mock-data/unidades";

interface PenalidadeDetalheModalProps {
  penalidade: Penalidade | null;
  onOpenChange: (open: boolean) => void;
}

function formatPct(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Modal de detalhe de uma penalidade — aberto pelo botão de olho na linha da tabela. */
export function PenalidadeDetalheModal({ penalidade, onOpenChange }: PenalidadeDetalheModalProps) {
  return (
    <Dialog open={!!penalidade} onOpenChange={onOpenChange}>
      {penalidade && (
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <TriangleAlert className="h-4 w-4 text-destructive" />
              </span>
              <DialogTitle className="text-lg">{penalidade.motivo}</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Desconto</p>
                <p className="mt-0.5 font-display text-lg font-bold text-destructive">
                  -{formatPct(penalidade.descontoPct)}%
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Status</p>
                <Badge variant="destructive" className="mt-1">Ativa</Badge>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <CalendarClock className="h-3 w-3" />
                  Vigência até
                </p>
                <p className="mt-0.5 text-sm text-foreground">{penalidade.vigenciaFim}</p>
              </div>
            </div>

            {penalidade.descricao && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Descrição
                </h4>
                <p className="text-sm leading-relaxed text-foreground">{penalidade.descricao}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {penalidade.dataAplicacao && (
                <span className="flex items-center gap-1.5">
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Aplicada em {penalidade.dataAplicacao}
                </span>
              )}
              {penalidade.aplicadoPor && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {penalidade.aplicadoPor}
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

import { useNavigate } from "react-router-dom";
import { Lock, Calendar, User, MapPin, FileText, ExternalLink, CheckCircle2, Clock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { VisitaDetalhe, VisitaStatus } from "@/lib/mock-data/visitas";

interface VisitaDetalheModalProps {
  visita: VisitaDetalhe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_VARIANT: Record<VisitaStatus, "success" | "warning" | "outline"> = {
  Agendada: "warning",
  Realizada: "success",
  Cancelada: "outline",
};

/**
 * Modal de detalhe de uma visita — mostra objetivos, relatório (se realizada),
 * anotação privada e link para ocorrência gerada.
 */
export function VisitaDetalheModal({ visita, open, onOpenChange }: VisitaDetalheModalProps) {
  const navigate = useNavigate();

  const handleGoToUnidade = () => {
    onOpenChange(false);
    if (visita.unidade.id.startsWith("PV-")) navigate(`/pvs/${visita.unidade.id}`);
    else navigate(`/unidades/${visita.unidade.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{visita.tipo}</Badge>
            <Badge variant={STATUS_VARIANT[visita.status]}>{visita.status}</Badge>
          </div>
          <DialogTitle className="text-lg">Visita a {visita.unidade.nome}</DialogTitle>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {visita.data}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {visita.responsavel}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Unidade visitada */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Destino</h4>
            <button
              onClick={handleGoToUnidade}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {visita.unidade.nome} ({visita.unidade.id})
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>

          {/* Objetivos */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Objetivos</h4>
            <p className="text-sm leading-relaxed text-foreground">{visita.objetivos}</p>
          </div>

          {/* Relatório — só se realizada */}
          {visita.relatorio && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Relatório da Visita
                </h4>
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="text-sm leading-relaxed text-foreground">{visita.relatorio}</p>
                </div>
              </div>
            </>
          )}

          {/* Anotação privada */}
          {visita.anotacaoPrivada && (
            <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4 dark:border-amber-700 dark:bg-amber-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  Anotação Privada — Apenas Diretoria
                </span>
              </div>
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                {visita.anotacaoPrivada}
              </p>
            </div>
          )}

          {/* Ocorrência gerada */}
          {visita.ocorrenciaGerada && (
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm text-foreground">
                Ocorrência gerada no histórico:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { onOpenChange(false); navigate("/ocorrencias"); }}
              >
                {visita.ocorrenciaGerada}
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Status agendada — indicação visual */}
          {visita.status === "Agendada" && (
            <div className="flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm text-foreground">
                Visita agendada — aguardando realização.
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

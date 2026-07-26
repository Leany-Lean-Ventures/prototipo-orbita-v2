import { GripVertical, MapPin, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  CANAL_LABEL,
  STATUS_LABEL,
  STATUS_COLOR,
  type RegistroAberturaUnidade,
} from "@/lib/mock-data/esteira-abertura-unidades";

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function KanbanCardContent({
  registro,
  dragging,
}: {
  registro: RegistroAberturaUnidade;
  dragging?: boolean;
}) {
  const destaqueStatus = registro.status !== "ativo";

  return (
    <div
      className={cn(
        "soft-card group relative space-y-3 rounded-2xl border border-white/50 bg-card p-4 shadow-soft transition-[transform,box-shadow] duration-base ease-micro dark:border-white/5",
        !dragging && "hover:-translate-y-0.5 hover:shadow-elevated",
        dragging && "shadow-overlay"
      )}
    >
      <GripVertical className="absolute right-2 top-2 h-4 w-4 text-muted-foreground/40" aria-hidden="true" />

      <div className="flex items-start justify-between gap-2 pr-4">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{registro.licenciadoNome}</p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate">{registro.cidadeAlvo}/{registro.uf}</span>
      </div>

      <p className="truncate text-xs text-muted-foreground">Origem: {registro.lojaOrigem}</p>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {destaqueStatus && (
          <Badge
            variant="outline"
            className="text-[11px]"
            style={{ borderColor: `${STATUS_COLOR[registro.status]}55`, color: STATUS_COLOR[registro.status] }}
          >
            {STATUS_LABEL[registro.status]}
          </Badge>
        )}
        {registro.emAtraso && (
          <Badge variant="outline" className="gap-1 border-destructive/40 text-[11px] text-destructive">
            <AlertTriangle className="h-3 w-3" />
            Atrasado
          </Badge>
        )}
        <Badge variant="outline" className="ml-auto text-[11px] text-muted-foreground">
          {CANAL_LABEL[registro.canalOrigem]}
        </Badge>
      </div>

      {registro.prazoEtapa && (
        <p className="text-[11px] text-muted-foreground">
          Prazo da etapa: <span className="font-medium text-foreground">{formatDateBR(registro.prazoEtapa)}</span>
        </p>
      )}
    </div>
  );
}

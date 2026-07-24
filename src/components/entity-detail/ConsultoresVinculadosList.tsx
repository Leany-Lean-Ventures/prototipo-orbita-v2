import { BriefcaseBusiness } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ConsultorVinculado } from "@/lib/mock-data/unidades";

interface ConsultoresVinculadosListProps {
  consultores: ConsultorVinculado[];
}

/** Aba Consultores Vinculados — sem detalhamento no PRD (Q05); ver MEMORY.md. */
export function ConsultoresVinculadosList({ consultores }: ConsultoresVinculadosListProps) {
  if (consultores.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhum consultor vinculado a esta unidade.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {consultores.map((consultor) => (
        <div key={consultor.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{consultor.razaoSocial}</p>
            <p className="truncate text-xs text-muted-foreground">
              {consultor.matricula} • {consultor.nivel}
            </p>
          </div>
          <Badge variant="outline">{consultor.carteiraQtd} carteiras</Badge>
        </div>
      ))}
    </div>
  );
}

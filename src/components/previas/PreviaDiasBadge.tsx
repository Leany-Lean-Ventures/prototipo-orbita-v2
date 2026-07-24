import { Clock } from "lucide-react";

import { getDiasProcessoCor, formatDiasProcesso } from "@/lib/mock-data/previas";

interface PreviaDiasBadgeProps {
  diasProcesso: number;
  className?: string;
}

/**
 * Chip com os dias corridos do processo — escala de cor graduada (verde a
 * vermelho) proporcional à proximidade do limite de 120 dias, em vez dos
 * 3 variants fixos de `Badge` (que não permitem gradiente contínuo).
 */
export function PreviaDiasBadge({ diasProcesso, className }: PreviaDiasBadgeProps) {
  const cor = getDiasProcessoCor(diasProcesso);
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-semibold ${className ?? ""}`}
      style={{ color: cor.text, backgroundColor: cor.bg, borderColor: cor.text + "33" }}
    >
      <Clock className="h-3 w-3" aria-hidden="true" />
      {formatDiasProcesso(diasProcesso)}
    </span>
  );
}

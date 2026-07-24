import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG, type PreviaStatus } from "@/lib/mock-data/previas";

interface PreviaStatusBadgeProps {
  status: PreviaStatus;
  className?: string;
}

/** Badge de etapa da esteira — cor por status (PRD-05 §3.3), reaproveitada em tabela/tabs/slide-over. */
export function PreviaStatusBadge({ status, className }: PreviaStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge className={`${config.bg} ${config.color} border ${config.border} ${className ?? ""}`}>
      {status}
    </Badge>
  );
}

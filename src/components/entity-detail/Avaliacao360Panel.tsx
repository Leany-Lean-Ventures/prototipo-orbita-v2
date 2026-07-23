import { Progress } from "@/components/ui/progress";
import type { Avaliacao360Info } from "@/lib/mock-data/unidades";

interface Avaliacao360PanelProps {
  info: Avaliacao360Info;
}

/**
 * Aba Avaliação 360º — sem detalhamento no PRD (Q05); ver MEMORY.md.
 * Exclusiva de Unidade (não existe em PV, PRD-04 §3.2).
 */
export function Avaliacao360Panel({ info }: Avaliacao360PanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Score geral
          </p>
          <p className="font-display text-3xl font-bold text-foreground">
            {info.scoreGeral}
            <span className="text-base font-medium text-muted-foreground">/100</span>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Última avaliação: {info.ultimaAvaliacao}
        </p>
      </div>

      <div className="space-y-4">
        {info.criterios.map((criterio) => (
          <div key={criterio.criterio} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{criterio.criterio}</span>
              <span className="text-muted-foreground">{criterio.score}/100</span>
            </div>
            <Progress
              value={criterio.score}
              aria-label={`${criterio.criterio}: ${criterio.score} de 100`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

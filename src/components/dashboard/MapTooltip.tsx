/**
 * Tooltip flutuante do mapa — posicionado em coordenadas relativas ao SVG
 * container. pointer-events-none para não interferir com os eventos do mapa.
 */

export interface TooltipData {
  titulo: string;
  subtitulo: string;
  linhas: { label: string; valor: string }[];
  semCobertura: boolean;
}

interface MapTooltipProps {
  data: TooltipData;
  x: number;
  y: number;
}

export function MapTooltip({ data, x, y }: MapTooltipProps) {
  const offsetX = 12;
  const offsetY = -8;

  return (
    <div
      className="pointer-events-none absolute z-50 max-w-[180px] rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
      style={{ left: x + offsetX, top: y + offsetY }}
      role="tooltip"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-foreground leading-tight">{data.titulo}</p>
      <p className="text-[10px] text-muted-foreground mb-1">{data.subtitulo}</p>

      {data.semCobertura ? (
        <p className="text-[11px] italic text-muted-foreground">Sem cobertura da rede</p>
      ) : (
        <div className="space-y-0.5">
          {data.linhas.map((l) => (
            <div key={l.label} className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">{l.label}</span>
              <span className="text-[11px] font-semibold text-foreground tabular-nums">
                {l.valor}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

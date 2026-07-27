import { Gauge } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { rotuloCurto, type MapSelection } from "@/lib/geo/selection";
import { agregar, REDE_GLOBAL } from "@/lib/mock-data/rede-agregada";

const PARAMETROS = [
  { nome: "Gestão", color: "#dc2626" },
  { nome: "Atendimento", color: "#dc2626" },
  { nome: "Comunicação", color: "#dc2626" },
  { nome: "Financeiro", color: "#dc2626" },
];

interface Avaliacao360RadarCardProps {
  sel: MapSelection;
  className?: string;
}

export function Avaliacao360RadarCard({ sel, className }: Avaliacao360RadarCardProps) {
  const rede = agregar(sel);
  const subtitulo = `Avaliação 360° — ${rotuloCurto(sel)} vs. Brasil`;

  return (
    <Card className={`dashboard-section p-6 flex flex-col ${className ?? ""}`}>
      <SectionHeader
        icon={Gauge}
        title="Avaliação 360°"
        subtitle={subtitulo}
      />
      <div className="flex flex-col justify-between flex-1 mt-2">
        {PARAMETROS.map((p, index) => {
          const valor = rede.avaliacao360[index];
          const valorBrasil = REDE_GLOBAL.avaliacao360[index];
          return (
            <div key={p.nome} className="flex flex-col gap-2">
              {/* Rótulo */}
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>{p.nome}</span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  <span className="text-foreground font-bold">{valor}%</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span>Brasil: {valorBrasil}%</span>
                </span>
              </div>

              {/* Barra de Progresso */}
              <div className="h-3.5 w-full bg-muted/40 rounded-full relative overflow-visible">
                {/* Preenchimento Seleção */}
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${valor}%`, backgroundColor: p.color }}
                />

                {/* Marcador Brasil (Média) */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-foreground/60"
                  style={{ left: `${valorBrasil}%` }}
                  title={`Média Brasil: ${valorBrasil}%`}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}



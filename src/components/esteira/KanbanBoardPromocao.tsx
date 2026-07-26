import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { toast } from "sonner";
import { useState, useRef } from "react";

import { cn } from "@/lib/utils";
import {
  ETAPAS_PROMOCAO,
  NIVEIS_LABEL,
  STATUS_PROMOCAO_COLOR,
  STATUS_PROMOCAO_LABEL,
  type EtapaPromocaoId,
  type RegistroPromocaoConsultor,
} from "@/lib/mock-data/esteira-promocao-consultores";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BriefcaseBusiness, Calendar, AlertTriangle } from "lucide-react";

// --------------- Card Content ---------------

function PromocaoCardContent({ registro, dragging }: { registro: RegistroPromocaoConsultor; dragging?: boolean }) {
  const isAtrasado = registro.emAtraso;
  return (
    <Card
      className={cn(
        "space-y-2 p-4 transition-shadow",
        dragging && "shadow-2xl",
        isAtrasado && "bg-gradient-to-b from-card via-destructive/[0.05] to-destructive/[0.12]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground leading-tight">{registro.consultorNome}</p>
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground opacity-50">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="2" cy="2" r="1.2"/><circle cx="5" cy="2" r="1.2"/><circle cx="8" cy="2" r="1.2"/><circle cx="2" cy="5" r="1.2"/><circle cx="5" cy="5" r="1.2"/><circle cx="8" cy="5" r="1.2"/></svg>
        </div>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <BriefcaseBusiness className="h-3 w-3" />
          <span className="truncate">{registro.razaoSocial}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          <span>Origem: {registro.lojaOrigem}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="text-[10px]">
          {NIVEIS_LABEL[registro.nivelAtual].nome} → {NIVEIS_LABEL[registro.nivelAlvo].nome}
        </Badge>
        {registro.status !== "ativo" && (
          <Badge variant="outline" style={{ borderColor: `${STATUS_PROMOCAO_COLOR[registro.status]}55`, color: STATUS_PROMOCAO_COLOR[registro.status] }} className="text-[10px]">
            {STATUS_PROMOCAO_LABEL[registro.status]}
          </Badge>
        )}
        {isAtrasado && (
          <Badge variant="outline" className="gap-0.5 border-destructive/40 text-[10px] text-destructive">
            <AlertTriangle className="h-2.5 w-2.5" />
            Atrasado
          </Badge>
        )}
      </div>

      {registro.prazoEtapa && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          Prazo da etapa: {registro.prazoEtapa.split("-").reverse().join("/")}
        </div>
      )}
    </Card>
  );
}

// --------------- Draggable / Droppable ---------------

function DraggableCardPromocao({ registro, onClick }: { registro: RegistroPromocaoConsultor; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: registro.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className={cn("cursor-grab touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl", isDragging && "opacity-30")}
    >
      <PromocaoCardContent registro={registro} />
    </div>
  );
}

function KanbanColumnPromocao({ etapaId, registros, onCardClick }: { etapaId: EtapaPromocaoId; registros: RegistroPromocaoConsultor[]; onCardClick: (id: string) => void }) {
  const cfg = ETAPAS_PROMOCAO.find((e) => e.id === etapaId)!;
  const { setNodeRef, isOver } = useDroppable({ id: etapaId });
  return (
    <div className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-muted/20">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{cfg.nome}</p>
          <p className="text-[11px] text-muted-foreground">{cfg.responsavel}{cfg.slaDias != null ? ` · SLA ${cfg.slaDias}d` : ""}</p>
        </div>
        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">{registros.length}</span>
      </div>
      <div ref={setNodeRef} className={cn("flex min-h-[140px] flex-1 flex-col gap-3 rounded-b-2xl p-3 transition-colors duration-micro ease-micro", isOver && "bg-primary/5 ring-2 ring-inset ring-primary/30")}>
        {registros.length === 0 && <p className="flex flex-1 items-center justify-center text-center text-xs text-muted-foreground">Nenhum registro nesta etapa</p>}
        {registros.map((r) => <DraggableCardPromocao key={r.id} registro={r} onClick={() => onCardClick(r.id)} />)}
      </div>
    </div>
  );
}

// --------------- Board ---------------

const measuring = { droppable: { strategy: MeasuringStrategy.Always } };

export function KanbanBoardPromocao({
  registros,
  onRequestTransicao,
  onCardClick,
}: {
  registros: RegistroPromocaoConsultor[];
  onRequestTransicao: (id: string, etapaDestino: EtapaPromocaoId) => void;
  onCardClick: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const novaEtapa = over.id as EtapaPromocaoId;
    const registro = registros.find((r) => r.id === active.id);
    if (!registro || registro.etapaAtual === novaEtapa) return;
    const currentIdx = ETAPAS_PROMOCAO.findIndex((e) => e.id === registro.etapaAtual);
    const targetIdx = ETAPAS_PROMOCAO.findIndex((e) => e.id === novaEtapa);
    if (targetIdx !== currentIdx + 1) {
      toast.error("Só é possível avançar para a próxima etapa.");
      return;
    }
    onRequestTransicao(String(active.id), novaEtapa);
  };

  const registroAtivo = activeId ? registros.find((r) => r.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd} measuring={measuring}>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2">
        {ETAPAS_PROMOCAO.map((etapa) => (
          <KanbanColumnPromocao key={etapa.id} etapaId={etapa.id} registros={registros.filter((r) => r.etapaAtual === etapa.id)} onCardClick={onCardClick} />
        ))}
      </div>
      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {registroAtivo && (
          <div className="w-[274px] rotate-1 cursor-grabbing rounded-2xl shadow-xl ring-2 ring-primary/20">
            <PromocaoCardContent registro={registroAtivo} dragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

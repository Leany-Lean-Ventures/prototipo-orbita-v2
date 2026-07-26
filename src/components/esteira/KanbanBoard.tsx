import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  ETAPAS_ABERTURA,
  type EtapaId,
  type RegistroAberturaUnidade,
} from "@/lib/mock-data/esteira-abertura-unidades";
import { KanbanCardContent } from "./KanbanCardContent";

function DraggableCard({
  registro,
  onClick,
}: {
  registro: RegistroAberturaUnidade;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: registro.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn("cursor-grab touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl", isDragging && "opacity-30")}
    >
      <KanbanCardContent registro={registro} />
    </div>
  );
}

function KanbanColumn({
  etapaId,
  registros,
  onCardClick,
}: {
  etapaId: EtapaId;
  registros: RegistroAberturaUnidade[];
  onCardClick: (id: string) => void;
}) {
  const cfg = ETAPAS_ABERTURA.find((e) => e.id === etapaId)!;
  const { setNodeRef, isOver } = useDroppable({ id: etapaId });

  return (
    <div className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-muted/20">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{cfg.nome}</p>
          <p className="text-[11px] text-muted-foreground">
            {cfg.responsavel}
            {cfg.slaDias != null ? ` · SLA ${cfg.slaDias}d` : ""}
          </p>
        </div>
        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
          {registros.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[140px] flex-1 flex-col gap-3 rounded-b-2xl p-3 transition-colors duration-micro ease-micro",
          isOver && "bg-primary/5 ring-2 ring-inset ring-primary/30"
        )}
      >
        {registros.length === 0 && (
          <p className="flex flex-1 items-center justify-center text-center text-xs text-muted-foreground">
            Nenhum registro nesta etapa
          </p>
        )}
        {registros.map((r) => (
          <DraggableCard key={r.id} registro={r} onClick={() => onCardClick(r.id)} />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({
  registros,
  onMoverRegistro,
  onCardClick,
}: {
  registros: RegistroAberturaUnidade[];
  onMoverRegistro: (id: string, novaEtapa: EtapaId) => void;
  onCardClick: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const novaEtapa = over.id as EtapaId;
    const registro = registros.find((r) => r.id === active.id);
    if (registro && registro.etapaAtual !== novaEtapa) {
      onMoverRegistro(String(active.id), novaEtapa);
    }
  };

  const registroAtivo = activeId ? registros.find((r) => r.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {ETAPAS_ABERTURA.map((etapa) => (
          <KanbanColumn
            key={etapa.id}
            etapaId={etapa.id}
            registros={registros.filter((r) => r.etapaAtual === etapa.id)}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {registroAtivo && (
          <div className="w-[276px] rotate-2">
            <KanbanCardContent registro={registroAtivo} dragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

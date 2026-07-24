import { useNavigate } from "react-router-dom";
import { Waypoints, Store, Building2, Users, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  VINCULO_TIPO_LABEL,
  type VinculoNode,
  type VinculoNodeType,
} from "@/lib/mock-data/vinculos";

const TIPO_ICON: Record<VinculoNodeType, typeof Store> = {
  macro: Waypoints,
  unidade: Store,
  pv: Building2,
  consultor: Users,
};

const RATING_VARIANT: Record<string, BadgeProps["variant"]> = {
  A: "success",
  B: "warning",
  C: "destructive",
};

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  Ativo: "success",
  Inativo: "outline",
  Suspenso: "warning",
};

interface VinculosGraphPanelProps {
  node: VinculoNode | null;
  connections: VinculoNode[];
  onSelect: (id: string) => void;
}

export function VinculosGraphPanel({ node, connections, onSelect }: VinculosGraphPanelProps) {
  const navigate = useNavigate();

  if (!node) {
    return (
      <Card className="absolute right-4 top-4 w-[min(320px,calc(100%-2rem))] p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Waypoints className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-foreground">Nenhum item selecionado</p>
          <p className="text-sm text-muted-foreground">
            Clique em um nó do grafo — macrorregião, unidade, PV ou consultor — para ver os
            detalhes dele aqui.
          </p>
        </div>
      </Card>
    );
  }

  const Icon = TIPO_ICON[node.tipo];

  const cta = (() => {
    if (node.tipo === "unidade" && node.unidadeId) {
      return {
        label: "Abrir perfil completo",
        onClick: () => navigate(`/unidades/${node.unidadeId}`),
      };
    }
    if (node.tipo === "pv" && node.unidadeId) {
      return {
        label: "Abrir perfil do PV",
        onClick: () => navigate(`/pvs?unidade=${node.unidadeId}`),
      };
    }
    if (node.tipo === "consultor" && node.unidadeId) {
      return {
        label: "Abrir perfil do consultor",
        onClick: () => navigate(`/consultores?unidade=${node.unidadeId}`),
      };
    }
    return null;
  })();

  return (
    <Card className="absolute right-4 top-4 w-[min(320px,calc(100%-2rem))] p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {VINCULO_TIPO_LABEL[node.tipo]}
          </p>
          <p className="truncate text-base font-semibold text-foreground">{node.label}</p>
          <p className="truncate text-xs text-muted-foreground">{node.sublabel}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {node.tipo === "macro" && (
          <>
            <Fact label="Unidades" value={String(node.meta.unidades)} />
            <Fact label="Rating médio" value={String(node.meta.ratingMedio)} />
          </>
        )}
        {node.tipo === "unidade" && (
          <>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Rating</span>
              <Badge variant={RATING_VARIANT[String(node.meta.rating)]}>
                {node.meta.rating} · {node.meta.ratingScore}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={STATUS_VARIANT[String(node.meta.status)]}>{node.meta.status}</Badge>
            </div>
            <Fact label="Dono (LL)" value={String(node.meta.dono)} />
          </>
        )}
        {node.tipo === "pv" && (
          <>
            <Fact label="Responsável" value={String(node.meta.responsavel)} />
            <Fact label="Nível" value={String(node.meta.nivel)} />
            <Fact label="Unidade" value={String(node.meta.unidade)} />
          </>
        )}
        {node.tipo === "consultor" && (
          <>
            <Fact label="Matrícula" value={String(node.meta.matricula)} />
            <Fact label="Nível" value={String(node.meta.nivel)} />
            <Fact label="Carteiras" value={String(node.meta.carteiras)} />
            <Fact label="Unidade" value={String(node.meta.unidade)} />
          </>
        )}
      </div>

      {cta && (
        <Button size="sm" className="mt-4 w-full justify-center" onClick={cta.onClick}>
          {cta.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      )}

      {connections.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Conexões
          </p>
          <div className="divide-y divide-border">
            {connections.map((connection) => {
              const ConnIcon = TIPO_ICON[connection.tipo];
              return (
                <button
                  key={connection.id}
                  type="button"
                  onClick={() => onSelect(connection.id)}
                  className="flex w-full items-center gap-2 py-2 text-left text-sm transition-colors duration-micro ease-micro hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <ConnIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{connection.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

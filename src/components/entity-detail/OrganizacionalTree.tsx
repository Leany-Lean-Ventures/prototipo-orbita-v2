import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronDown, BriefcaseBusiness, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrganizacionalNode, OrganizacionalTipo } from "@/lib/mock-data/unidades";
import ademIconVermelho from "@/assets/brand/ademicon-icone-vermelho.svg";
import ademIconCinza from "@/assets/brand/ademicon-icone-cinza.svg";

// Visual config per entity type
const TIPO_CONFIG: Record<OrganizacionalTipo, {
  bgColor: string;
  borderColor: string;
  label: string;
  icon?: string; // SVG import path
}> = {
  loja: {
    bgColor: "bg-primary/10",
    borderColor: "border-l-primary",
    label: "Loja",
    icon: ademIconVermelho,
  },
  socio: {
    bgColor: "bg-amber-500/10",
    borderColor: "border-l-amber-500",
    label: "Sócio",
  },
  pv: {
    bgColor: "bg-muted",
    borderColor: "border-l-muted-foreground",
    label: "Ponto de Venda",
    icon: ademIconCinza,
  },
  consultor: {
    bgColor: "bg-secondary/10",
    borderColor: "border-l-secondary",
    label: "Consultor",
  },
};

interface OrganizacionalTreeProps {
  nodes: OrganizacionalNode[];
  /** Oculta as informações de participação e comissão dos sócios (ex.: página de PVs). */
  hideParticipacaoComissao?: boolean;
}

/**
 * Hierarchical tree with expand/collapse, Ademicon icon for Loja/PV,
 * avatar photos for consultores, connector lines, and eye button navigation.
 */
export function OrganizacionalTree({ nodes, hideParticipacaoComissao }: OrganizacionalTreeProps) {
  if (nodes.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma estrutura subordinada registrada.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {nodes.map((node, index) => (
        <TreeNode
          key={node.id}
          node={node}
          isLast={index === nodes.length - 1}
          depth={0}
          hideParticipacaoComissao={hideParticipacaoComissao}
        />
      ))}
    </div>
  );
}

/** Legend component to be placed inside SectionHeader actions slot */
export function OrganizacionalLegend() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
          <img src={ademIconVermelho} alt="" className="h-3.5 w-3.5" />
        </div>
        <span className="text-[11px] text-muted-foreground">Loja</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
          <UserRound className="h-3 w-3 text-amber-600" />
        </div>
        <span className="text-[11px] text-muted-foreground">Sócio</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-muted">
          <img src={ademIconCinza} alt="" className="h-3.5 w-3.5" />
        </div>
        <span className="text-[11px] text-muted-foreground">PV</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-full bg-secondary/10 border border-secondary/20" />
        <span className="text-[11px] text-muted-foreground">Consultor</span>
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: OrganizacionalNode;
  isLast: boolean;
  depth: number;
  hideParticipacaoComissao?: boolean;
}

function TreeNode({ node, isLast, depth, hideParticipacaoComissao }: TreeNodeProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const config = TIPO_CONFIG[node.tipo];

  const handleView = () => {
    if (node.tipo === "pv") navigate(`/pvs/${node.id}`);
    else if (node.tipo === "consultor") navigate(`/consultores/${node.id}`);
    else if (node.tipo === "socio") navigate(`/socios/${node.id}`);
  };

  return (
    <div className="relative">
      {/* Vertical connector line from parent */}
      {depth > 0 && (
        <div
          className={cn("absolute w-px bg-border")}
          style={{
            left: `${(depth - 1) * 44 + 20}px`,
            top: 0,
            height: isLast ? "28px" : "100%",
          }}
          aria-hidden="true"
        />
      )}

      {/* Horizontal connector line */}
      {depth > 0 && (
        <div
          className="absolute h-px bg-border"
          style={{ left: `${(depth - 1) * 44 + 20}px`, top: "28px", width: "24px" }}
          aria-hidden="true"
        />
      )}

      {/* Node row */}
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-xl py-2.5 px-3 transition-all duration-150",
          "hover:bg-muted/30"
        )}
        style={{ marginLeft: `${depth * 44}px` }}
      >
        {/* Colored left border accent on hover */}
        <div className={cn("absolute left-0 top-2 bottom-2 w-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100", config.borderColor)} />

        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={expanded ? "Colapsar" : "Expandir"}
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                !expanded && "-rotate-90"
              )}
            />
          </button>
        ) : (
          <div className="w-5 shrink-0" />
        )}

        {/* Icon or Avatar */}
        {node.tipo === "socio" ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-500/20 bg-amber-500/10">
            <UserRound className="h-5 w-5 text-amber-600" />
          </div>
        ) : node.tipo === "consultor" ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
            <BriefcaseBusiness className="h-5 w-5 text-secondary" />
          </div>
        ) : (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", config.bgColor)}>
            <img
              src={config.icon}
              alt=""
              className="h-6 w-6"
            />
          </div>
        )}

        {/* Name + details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{node.nome}</p>
          <div className="flex items-center gap-2">
            <p className="truncate text-xs text-muted-foreground">{node.responsavel}</p>
            {node.documento && (
              <span className="hidden text-[10px] text-muted-foreground/60 sm:inline">
                CNPJ: {node.documento}
              </span>
            )}
            {node.matricula && (
              <span className="hidden text-[10px] text-muted-foreground/60 sm:inline">
                Mat: {node.matricula}
              </span>
            )}
          </div>
        </div>

        {/* Participação + Comissão — sócios only */}
        {!hideParticipacaoComissao && node.tipo === "socio" && (node.participacaoPct != null || node.comissaoPct != null) && (
          <div className="hidden items-center gap-3 sm:flex">
            {node.participacaoPct != null && (
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{node.participacaoPct}%</span> particip.
              </span>
            )}
            {node.comissaoPct != null && (
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{node.comissaoPct.toFixed(1)}%</span> comissão
              </span>
            )}
          </div>
        )}

        {/* Badge */}
        <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
          {node.nivelLabel}
        </Badge>

        {/* Eye button — navega para PV, Consultor ou Sócio. Loja não tem página própria na árvore. */}
        {node.tipo !== "loja" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={handleView}
            aria-label={`Ver detalhes de ${node.nome}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Children with collapse animation */}
      {hasChildren && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {node.children!.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              isLast={index === node.children!.length - 1}
              depth={depth + 1}
              hideParticipacaoComissao={hideParticipacaoComissao}
            />
          ))}
        </div>
      )}
    </div>
  );
}

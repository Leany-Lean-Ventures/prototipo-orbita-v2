import { useState } from "react";
import { Network, Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { OrganizacionalTree } from "./OrganizacionalTree";
import type { OrganizacionalNode } from "@/lib/mock-data/unidades";

interface EstruturaConsolidadaPanelProps {
  organizacional: OrganizacionalNode[];
}

/**
 * Aba "Estrutura Organizacional" — árvore hierárquica com busca.
 */
export function EstruturaConsolidadaPanel({
  organizacional,
}: EstruturaConsolidadaPanelProps) {
  const [busca, setBusca] = useState("");

  // Filter tree nodes by search term
  const filterNodes = (nodes: OrganizacionalNode[], termo: string): OrganizacionalNode[] => {
    if (!termo) return nodes;
    return nodes.reduce<OrganizacionalNode[]>((acc, node) => {
      const matches = node.nome.toLowerCase().includes(termo) || (node.documento?.toLowerCase().includes(termo) ?? false) || (node.matricula?.toLowerCase().includes(termo) ?? false);
      const filteredChildren = node.children ? filterNodes(node.children, termo) : [];
      if (matches || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren.length > 0 ? filteredChildren : node.children });
      }
      return acc;
    }, []);
  };

  const termo = busca.trim().toLowerCase();
  const filteredNodes = filterNodes(organizacional, termo);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionHeader
          icon={Network}
          title="Estrutura organizacional"
          subtitle="Árvore de PVs e consultores subordinados"
          actions={
            <div className="relative w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar nome, CNPJ ou matrícula…"
                className="h-8 pl-9 text-xs"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar na estrutura"
              />
            </div>
          }
        />
        <OrganizacionalTree nodes={filteredNodes} />
      </Card>
    </div>
  );

}

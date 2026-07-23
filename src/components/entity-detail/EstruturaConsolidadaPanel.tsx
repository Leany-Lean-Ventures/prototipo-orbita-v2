import { Network } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { OrganizacionalTree, OrganizacionalLegend } from "./OrganizacionalTree";
import type { OrganizacionalNode } from "@/lib/mock-data/unidades";

interface EstruturaConsolidadaPanelProps {
  organizacional: OrganizacionalNode[];
}

/**
 * Aba "Estrutura Organizacional" — árvore hierárquica com dados de participação
 * societária e comissão consolidados nos nós de sócios.
 */
export function EstruturaConsolidadaPanel({
  organizacional,
}: EstruturaConsolidadaPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionHeader
          icon={Network}
          title="Hierarquia organizacional"
          subtitle="Árvore de PVs e consultores subordinados à unidade"
          actions={<OrganizacionalLegend />}
        />
        <OrganizacionalTree nodes={organizacional} />
      </Card>
    </div>
  );
}

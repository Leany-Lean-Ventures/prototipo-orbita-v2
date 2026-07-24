import { useParams, Navigate } from "react-router-dom";
import {
  Network,
  DollarSign,
  Users,
  Briefcase,
  Clock,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { pvsDetalhe } from "@/lib/mock-data/pvs";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityHeroHeader } from "@/components/entity-detail/EntityHeroHeader";
import { EstruturaConsolidadaPanel } from "@/components/entity-detail/EstruturaConsolidadaPanel";
import { FinanceiroPanel } from "@/components/entity-detail/FinanceiroPanel";
import { CarteirasTable } from "@/components/entity-detail/CarteirasTable";
import { Timeline } from "@/components/entity-detail/Timeline";
import { PVConsultoresPanel } from "@/components/entity-detail/PVConsultoresPanel";
import ademIconCinza from "@/assets/brand/thumbnail-pv.svg";
import headerPvBg from "@/assets/header-pv-background.jpg";

const PVDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const pv = id ? pvsDetalhe[id] : undefined;

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".pv-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".pv-tabs", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
  ]);

  if (!pv) {
    return <Navigate to="/pvs" replace />;
  }

  return (
    <div ref={entranceRef} className="space-y-6">
      <EntityHeroHeader
        className="pv-header"
        backgroundImage={headerPvBg}
        avatarUrl={ademIconCinza}
        avatarFallback={pv.nome.slice(0, 2)}
        verified={false}
        tag={pv.nivel}
        location={`Vinculado a ${pv.unidadeMae.nome}`}
        name={pv.nome}
        subtitle={`Gestor: ${pv.gestor}`}
        dadosContato={pv.dadosContato}
      />

      <Tabs defaultValue="estrutura" className="pv-tabs">
        <TabsList variant="secondary">
          <TabsTrigger value="estrutura">
            <Network className="h-4 w-4" />
            Estrutura Organizacional
          </TabsTrigger>
          <TabsTrigger value="financeiro">
            <DollarSign className="h-4 w-4" />
            Dados Financeiros
          </TabsTrigger>
          <TabsTrigger value="consultores">
            <Users className="h-4 w-4" />
            Consultores
          </TabsTrigger>
          <TabsTrigger value="carteiras">
            <Briefcase className="h-4 w-4" />
            Carteiras
          </TabsTrigger>
          <TabsTrigger value="historico">
            <Clock className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="estrutura">
          <EstruturaConsolidadaPanel organizacional={pv.organizacional} />
        </TabsContent>

        <TabsContent value="financeiro">
          <FinanceiroPanel info={pv.financeiro} />
        </TabsContent>

        <TabsContent value="consultores">
          <PVConsultoresPanel consultores={pv.consultoresVinculados} />
        </TabsContent>

        <TabsContent value="carteiras">
          <Card className="p-6">
            <SectionHeader
              icon={Briefcase}
              title="Carteiras"
              subtitle="Gestão de carteiras vinculadas ao PV com filtro de órfãs"
            />
            <CarteirasTable carteiras={pv.carteiras} />
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card className="p-6">
            <Timeline
              items={pv.historico}
              title="Histórico"
              subtitle="Linha do tempo de eventos do PV"
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PVDetalhe;

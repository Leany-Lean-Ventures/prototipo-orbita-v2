import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  Network,
  Users,
  Briefcase,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { pvsDetalhe } from "@/lib/mock-data/pvs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EntityHeroHeader } from "@/components/entity-detail/EntityHeroHeader";
import { EstruturaConsolidadaPanel } from "@/components/entity-detail/EstruturaConsolidadaPanel";
import { CarteirasTable } from "@/components/entity-detail/CarteirasTable";
import { Timeline } from "@/components/entity-detail/Timeline";
import { PVConsultoresPanel } from "@/components/entity-detail/PVConsultoresPanel";
import { NovaOcorrenciaModal } from "@/components/ocorrencias/NovaOcorrenciaModal";
import ademIconCinza from "@/assets/brand/thumbnail-pv.svg";
import headerPvBg from "@/assets/header-pv-background.jpg";

const PVDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const pv = id ? pvsDetalhe[id] : undefined;
  const [ocorrenciaModalOpen, setOcorrenciaModalOpen] = useState(false);

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
        indicator={
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            onClick={() => setOcorrenciaModalOpen(true)}
          >
            <AlertTriangle className="mr-1.5 h-4 w-4" />
            Registrar Ocorrência
          </Button>
        }
      />

      <Tabs defaultValue="estrutura" className="pv-tabs">
        <TabsList variant="secondary">
          <TabsTrigger value="estrutura">
            <Network className="h-4 w-4" />
            Estrutura Organizacional
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

        <TabsContent value="carteiras">
          <Card className="p-6">
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

      <NovaOcorrenciaModal
        open={ocorrenciaModalOpen}
        onOpenChange={setOcorrenciaModalOpen}
        entidadeFixa={`PV ${pv.nome}`}
      />
    </div>
  );
};

export default PVDetalhe;

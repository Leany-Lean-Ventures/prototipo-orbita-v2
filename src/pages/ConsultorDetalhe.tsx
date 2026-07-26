import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  User,
  Link2,
  Briefcase,
  BriefcaseBusiness,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { consultoresDetalhe } from "@/lib/mock-data/consultores";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EntityHeroHeader } from "@/components/entity-detail/EntityHeroHeader";
import { Button } from "@/components/ui/button";
import { DadosBasicosConsultorPanel } from "@/components/entity-detail/DadosBasicosConsultorPanel";
import { VinculosPanel } from "@/components/entity-detail/VinculosPanel";
import { CarteirasTable } from "@/components/entity-detail/CarteirasTable";
import { Timeline } from "@/components/entity-detail/Timeline";
import { NovaOcorrenciaModal } from "@/components/ocorrencias/NovaOcorrenciaModal";
import headerBg from "@/assets/header-consultores-background.jpg";

const ConsultorDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const consultor = id ? consultoresDetalhe[id] : undefined;
  const [ocorrenciaModalOpen, setOcorrenciaModalOpen] = useState(false);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".consultor-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".consultor-tabs", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
  ]);

  if (!consultor) {
    return <Navigate to="/consultores" replace />;
  }

  return (
    <div ref={entranceRef} className="space-y-6">
      <EntityHeroHeader
        className="consultor-header"
        backgroundImage={headerBg}
        avatarFallback={<BriefcaseBusiness className="h-8 w-8 text-white/80" aria-hidden="true" />}
        verified={false}
        tag={consultor.nivel}
        location={`Loja: ${consultor.lojaPrincipal.nome}`}
        name={consultor.razaoSocial}
        subtitle={`Matrícula: ${consultor.matricula} • CNPJ: ${consultor.cnpj} • Comissão: ${consultor.comissionamento.pctAtual.toFixed(1)}%`}
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

      <Tabs defaultValue="dados-basicos" className="consultor-tabs">
        <TabsList variant="secondary">
          <TabsTrigger value="dados-basicos">
            <User className="h-4 w-4" />
            Dados Básicos
          </TabsTrigger>
          <TabsTrigger value="vinculos">
            <Link2 className="h-4 w-4" />
            Vínculos
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

        <TabsContent value="dados-basicos">
          <DadosBasicosConsultorPanel
            dados={consultor.dadosBasicos}
            indicador={consultor.indicador}
            ingresso={consultor.ingresso}
            cnpj={consultor.cnpj}
            matricula={consultor.matricula}
            razaoSocial={consultor.razaoSocial}
            nivel={consultor.nivel}
            status={consultor.status}
          />
        </TabsContent>

        <TabsContent value="vinculos">
          <VinculosPanel vinculos={consultor.vinculos} />
        </TabsContent>

        <TabsContent value="carteiras">
          <Card className="p-6">
            <CarteirasTable
              carteiras={consultor.carteiras}
              subtitle="Carteiras geridas por este consultor"
            />
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card className="p-6">
            <Timeline
              items={consultor.historico}
              title="Histórico"
              subtitle="Linha do tempo da carreira e eventos"
            />
          </Card>
        </TabsContent>
      </Tabs>

      <NovaOcorrenciaModal
        open={ocorrenciaModalOpen}
        onOpenChange={setOcorrenciaModalOpen}
        entidadeFixa={`Consultor ${consultor.razaoSocial}`}
      />
    </div>
  );
};

export default ConsultorDetalhe;

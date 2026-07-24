import { useParams, Navigate } from "react-router-dom";
import {
  User,
  Link2,
  TrendingUp,
  Briefcase,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { consultoresDetalhe } from "@/lib/mock-data/consultores";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityHeroHeader } from "@/components/entity-detail/EntityHeroHeader";
import { Button } from "@/components/ui/button";
import { DadosBasicosConsultorPanel } from "@/components/entity-detail/DadosBasicosConsultorPanel";
import { VinculosPanel } from "@/components/entity-detail/VinculosPanel";
import { VisaoEconomicaPanel } from "@/components/entity-detail/VisaoEconomicaPanel";
import { CarteirasTable } from "@/components/entity-detail/CarteirasTable";
import { Timeline } from "@/components/entity-detail/Timeline";
import headerBg from "@/assets/header-consultores-background.jpg";

const ConsultorDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const consultor = id ? consultoresDetalhe[id] : undefined;

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".consultor-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".consultor-tabs", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
  ]);

  if (!consultor) {
    return <Navigate to="/consultores" replace />;
  }

  const initials = consultor.nome
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div ref={entranceRef} className="space-y-6">
      <EntityHeroHeader
        className="consultor-header"
        backgroundImage={headerBg}
        avatarFallback={initials}
        verified={false}
        tag={consultor.nivel}
        location={`Loja: ${consultor.lojaPrincipal.nome}`}
        name={consultor.nome}
        subtitle={`Matrícula: ${consultor.matricula} • CNPJ: ${consultor.cpf} • Comissão: ${consultor.comissionamento.pctAtual.toFixed(1)}%`}
      />

      {/* Ações rápidas */}
      <div className="flex items-center gap-3">
        <Button size="sm">
          <AlertTriangle className="mr-1.5 h-4 w-4" />
          Registrar Ocorrência
        </Button>
      </div>

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
          <TabsTrigger value="visao-economica">
            <TrendingUp className="h-4 w-4" />
            Visão Econômica
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
            cpf={consultor.cpf}
            matricula={consultor.matricula}
            nome={consultor.nome}
            avatarUrl={consultor.avatarUrl}
          />
        </TabsContent>

        <TabsContent value="vinculos">
          <VinculosPanel vinculos={consultor.vinculos} />
        </TabsContent>

        <TabsContent value="visao-economica">
          <VisaoEconomicaPanel info={consultor.visaoEconomica} />
        </TabsContent>

        <TabsContent value="carteiras">
          <Card className="p-6">
            <SectionHeader
              icon={Briefcase}
              title="Carteiras"
              subtitle="Carteiras geridas por este consultor"
            />
            <CarteirasTable carteiras={consultor.carteiras} />
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
    </div>
  );
};

export default ConsultorDetalhe;

import { useParams, useNavigate, Navigate } from "react-router-dom";
import { MapPin, User, UserCog, Calendar, Hash, TriangleAlert, MapPinned } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { unidadesDetalhe, type UnidadeStatus, type Rating } from "@/lib/mock-data/unidades";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type BadgeProps } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EntityDetailHeader, type EntityFact } from "@/components/entity-detail/EntityDetailHeader";
import { RatingDonut } from "@/components/entity-detail/RatingDonut";
import { OrganizacionalTree } from "@/components/entity-detail/OrganizacionalTree";
import { FinanceiroPanel } from "@/components/entity-detail/FinanceiroPanel";
import { ConsultoresVinculadosList } from "@/components/entity-detail/ConsultoresVinculadosList";
import { CarteirasTable } from "@/components/entity-detail/CarteirasTable";
import { ComissionamentoPanel } from "@/components/entity-detail/ComissionamentoPanel";
import { Avaliacao360Panel } from "@/components/entity-detail/Avaliacao360Panel";
import { SocietariaTable } from "@/components/entity-detail/SocietariaTable";
import { Timeline } from "@/components/entity-detail/Timeline";

const STATUS_VARIANT: Record<UnidadeStatus, BadgeProps["variant"]> = {
  Ativo: "success",
  Inativo: "outline",
  Suspenso: "warning",
};

const UnidadeDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const unidade = id ? unidadesDetalhe[id] : undefined;

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".unidade-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    {
      selector: ".unidade-tabs",
      vars: { y: 16, opacity: 0, duration: 0.3 },
      position: "-=0.2",
    },
  ]);

  if (!unidade) {
    return <Navigate to="/unidades" replace />;
  }

  const facts: EntityFact[] = [
    { icon: MapPin, label: "Localização", value: `${unidade.cidade}/${unidade.estado}` },
    { icon: User, label: "Dono (LL)", value: unidade.dono },
    { icon: UserCog, label: "Gerente da BU", value: unidade.gerente },
    { icon: Calendar, label: "Data de abertura", value: unidade.abertura },
    { icon: Hash, label: "Código da unidade", value: unidade.id },
  ];

  return (
    <div ref={entranceRef} className="space-y-6">
      <EntityDetailHeader
        className="unidade-header"
        nome={unidade.nome}
        statusLabel={unidade.status}
        statusVariant={STATUS_VARIANT[unidade.status]}
        facts={facts}
        actions={
          <>
            <Button onClick={() => navigate(`/ocorrencias?unidade=${unidade.id}`)}>
              <TriangleAlert className="h-4 w-4" aria-hidden="true" />
              Registrar Ocorrência
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/visitas?unidade=${unidade.id}`)}
            >
              <MapPinned className="h-4 w-4" aria-hidden="true" />
              Registrar Visita
            </Button>
          </>
        }
        indicator={<RatingDonut rating={unidade.rating} score={unidade.ratingScore} />}
      />

      <Tabs defaultValue="organizacional" className="unidade-tabs">
        <TabsList>
          <TabsTrigger value="organizacional">Estrutura Organizacional</TabsTrigger>
          <TabsTrigger value="financeiro">Dados Financeiros</TabsTrigger>
          <TabsTrigger value="consultores">Consultores Vinculados</TabsTrigger>
          <TabsTrigger value="carteiras">Carteiras Associadas</TabsTrigger>
          <TabsTrigger value="comissionamento">Comissionamento (M3)</TabsTrigger>
          <TabsTrigger value="avaliacao360">Avaliação 360º</TabsTrigger>
          <TabsTrigger value="societaria">Estrutura Societária</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="organizacional">
          <Card className="p-6">
            <OrganizacionalTree nodes={unidade.organizacional} />
          </Card>
        </TabsContent>

        <TabsContent value="financeiro">
          <FinanceiroPanel info={unidade.financeiro} />
        </TabsContent>

        <TabsContent value="consultores">
          <Card className="p-6">
            <ConsultoresVinculadosList consultores={unidade.consultoresVinculados} />
          </Card>
        </TabsContent>

        <TabsContent value="carteiras">
          <Card className="p-6">
            <CarteirasTable carteiras={unidade.carteiras} />
          </Card>
        </TabsContent>

        <TabsContent value="comissionamento">
          <Card className="p-6">
            <ComissionamentoPanel info={unidade.comissionamento} />
          </Card>
        </TabsContent>

        <TabsContent value="avaliacao360">
          <Card className="p-6">
            <Avaliacao360Panel info={unidade.avaliacao360} />
          </Card>
        </TabsContent>

        <TabsContent value="societaria">
          <Card className="p-6">
            <SocietariaTable items={unidade.societaria} />
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card className="p-6">
            <Timeline items={unidade.historico} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnidadeDetalhe;

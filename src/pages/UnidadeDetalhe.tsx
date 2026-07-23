import { useParams, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Network,
  Users,
  Briefcase,
  Clock,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { unidadesDetalhe } from "@/lib/mock-data/unidades";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityHeroHeader } from "@/components/entity-detail/EntityHeroHeader";
import { RatingDonut } from "@/components/entity-detail/RatingDonut";
import { DadosBasicosPanel } from "@/components/entity-detail/DadosBasicosPanel";
import { FinanceiroPanel } from "@/components/entity-detail/FinanceiroPanel";
import { EstruturaConsolidadaPanel } from "@/components/entity-detail/EstruturaConsolidadaPanel";
import { CorpoVendasPanel } from "@/components/entity-detail/CorpoVendasPanel";
import { CarteirasTable } from "@/components/entity-detail/CarteirasTable";
import { Timeline } from "@/components/entity-detail/Timeline";

const UnidadeDetalhe = () => {
  const { id } = useParams<{ id: string }>();
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

  return (
    <div ref={entranceRef} className="space-y-6">
      <EntityHeroHeader
        className="unidade-header"
        backgroundImage={unidade.heroImage}
        avatarUrl={unidade.gestorAvatar}
        avatarFallback={unidade.dono
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
        tag="Unidade Master"
        location={`${unidade.cidade}, ${unidade.estado}`}
        name={unidade.nome}
        subtitle={`Gestor Responsável: ${unidade.gerente}`}
        dadosContato={unidade.dadosContato}
        indicator={<RatingDonut rating={unidade.rating} score={unidade.ratingScore} onDark />}
      />

      <Tabs defaultValue="dados-basicos" className="unidade-tabs">
        <TabsList variant="secondary">
          <TabsTrigger value="dados-basicos">
            <LayoutDashboard className="h-4 w-4" />
            Dados Básicos
          </TabsTrigger>
          <TabsTrigger value="financeiro">
            <DollarSign className="h-4 w-4" />
            Dados Financeiros
          </TabsTrigger>
          <TabsTrigger value="estrutura">
            <Network className="h-4 w-4" />
            Estrutura Organizacional
          </TabsTrigger>
          <TabsTrigger value="corpo-vendas">
            <Users className="h-4 w-4" />
            Corpo de Venda
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
          <DadosBasicosPanel
            organizacional={unidade.organizacional}
            consultoresVinculados={unidade.consultoresVinculados}
            carteiras={unidade.carteiras}
            avaliacao360={unidade.avaliacao360}
            rating={unidade.rating}
            ratingScore={unidade.ratingScore}
          />
        </TabsContent>

        <TabsContent value="financeiro">
          <FinanceiroPanel info={unidade.financeiro} />
        </TabsContent>

        <TabsContent value="estrutura">
          <EstruturaConsolidadaPanel
            organizacional={unidade.organizacional}
          />
        </TabsContent>

        <TabsContent value="corpo-vendas">
          <CorpoVendasPanel
            consultoresVinculados={unidade.consultoresVinculados}
            organizacional={unidade.organizacional}
          />
        </TabsContent>

        <TabsContent value="carteiras">
          <Card className="p-6">
            <SectionHeader
              icon={Briefcase}
              title="Carteiras"
              subtitle="Gestão de carteiras vinculadas à unidade com filtro de órfãs"
            />
            <CarteirasTable carteiras={unidade.carteiras} />
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card className="p-6">
            <SectionHeader
              icon={Clock}
              title="Histórico"
              subtitle="Linha do tempo de ocorrências e eventos de negócio"
            />
            <Timeline items={unidade.historico} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnidadeDetalhe;

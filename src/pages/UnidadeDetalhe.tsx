import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Network,
  UsersRound,
  Briefcase,
  ShieldAlert,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { unidadesDetalhe } from "@/lib/mock-data/unidades";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EntityHeroHeader } from "@/components/entity-detail/EntityHeroHeader";
import { DadosBasicosPanel } from "@/components/entity-detail/DadosBasicosPanel";
import { FinanceiroPanel } from "@/components/entity-detail/FinanceiroPanel";
import { EstruturaConsolidadaPanel } from "@/components/entity-detail/EstruturaConsolidadaPanel";
import { CarteirasTable } from "@/components/entity-detail/CarteirasTable";
import { PenalidadesPanel } from "@/components/entity-detail/PenalidadesPanel";
import { Timeline } from "@/components/entity-detail/Timeline";
import { NovaOcorrenciaModal } from "@/components/ocorrencias/NovaOcorrenciaModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UnidadeDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const unidade = id ? unidadesDetalhe[id] : undefined;
  const [ocorrenciaModalOpen, setOcorrenciaModalOpen] = useState(false);
  const [sociosModalOpen, setSociosModalOpen] = useState(false);

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
        verified={false}
        tag="Unidade"
        location={`Matrícula: ${unidade.matricula}`}
        name={unidade.nome}
        subtitle={`Gestor Responsável: ${unidade.gerente}`}
        subtitleExtra={
          <button
            onClick={() => setSociosModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[12px] text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <UsersRound className="h-3 w-3" />
            Sócios ({(unidade.socios ?? []).length})
          </button>
        }
        dadosContato={{
          ...unidade.dadosContato,
          endereco: `${unidade.dadosContato.endereco}, ${unidade.dadosContato.bairro} — ${unidade.cidade}/${unidade.estado}`,
        }}
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
          <TabsTrigger value="carteiras">
            <Briefcase className="h-4 w-4" />
            Carteiras
          </TabsTrigger>
          <TabsTrigger value="penalidades">
            <ShieldAlert className="h-4 w-4" />
            Penalidades
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

        <TabsContent value="carteiras">
          <Card className="p-6">
            <CarteirasTable
              carteiras={unidade.carteiras}
              subtitle="Gestão de carteiras vinculadas à unidade"
            />
          </Card>
        </TabsContent>

        <TabsContent value="penalidades">
          <PenalidadesPanel
            penalidades={unidade.comissionamento.penalidades}
            basePct={unidade.comissionamento.basePct}
          />
        </TabsContent>

        <TabsContent value="historico">
          <Card className="p-6">
            <Timeline
              items={unidade.historico}
              title="Histórico"
              subtitle="Linha do tempo de ocorrências e eventos de negócio"
            />
          </Card>
        </TabsContent>
      </Tabs>

      <NovaOcorrenciaModal
        open={ocorrenciaModalOpen}
        onOpenChange={setOcorrenciaModalOpen}
        entidadeFixa={`Unidade ${unidade.nome}`}
      />

      {/* Modal de sócios */}
      <Dialog open={sociosModalOpen} onOpenChange={setSociosModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-primary" />
              Sócios — {unidade.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {(unidade.socios ?? []).map((s) => (
              <div key={s.nome} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <UsersRound className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{s.nome}</p>
                  <p className="text-xs text-muted-foreground">{s.nivelLabel}{s.documento ? ` • ${s.documento}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnidadeDetalhe;

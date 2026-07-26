import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown, Workflow, Info } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { ETAPAS_ABERTURA } from "@/lib/mock-data/esteira-abertura-unidades";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";

interface EtapaEditavel {
  id: string;
  nome: string;
  responsavel: string;
  slaDias: string;
}

function novaEtapa(): EtapaEditavel {
  return { id: `etapa-${crypto.randomUUID()}`, nome: "", responsavel: "", slaDias: "" };
}

const EtapasAberturaConfigPage = () => {
  const navigate = useNavigate();
  const [etapas, setEtapas] = useState<EtapaEditavel[]>(
    ETAPAS_ABERTURA.map((e) => ({ id: e.id, nome: e.nome, responsavel: e.responsavel, slaDias: e.slaDias != null ? String(e.slaDias) : "" }))
  );

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".eac-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".eac-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".eac-card", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const updateEtapa = (id: string, patch: Partial<EtapaEditavel>) => {
    setEtapas((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const removerEtapa = (id: string) => {
    setEtapas((prev) => prev.filter((e) => e.id !== id));
  };

  const moverEtapa = (index: number, direcao: -1 | 1) => {
    setEtapas((prev) => {
      const next = [...prev];
      const alvo = index + direcao;
      if (alvo < 0 || alvo >= next.length) return prev;
      [next[index], next[alvo]] = [next[alvo], next[index]];
      return next;
    });
  };

  const adicionarEtapa = () => {
    setEtapas((prev) => [...prev, novaEtapa()]);
  };

  const handleSalvar = () => {
    if (etapas.some((e) => e.nome.trim().length === 0)) {
      toast.error("Dê um nome a todas as etapas antes de salvar.");
      return;
    }
    toast.success("Etapas de Abertura de Unidades atualizadas.");
    navigate("/configuracoes");
  };

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="eac-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/configuracoes")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Configurações
      </Button>

      <div className="eac-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Etapas de Abertura de Unidades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as colunas do Kanban de Abertura de Unidades — adicione, edite ou reordene as etapas.
          </p>
        </div>
        <Button onClick={handleSalvar} className="gap-1.5">
          <Save className="h-4 w-4" />
          Salvar etapas
        </Button>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-border bg-muted/20 p-4 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Protótipo: as alterações feitas aqui são salvas apenas nesta tela — o Kanban de Abertura de Unidades
            continua usando as 8 etapas padrão do processo.
          </p>
        </div>

        <Card className="eac-card space-y-4 p-6">
          <SectionHeader icon={Workflow} title="Etapas do processo" subtitle="Empilhe as etapas na ordem em que devem aparecer no Kanban" />

          <div className="space-y-3">
            {etapas.map((etapa, index) => (
              <Card key={etapa.id} className="space-y-3 border-dashed p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_100px]">
                    <div className="space-y-1.5">
                      <Label htmlFor={`etapa-nome-${etapa.id}`} className="text-xs">
                        Nome da etapa <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`etapa-nome-${etapa.id}`}
                        placeholder="Ex.: Comitê de expansão"
                        value={etapa.nome}
                        onChange={(e) => updateEtapa(etapa.id, { nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`etapa-resp-${etapa.id}`} className="text-xs">Responsável</Label>
                      <Input
                        id={`etapa-resp-${etapa.id}`}
                        placeholder="Ex.: Gerente regional"
                        value={etapa.responsavel}
                        onChange={(e) => updateEtapa(etapa.id, { responsavel: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`etapa-sla-${etapa.id}`} className="text-xs">SLA (dias)</Label>
                      <Input
                        id={`etapa-sla-${etapa.id}`}
                        type="number"
                        min={0}
                        placeholder="—"
                        value={etapa.slaDias}
                        onChange={(e) => updateEtapa(etapa.id, { slaDias: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={index === 0}
                      onClick={() => moverEtapa(index, -1)}
                      aria-label="Mover etapa para cima"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={index === etapas.length - 1}
                      onClick={() => moverEtapa(index, 1)}
                      aria-label="Mover etapa para baixo"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end pl-12">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removerEtapa(etapa.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full gap-1.5 border-dashed" onClick={adicionarEtapa}>
            <Plus className="h-4 w-4" />
            Adicionar etapa
          </Button>
        </Card>

        <Button className="w-full gap-1.5" onClick={handleSalvar}>
          <Save className="h-4 w-4" />
          Salvar etapas
        </Button>
      </div>
    </div>
  );
};

export default EtapasAberturaConfigPage;

import { useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Lock,
  ListChecks,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import {
  getFormTemplate,
  CAMPOS_FIXOS,
  CAMPO_TIPO_CONFIG,
  type CampoTemplate,
  type CampoTipo,
} from "@/lib/mock-data/form-templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function novoCampo(): CampoTemplate {
  return {
    id: `campo-${crypto.randomUUID()}`,
    label: "",
    tipo: "texto",
    obrigatorio: false,
  };
}

const FormTemplateBuilderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const modoEdicao = !!id;
  const templateExistente = id ? getFormTemplate(id) : undefined;

  const [nome, setNome] = useState(templateExistente?.nome ?? "");
  const [descricao, setDescricao] = useState(templateExistente?.descricao ?? "");
  const [campos, setCampos] = useState<CampoTemplate[]>(
    templateExistente?.campos.filter((c) => !c.fixo) ?? []
  );

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".tb-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".tb-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".tb-grid", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const updateCampo = (campoId: string, patch: Partial<CampoTemplate>) => {
    setCampos((prev) => prev.map((c) => (c.id === campoId ? { ...c, ...patch } : c)));
  };

  const removerCampo = (campoId: string) => {
    setCampos((prev) => prev.filter((c) => c.id !== campoId));
  };

  const moverCampo = (index: number, direcao: -1 | 1) => {
    setCampos((prev) => {
      const next = [...prev];
      const alvo = index + direcao;
      if (alvo < 0 || alvo >= next.length) return prev;
      [next[index], next[alvo]] = [next[alvo], next[index]];
      return next;
    });
  };

  const adicionarCampo = () => {
    setCampos((prev) => [...prev, novoCampo()]);
  };

  const isValid = useMemo(() => nome.trim().length > 0 && campos.every((c) => c.label.trim().length > 0), [nome, campos]);

  const handleSalvar = () => {
    if (!isValid) {
      toast.error("Dê um nome ao modelo e preencha o rótulo de todos os campos adicionados.");
      return;
    }
    toast.success(`Modelo "${nome}" ${modoEdicao ? "atualizado" : "criado"} com sucesso.`);
    navigate("/configuracoes/modelos-formularios");
  };

  if (modoEdicao && !templateExistente) {
    return <Navigate to="/configuracoes/modelos-formularios" replace />;
  }

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="tb-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/configuracoes/modelos-formularios")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para modelos de formulário
      </Button>

      <div className="tb-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {modoEdicao ? "Editar Modelo de Formulário" : "Novo Modelo de Formulário"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monte o checklist empilhando campos — os 3 campos de identificação já vêm inclusos.
          </p>
        </div>
        <Button onClick={handleSalvar} className="gap-1.5">
          <Save className="h-4 w-4" />
          Salvar modelo
        </Button>
      </div>

      <div className="tb-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          <Card className="space-y-4 p-6">
            <SectionHeader icon={ListChecks} title="Identificação do modelo" subtitle="Nome e descrição exibidos na listagem" />
            <div className="space-y-1.5">
              <Label htmlFor="tmpl-nome">
                Nome do modelo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tmpl-nome"
                placeholder="Ex.: Checklist Comercial — Follow-up"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tmpl-descricao">Descrição</Label>
              <Textarea
                id="tmpl-descricao"
                rows={2}
                placeholder="Quando este modelo deve ser usado…"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader
              icon={Lock}
              title="Campos de identificação"
              subtitle="Padrão em todo modelo — obrigatórios e já preenchidos automaticamente"
            />
            <div className="divide-y divide-border">
              {CAMPOS_FIXOS.map((campo) => {
                const TipoIcon = CAMPO_TIPO_CONFIG[campo.tipo].icon;
                return (
                  <div key={campo.id} className="flex items-center gap-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
                      <TipoIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{campo.label}</p>
                      <p className="text-xs text-muted-foreground">{CAMPO_TIPO_CONFIG[campo.tipo].label}</p>
                    </div>
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Obrigatório
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <SectionHeader
              icon={ListChecks}
              title="Campos do checklist"
              subtitle="Empilhe os campos que compõem este modelo"
            />

            {campos.length === 0 && (
              <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border py-10 text-center">
                <p className="text-sm font-medium text-foreground">Nenhum campo adicionado ainda</p>
                <p className="text-xs text-muted-foreground">Use o botão abaixo para começar a empilhar os campos do checklist.</p>
              </div>
            )}

            <div className="space-y-3">
              {campos.map((campo, index) => {
                const TipoIcon = CAMPO_TIPO_CONFIG[campo.tipo].icon;
                return (
                  <Card key={campo.id} className="space-y-3 border-dashed p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <TipoIcon className="h-4 w-4" />
                      </div>
                      <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                        <div className="space-y-1.5">
                          <Label htmlFor={`campo-label-${campo.id}`} className="text-xs">
                            Rótulo do campo <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`campo-label-${campo.id}`}
                            placeholder="Ex.: Meta do trimestre revisada?"
                            value={campo.label}
                            onChange={(e) => updateCampo(campo.id, { label: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Tipo de campo</Label>
                          <Select value={campo.tipo} onValueChange={(v) => updateCampo(campo.id, { tipo: v as CampoTipo })}>
                            <SelectTrigger aria-label="Tipo de campo">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.keys(CAMPO_TIPO_CONFIG) as CampoTipo[]).map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>{CAMPO_TIPO_CONFIG[tipo].label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={index === 0}
                          onClick={() => moverCampo(index, -1)}
                          aria-label="Mover campo para cima"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={index === campos.length - 1}
                          onClick={() => moverCampo(index, 1)}
                          aria-label="Mover campo para baixo"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {campo.tipo === "select" && (
                      <div className="space-y-1.5 pl-12">
                        <Label htmlFor={`campo-opcoes-${campo.id}`} className="text-xs">Opções (separadas por vírgula)</Label>
                        <Input
                          id={`campo-opcoes-${campo.id}`}
                          placeholder="Ex.: Ótimo, Bom, Regular, Ruim"
                          value={campo.opcoes?.join(", ") ?? ""}
                          onChange={(e) => updateCampo(campo.id, { opcoes: e.target.value.split(",").map((o) => o.trim()).filter(Boolean) })}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pl-12">
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <Switch
                          checked={campo.obrigatorio}
                          onCheckedChange={(c) => updateCampo(campo.id, { obrigatorio: c })}
                        />
                        Campo obrigatório
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removerCampo(campo.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remover
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button variant="outline" className="w-full gap-1.5 border-dashed" onClick={adicionarCampo}>
              <Plus className="h-4 w-4" />
              Adicionar campo
            </Button>
          </Card>
        </div>

        {/* Resumo lateral */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="p-6">
            <SectionHeader icon={ListChecks} title="Resumo do modelo" subtitle="Estrutura final do checklist" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Campos fixos</span>
                <span className="font-semibold text-foreground">{CAMPOS_FIXOS.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Campos adicionados</span>
                <span className="font-semibold text-foreground">{campos.length}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
                <span className="text-muted-foreground">Total de campos</span>
                <span className="font-semibold text-foreground">{CAMPOS_FIXOS.length + campos.length}</span>
              </div>
            </div>
          </Card>
          <Button className="w-full gap-1.5" onClick={handleSalvar}>
            <Save className="h-4 w-4" />
            Salvar modelo
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default FormTemplateBuilderPage;

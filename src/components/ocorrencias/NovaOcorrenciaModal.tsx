import { useState, useMemo } from "react";
import { Lock, FileText, Send, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface NovaOcorrenciaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Entidade pré-selecionada (quando aberto a partir de uma página de detalhe). */
  entidadeFixa?: string;
}

/**
 * Modal para registrar uma nova ocorrência — layout em duas colunas:
 * esquerda (estreita) com selects, direita (larga) com título + tabs (descrição / anotação privada).
 */
export function NovaOcorrenciaModal({ open, onOpenChange, entidadeFixa }: NovaOcorrenciaModalProps) {
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [entidade, setEntidade] = useState(entidadeFixa ?? "");
  const [entidadeBusca, setEntidadeBusca] = useState("");
  const [entidadeAberta, setEntidadeAberta] = useState(false);
  const [canal, setCanal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anotacao, setAnotacao] = useState("");

  // Mock entities for autocomplete
  const entidades = useMemo(() => [
    { id: "L001", label: "Unidade SP-Centro", tipo: "Unidade" },
    { id: "L002", label: "Unidade Campinas", tipo: "Unidade" },
    { id: "L003", label: "Unidade Curitiba-Norte", tipo: "Unidade" },
    { id: "L004", label: "Unidade RJ-Barra", tipo: "Unidade" },
    { id: "PV-1042", label: "PV Alpha", tipo: "PV" },
    { id: "PV-1055", label: "PV Vega", tipo: "PV" },
    { id: "PV-2091", label: "PV Zeta", tipo: "PV" },
    { id: "C001", label: "Maria Santos", tipo: "Consultor" },
    { id: "C002", label: "Carlos Oliveira", tipo: "Consultor" },
    { id: "C003", label: "Beatriz Souza", tipo: "Consultor" },
    { id: "C004", label: "Diego Farias", tipo: "Consultor" },
  ], []);

  const entidadesFiltradas = useMemo(() => {
    if (!entidadeBusca.trim()) return entidades;
    const termo = entidadeBusca.toLowerCase();
    return entidades.filter((e) => e.label.toLowerCase().includes(termo) || e.tipo.toLowerCase().includes(termo));
  }, [entidadeBusca, entidades]);

  const handleSubmit = () => {
    onOpenChange(false);
    setTipo(""); setTitulo(""); setEntidade(""); setEntidadeBusca(""); setCanal(""); setDescricao(""); setAnotacao("");
  };

  const isValid = tipo && titulo && entidade && canal && descricao;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Nova Ocorrência
          </DialogTitle>
          <DialogDescription>
            Registre um fato de relacionamento no histórico da unidade.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-3 md:grid-cols-[220px_1fr]">
          {/* Left column (narrow): selects */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="occ-tipo">Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="occ-tipo">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conflito">Conflito</SelectItem>
                  <SelectItem value="Visita">Visita</SelectItem>
                  <SelectItem value="Notificação">Notificação</SelectItem>
                  <SelectItem value="Penalidade">Penalidade</SelectItem>
                  <SelectItem value="Contrato">Contrato</SelectItem>
                  <SelectItem value="Denúncia">Denúncia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="occ-canal">Canal de Origem</Label>
              <Select value={canal} onValueChange={setCanal}>
                <SelectTrigger id="occ-canal">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="E-mail">E-mail</SelectItem>
                  <SelectItem value="Ligação">Ligação</SelectItem>
                  <SelectItem value="Sistema">Sistema</SelectItem>
                  <SelectItem value="Denúncia">Denúncia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="occ-entidade">Entidade</Label>
              <div className="relative">
                {entidadeFixa ? (
                  <Input
                    id="occ-entidade"
                    value={entidadeFixa}
                    disabled
                    className="pl-3 disabled:opacity-70"
                  />
                ) : (
                  <>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="occ-entidade"
                      placeholder="Buscar…"
                      className="pl-9"
                      value={entidade || entidadeBusca}
                      onChange={(e) => { setEntidadeBusca(e.target.value); setEntidade(""); setEntidadeAberta(true); }}
                      onFocus={() => setEntidadeAberta(true)}
                    />
                    {entidadeAberta && !entidade && (
                      <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
                        {entidadesFiltradas.length === 0 ? (
                          <p className="px-3 py-2 text-xs text-muted-foreground">Nenhum resultado</p>
                        ) : (
                          entidadesFiltradas.map((ent) => (
                            <button
                              key={ent.id}
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                              onClick={() => { setEntidade(ent.label); setEntidadeBusca(""); setEntidadeAberta(false); }}
                            >
                              <span className="text-[10px] font-medium text-muted-foreground">{ent.tipo}</span>
                              <span className="text-foreground">{ent.label}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right column (wide): título + tabs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="occ-titulo">Título da Ocorrência</Label>
              <Input
                id="occ-titulo"
                placeholder="Descreva brevemente a ocorrência"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <Tabs defaultValue="descricao" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="descricao" className="flex-1">Descrição</TabsTrigger>
                <TabsTrigger value="anotacao" className="flex-1 gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Anotação Privada
                </TabsTrigger>
              </TabsList>

              <TabsContent value="descricao" className="mt-3">
                <Textarea
                  id="occ-descricao"
                  placeholder="Detalhe o contexto da ocorrência, as partes envolvidas e o que motivou o registro…"
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="anotacao" className="mt-3">
                <Textarea
                  id="occ-anotacao"
                  placeholder="A loja não terá acesso a essa informação."
                  rows={6}
                  className="border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-950/10"
                  value={anotacao}
                  onChange={(e) => setAnotacao(e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            <Send className="mr-1.5 h-4 w-4" />
            Registrar Ocorrência
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

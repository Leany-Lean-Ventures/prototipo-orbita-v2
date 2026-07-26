import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { type EtapaPromocaoId, ETAPAS_PROMOCAO } from "@/lib/mock-data/esteira-promocao-consultores";

export interface TransicaoPromocaoFormData {
  etapaDestino: EtapaPromocaoId;
  // Validação
  tempoCasaMeses?: number;
  volumeVendasMensal?: number;
  retencaoPercentual?: number;
  scoreConsultor?: number;
  criteriosChecados?: boolean;
  // Estrutura PV
  cadeiaPVDeclarada?: boolean;
  monotonicidadeOk?: boolean;
  // Deliberação
  autoridadeAprovadora?: string;
  dataDeliberacao?: string;
  decisao?: "aprovado" | "reprovado" | "ajuste";
  justificativa?: string;
  // Efetivação
  aditivoAssinado?: boolean;
  // Vigente (terminal)
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  etapaDestino: EtapaPromocaoId;
  registroNome: string;
  onSalvar: (data: TransicaoPromocaoFormData) => void;
}

export function EtapaTransicaoPromocaoModal({ open, onOpenChange, etapaDestino, registroNome, onSalvar }: Props) {
  const etapaCfg = ETAPAS_PROMOCAO.find((e) => e.id === etapaDestino)!;

  const [tempoCasa, setTempoCasa] = useState("");
  const [volume, setVolume] = useState("");
  const [retencao, setRetencao] = useState("");
  const [score, setScore] = useState("");
  const [criteriosOk, setCriteriosOk] = useState(false);

  const [cadeiaDeclarada, setCadeiaDeclarada] = useState(false);
  const [monotonicidade, setMonotonicidade] = useState(false);

  const [autoridade, setAutoridade] = useState("");
  const [dataDelib, setDataDelib] = useState("");
  const [decisao, setDecisao] = useState("");
  const [justificativa, setJustificativa] = useState("");

  const [aditivo, setAditivo] = useState(false);

  const handleSalvar = () => {
    const data: TransicaoPromocaoFormData = { etapaDestino };
    switch (etapaDestino) {
      case "VALIDACAO":
        data.tempoCasaMeses = parseInt(tempoCasa) || 0;
        data.volumeVendasMensal = parseFloat(volume) || 0;
        data.retencaoPercentual = parseFloat(retencao) || 0;
        data.scoreConsultor = parseInt(score) || 0;
        data.criteriosChecados = criteriosOk;
        break;
      case "ESTRUTURA_PV":
        data.cadeiaPVDeclarada = cadeiaDeclarada;
        data.monotonicidadeOk = monotonicidade;
        break;
      case "DELIBERACAO":
        data.autoridadeAprovadora = autoridade;
        data.dataDeliberacao = dataDelib;
        data.decisao = decisao as "aprovado" | "reprovado" | "ajuste";
        data.justificativa = justificativa;
        break;
      case "EFETIVACAO":
        data.aditivoAssinado = aditivo;
        break;
      case "VIGENTE":
        break;
    }
    onSalvar(data);
  };

  const renderForm = () => {
    switch (etapaDestino) {
      case "VALIDACAO":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tempo de casa (meses)</Label>
                <Input type="number" placeholder="Ex: 18" value={tempoCasa} onChange={(e) => setTempoCasa(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Volume de vendas mensal (R$)</Label>
                <Input type="number" placeholder="Ex: 1500000" value={volume} onChange={(e) => setVolume(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Retenção (%)</Label>
                <Input type="number" min={0} max={100} placeholder="Ex: 96" value={retencao} onChange={(e) => setRetencao(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Score do consultor</Label>
                <Input type="number" placeholder="Ex: 780" value={score} onChange={(e) => setScore(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={criteriosOk} onCheckedChange={setCriteriosOk} />
              <Label>Todos os critérios do plano da loja atendidos</Label>
            </div>
          </div>
        );
      case "ESTRUTURA_PV":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={cadeiaDeclarada} onCheckedChange={setCadeiaDeclarada} />
              <Label>Cadeia do PV declarada (categoria por matrícula)</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={monotonicidade} onCheckedChange={setMonotonicidade} />
              <Label>Monotonicidade da cadeia validada (todo nível ≥ o de baixo)</Label>
            </div>
          </div>
        );
      case "DELIBERACAO":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Autoridade aprovadora</Label>
                <Select value={autoridade} onValueChange={setAutoridade}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gerente de BU">Gerente de BU</SelectItem>
                    <SelectItem value="VP + CEO">VP + CEO (Licenciado I)</SelectItem>
                    <SelectItem value="Comitê dos 3 Masters">Comitê dos 3 Masters</SelectItem>
                    <SelectItem value="Convite do Lojista">Convite do Lojista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Data da deliberação</Label>
                <Input type="date" value={dataDelib} onChange={(e) => setDataDelib(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Decisão</Label>
              <Select value={decisao} onValueChange={setDecisao}>
                <SelectTrigger><SelectValue placeholder="Selecione a decisão" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="reprovado">Reprovado</SelectItem>
                  <SelectItem value="ajuste">Ajuste solicitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {decisao === "reprovado" && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">O card será marcado como <strong>Reprovado</strong>. Bandeira de conflito registrada.</p>
              </div>
            )}
            {decisao === "ajuste" && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <p className="text-sm text-warning">O card retornará para <strong>Validação</strong> para revisão.</p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Justificativa (obrigatória)</Label>
              <Textarea rows={3} placeholder="Razão da decisão — rastro obrigatório…" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
            </div>
          </div>
        );
      case "EFETIVACAO":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Regra de janela: solicitação até dia 13 → vigência dia 21 do mesmo mês.</p>
              <p className="text-sm font-medium text-foreground">Janela de efetivação: 21/08/2026</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={aditivo} onCheckedChange={setAditivo} />
              <Label>Contrato aditivo assinado</Label>
            </div>
          </div>
        );
      case "VIGENTE":
        return (
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <p className="text-sm text-foreground">Confirmar que a nova categoria está vigente e o ciclo de carreira foi atualizado.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Avançar para: {etapaCfg.nome}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para mover <strong>{registroNome}</strong> para a próxima etapa.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Badge variant="outline" className="mb-4">Responsável: {etapaCfg.responsavel}</Badge>
          {renderForm()}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            Confirmar avanço
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { type EtapaId, ETAPAS_ABERTURA } from "@/lib/mock-data/esteira-abertura-unidades";

export interface TransicaoFormData {
  etapaDestino: EtapaId;
  // Bloco B
  desempenhoPercentual?: number;
  conformidadeContratual?: boolean;
  cidadeDisponivel?: "sim" | "nao";
  parecerElegibilidade?: string;
  // Bloco C
  projecaoFaturamento?: number;
  perfilCidade?: string;
  equipeEstimada?: number;
  planoNegocioArquivo?: string;
  // Bloco D
  dataReuniaoComite?: string;
  participantesComite?: string[];
  scoreComite?: number;
  decisaoComite?: "aprovado" | "reprovado" | "ajuste";
  justificativaComite?: string;
  // Bloco E
  checklistStatus?: Record<string, "pendente" | "recebido" | "validado">;
  // Bloco F
  statusAssinatura?: "pendente" | "em_assinatura" | "assinado";
  bancoPJ?: string;
  agenciaPJ?: string;
  contaPJ?: string;
  aceitePenalty?: boolean;
  cadastradoNewcon?: boolean;
  // Bloco G
  dataInicioObra?: string;
  prazoPrevistoObra?: string;
  andamentoObra?: number;
  // Bloco H
  dataAbertura?: string;
  emailCorporativoCriado?: boolean;
  publicacaoSite?: boolean;
  metaDefinida?: boolean;
  territorioBloqueado?: boolean;
}

interface EtapaTransicaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  etapaDestino: EtapaId;
  registroNome: string;
  onSalvar: (data: TransicaoFormData) => void;
}

const CHECKLIST_ITEMS = [
  "Documento de identidade do responsável",
  "Comprovante de endereço",
  "Contrato social da PJ",
  "Contrato de locação",
  "Comprovantes de conformidade contratual",
];

const BANCOS = ["Banco do Brasil", "Itaú", "Bradesco", "Santander", "Caixa Econômica"];

/**
 * Modal de transição de etapa — formulário dinâmico baseado na etapa destino.
 * Campos obrigatórios devem ser preenchidos para salvar (avançar o card).
 */
export function EtapaTransicaoModal({ open, onOpenChange, etapaDestino, registroNome, onSalvar }: EtapaTransicaoModalProps) {
  const etapaCfg = ETAPAS_ABERTURA.find((e) => e.id === etapaDestino)!;

  // Form state
  const [desempenho, setDesempenho] = useState("");
  const [conformidade, setConformidade] = useState(false);
  const [cidadeDisponivel, setCidadeDisponivel] = useState("");
  const [parecer, setParecer] = useState("");

  const [projecao, setProjecao] = useState("");
  const [perfilCidade, setPerfilCidade] = useState("");
  const [equipe, setEquipe] = useState("");
  const [planoArquivo, setPlanoArquivo] = useState("");

  const [dataReuniao, setDataReuniao] = useState("");
  const [scoreComite, setScoreComite] = useState("");
  const [decisaoComite, setDecisaoComite] = useState("");
  const [justificativa, setJustificativa] = useState("");

  const [checklistStatus, setChecklistStatus] = useState<Record<string, string>>(
    Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item, "pendente"]))
  );

  const [statusAssinatura, setStatusAssinatura] = useState("");
  const [bancoPJ, setBancoPJ] = useState("");
  const [agenciaPJ, setAgenciaPJ] = useState("");
  const [contaPJ, setContaPJ] = useState("");
  const [aceitePenalty, setAceitePenalty] = useState(false);
  const [cadastradoNewcon, setCadastradoNewcon] = useState(false);

  const [dataInicioObra, setDataInicioObra] = useState("");
  const [prazoObra, setPrazoObra] = useState("");
  const [andamento, setAndamento] = useState("");

  const [dataAbertura, setDataAbertura] = useState("");
  const [emailCriado, setEmailCriado] = useState(false);
  const [publicacaoSite, setPublicacaoSite] = useState(false);
  const [metaDefinida, setMetaDefinida] = useState(false);
  const [territorioBloqueado, setTerritorioBloqueado] = useState(false);

  const handleSalvar = () => {
    const data: TransicaoFormData = { etapaDestino };

    switch (etapaDestino) {
      case "ELEGIBILIDADE":
        data.desempenhoPercentual = parseFloat(desempenho) || 0;
        data.conformidadeContratual = conformidade;
        data.cidadeDisponivel = cidadeDisponivel as "sim" | "nao";
        data.parecerElegibilidade = parecer;
        break;
      case "PLANO_NEGOCIO":
        data.projecaoFaturamento = parseFloat(projecao) || 0;
        data.perfilCidade = perfilCidade;
        data.equipeEstimada = parseInt(equipe) || 0;
        data.planoNegocioArquivo = planoArquivo || "plano-de-negocio.pdf";
        break;
      case "COMITE":
        data.dataReuniaoComite = dataReuniao;
        data.participantesComite = ["Gerente Regional", "Diretor Regional", "Diretoria Master"];
        data.scoreComite = parseInt(scoreComite) || 0;
        data.decisaoComite = decisaoComite as "aprovado" | "reprovado" | "ajuste";
        data.justificativaComite = justificativa;
        break;
      case "DOCUMENTACAO":
        data.checklistStatus = checklistStatus as Record<string, "pendente" | "recebido" | "validado">;
        break;
      case "CONTRATO":
        data.statusAssinatura = statusAssinatura as "pendente" | "em_assinatura" | "assinado";
        data.bancoPJ = bancoPJ;
        data.agenciaPJ = agenciaPJ;
        data.contaPJ = contaPJ;
        data.aceitePenalty = aceitePenalty;
        data.cadastradoNewcon = cadastradoNewcon;
        break;
      case "OBRA":
        data.dataInicioObra = dataInicioObra;
        data.prazoPrevistoObra = prazoObra;
        data.andamentoObra = parseInt(andamento) || 0;
        break;
      case "ABERTURA":
        data.dataAbertura = dataAbertura;
        data.emailCorporativoCriado = emailCriado;
        data.publicacaoSite = publicacaoSite;
        data.metaDefinida = metaDefinida;
        data.territorioBloqueado = territorioBloqueado;
        break;
    }

    onSalvar(data);
  };

  const renderFormFields = () => {
    switch (etapaDestino) {
      case "ELEGIBILIDADE":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Desempenho comprovado (%)</Label>
                <Input type="number" step="0.1" placeholder="Ex: 2.7" value={desempenho} onChange={(e) => setDesempenho(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Cidade disponível</Label>
                <Select value={cidadeDisponivel} onValueChange={setCidadeDisponivel}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim — sem bloqueio</SelectItem>
                    <SelectItem value="nao">Não — bloqueada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={conformidade} onCheckedChange={setConformidade} />
              <Label>Conformidade contratual validada</Label>
            </div>
            <div className="space-y-1.5">
              <Label>Parecer de elegibilidade</Label>
              <Textarea rows={3} placeholder="Justificativa da triagem…" value={parecer} onChange={(e) => setParecer(e.target.value)} />
            </div>
          </div>
        );

      case "PLANO_NEGOCIO":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Projeção de faturamento (R$)</Label>
                <Input type="number" placeholder="Ex: 250000" value={projecao} onChange={(e) => setProjecao(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Equipe estimada</Label>
                <Input type="number" placeholder="Nº de pessoas" value={equipe} onChange={(e) => setEquipe(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Perfil da cidade / mercado</Label>
              <Textarea rows={3} placeholder="Descreva o perfil da cidade…" value={perfilCidade} onChange={(e) => setPerfilCidade(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Plano de negócio (arquivo)</Label>
              <Input placeholder="Nome do arquivo (ex: plano-sorocaba.pdf)" value={planoArquivo} onChange={(e) => setPlanoArquivo(e.target.value)} />
            </div>
          </div>
        );

      case "COMITE":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Data da reunião</Label>
                <Input type="date" value={dataReuniao} onChange={(e) => setDataReuniao(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Score do comitê (0–100)</Label>
                <Input type="number" min={0} max={100} placeholder="Ex: 82" value={scoreComite} onChange={(e) => setScoreComite(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Decisão do comitê</Label>
              <Select value={decisaoComite} onValueChange={setDecisaoComite}>
                <SelectTrigger><SelectValue placeholder="Selecione a decisão" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="reprovado">Reprovado</SelectItem>
                  <SelectItem value="ajuste">Ajuste solicitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {decisaoComite === "reprovado" && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">O card será marcado como <strong>Reprovado</strong> e não avançará.</p>
              </div>
            )}
            {decisaoComite === "ajuste" && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <p className="text-sm text-warning">O card retornará para a etapa <strong>Plano de negócio</strong> para revisão.</p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Justificativa</Label>
              <Textarea rows={3} placeholder="Razão da decisão…" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
            </div>
          </div>
        );

      case "DOCUMENTACAO":
        return (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Atualize o status de cada documento:</p>
            {CHECKLIST_ITEMS.map((item) => (
              <div key={item} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                <p className="text-sm text-foreground">{item}</p>
                <Select value={checklistStatus[item]} onValueChange={(v) => setChecklistStatus((prev) => ({ ...prev, [item]: v }))}>
                  <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="validado">Validado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case "CONTRATO":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Status da assinatura</Label>
              <Select value={statusAssinatura} onValueChange={setStatusAssinatura}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_assinatura">Em assinatura</SelectItem>
                  <SelectItem value="assinado">Assinado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Banco (Conta PJ)</Label>
                <Select value={bancoPJ} onValueChange={setBancoPJ}>
                  <SelectTrigger><SelectValue placeholder="Banco" /></SelectTrigger>
                  <SelectContent>
                    {BANCOS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Agência</Label>
                <Input placeholder="Ex: 1234" value={agenciaPJ} onChange={(e) => setAgenciaPJ(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Conta PJ</Label>
                <Input placeholder="Ex: 56789-0" value={contaPJ} onChange={(e) => setContaPJ(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={aceitePenalty} onCheckedChange={setAceitePenalty} />
              <Label>Aceite da cláusula de penalty (0,5% por até 24 meses)</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={cadastradoNewcon} onCheckedChange={setCadastradoNewcon} />
              <Label>Cadastrado no Newcon (Comissões)</Label>
            </div>
          </div>
        );

      case "OBRA":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Data de início da obra</Label>
                <Input type="date" value={dataInicioObra} onChange={(e) => setDataInicioObra(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Prazo previsto (conclusão)</Label>
                <Input type="date" value={prazoObra} onChange={(e) => setPrazoObra(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Andamento da obra (%)</Label>
              <Input type="number" min={0} max={100} placeholder="Ex: 0" value={andamento} onChange={(e) => setAndamento(e.target.value)} />
            </div>
          </div>
        );

      case "ABERTURA":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Data de abertura</Label>
              <Input type="date" value={dataAbertura} onChange={(e) => setDataAbertura(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Switch checked={emailCriado} onCheckedChange={setEmailCriado} />
                <Label>E-mail corporativo criado</Label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Switch checked={publicacaoSite} onCheckedChange={setPublicacaoSite} />
                <Label>Publicado no site</Label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Switch checked={metaDefinida} onCheckedChange={setMetaDefinida} />
                <Label>Meta definida</Label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Switch checked={territorioBloqueado} onCheckedChange={setTerritorioBloqueado} />
                <Label>Território bloqueado para prévias externas</Label>
              </div>
            </div>
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
          <Badge variant="outline" className="mb-4">
            Responsável: {etapaCfg.responsavel}
          </Badge>
          {renderFormFields()}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            Confirmar avanço
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

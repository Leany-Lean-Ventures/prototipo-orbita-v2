import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, FileText, User, BriefcaseBusiness } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { NIVEIS_LABEL, CANAL_LABEL, type NivelId, type CanalOrigem, type TipoMovimento } from "@/lib/mock-data/esteira-promocao-consultores";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const NovoRegistroPromocaoPage = () => {
  const navigate = useNavigate();
  const [consultor, setConsultor] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nivelAtual, setNivelAtual] = useState<NivelId | "">("");
  const [tipoMovimento, setTipoMovimento] = useState<TipoMovimento | "">("");
  const [percentualAtual, setPercentualAtual] = useState("");
  const [teraEquipe, setTeraEquipe] = useState(false);
  const [canal, setCanal] = useState<CanalOrigem | "">("");
  const [donoEmCopia, setDonoEmCopia] = useState("");

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".nrp-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".nrp-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".nrp-card", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const isValid = useMemo(() => consultor && razaoSocial && matricula && nivelAtual && tipoMovimento && canal, [consultor, razaoSocial, matricula, nivelAtual, tipoMovimento, canal]);

  const handleSalvar = () => {
    if (!isValid) { toast.error("Preencha todos os campos obrigatórios."); return; }
    toast.success(`Solicitação de promoção de ${consultor} registrada na esteira.`);
    navigate("/esteira/promocao-consultores");
  };

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button variant="ghost" size="sm" className="nrp-voltar -ml-2 gap-1.5 text-muted-foreground" onClick={() => navigate("/esteira/promocao-consultores")}><ArrowLeft className="h-4 w-4" />Voltar para o Kanban</Button>
      <div className="nrp-header">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Nova Solicitação de Promoção</h1>
          <p className="mt-1 text-sm text-muted-foreground">Registre os dados iniciais — o card entra na etapa "Solicitação de promoção".</p>
        </div>
      </div>
      <Card className="nrp-card mx-auto max-w-2xl space-y-5 p-6">
        <SectionHeader icon={FileText} title="Dados da solicitação" subtitle="Bloco A — informações do consultor e tipo de movimento" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Consultor <span className="text-destructive">*</span></Label><div className="relative"><User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Nome do consultor" value={consultor} onChange={(e) => setConsultor(e.target.value)} /></div></div>
          <div className="space-y-1.5"><Label>Razão social <span className="text-destructive">*</span></Label><div className="relative"><BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Razão social da PJ" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} /></div></div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Matrícula <span className="text-destructive">*</span></Label><Input placeholder="M-XXXXX" value={matricula} onChange={(e) => setMatricula(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Nível atual <span className="text-destructive">*</span></Label>
            <Select value={nivelAtual} onValueChange={(v) => setNivelAtual(v as NivelId)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{(Object.keys(NIVEIS_LABEL) as NivelId[]).map((n) => <SelectItem key={n} value={n}>{NIVEIS_LABEL[n].nome} ({NIVEIS_LABEL[n].comissao})</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Tipo de movimento <span className="text-destructive">*</span></Label>
            <Select value={tipoMovimento} onValueChange={(v) => setTipoMovimento(v as TipoMovimento)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent><SelectItem value="promocao">Promoção</SelectItem><SelectItem value="troca_de_contrato">Troca de contrato</SelectItem><SelectItem value="convite_socio">Convite sócio de loja</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Percentual (categoria) atual</Label><Input placeholder="Ex: 2,0%" value={percentualAtual} onChange={(e) => setPercentualAtual(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Canal de origem <span className="text-destructive">*</span></Label>
            <Select value={canal} onValueChange={(v) => setCanal(v as CanalOrigem)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{(Object.keys(CANAL_LABEL) as CanalOrigem[]).map((c) => <SelectItem key={c} value={c}>{CANAL_LABEL[c]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Dono da loja em cópia</Label><Input placeholder="Nome do dono da loja" value={donoEmCopia} onChange={(e) => setDonoEmCopia(e.target.value)} /></div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
          <Switch checked={teraEquipe} onCheckedChange={setTeraEquipe} />
          <Label>Haverá equipe abaixo após a promoção</Label>
        </div>
        <Button className="w-full gap-1.5" onClick={handleSalvar}><Save className="h-4 w-4" />Registrar solicitação</Button>
      </Card>
    </div>
  );
};

export default NovoRegistroPromocaoPage;

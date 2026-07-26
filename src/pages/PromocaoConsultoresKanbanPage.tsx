import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Search, RotateCcw, ClipboardList, Clock, CheckCircle2 } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useCountUp } from "@/hooks/use-count-up";
import {
  registrosPromocaoConsultores, getResumoPromocao, getEtapaPromocaoConfig,
  STATUS_PROMOCAO_LABEL, type StatusPromocao, type RegistroPromocaoConsultor, type EtapaPromocaoId,
} from "@/lib/mock-data/esteira-promocao-consultores";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { KanbanBoardPromocao } from "@/components/esteira/KanbanBoardPromocao";
import { EtapaTransicaoPromocaoModal, type TransicaoPromocaoFormData } from "@/components/esteira/EtapaTransicaoPromocaoModal";

function StatVal({ value }: { value: number }) { const ref = useCountUp(value); return <span ref={ref}>0</span>; }

const STATUS_OPTIONS: { value: "todos" | StatusPromocao; label: string }[] = [
  { value: "todos", label: "Todos os status" },
  ...(Object.keys(STATUS_PROMOCAO_LABEL) as StatusPromocao[]).map((s) => ({ value: s, label: STATUS_PROMOCAO_LABEL[s] })),
];

const PromocaoConsultoresKanbanPage = () => {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<RegistroPromocaoConsultor[]>(registrosPromocaoConsultores);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"todos" | StatusPromocao>("todos");
  const [atrasoFiltro, setAtrasoFiltro] = useState<"todos" | "sim" | "nao">("todos");
  const [transicaoModal, setTransicaoModal] = useState<{ registroId: string; etapaDestino: EtapaPromocaoId } | null>(null);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".pc-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".pc-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".pc-stats", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.15" },
    { selector: ".pc-board", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const resumo = useMemo(() => getResumoPromocao(registros), [registros]);
  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return registros.filter((r) => {
      if (termo && !r.consultorNome.toLowerCase().includes(termo) && !r.razaoSocial.toLowerCase().includes(termo) && !r.lojaOrigem.toLowerCase().includes(termo)) return false;
      if (statusFiltro !== "todos" && r.status !== statusFiltro) return false;
      if (atrasoFiltro !== "todos" && (atrasoFiltro === "sim") !== r.emAtraso) return false;
      return true;
    });
  }, [registros, busca, statusFiltro, atrasoFiltro]);

  const limparFiltros = () => { setBusca(""); setStatusFiltro("todos"); setAtrasoFiltro("todos"); };

  const handleRequestTransicao = (id: string, etapaDestino: EtapaPromocaoId) => setTransicaoModal({ registroId: id, etapaDestino });

  const handleTransicaoSalvar = (data: TransicaoPromocaoFormData) => {
    if (!transicaoModal) return;
    const { registroId, etapaDestino } = transicaoModal;
    if (etapaDestino === "DELIBERACAO" && data.decisao === "reprovado") {
      setRegistros((prev) => prev.map((r) => r.id === registroId ? { ...r, etapaAtual: "DELIBERACAO" as EtapaPromocaoId, status: "reprovado" as StatusPromocao, updatedAt: "2026-07-26" } : r));
      toast.success("Promoção reprovada. Bandeira de conflito registrada.");
      setTransicaoModal(null); return;
    }
    if (etapaDestino === "DELIBERACAO" && data.decisao === "ajuste") {
      setRegistros((prev) => prev.map((r) => r.id === registroId ? { ...r, etapaAtual: "VALIDACAO" as EtapaPromocaoId, updatedAt: "2026-07-26" } : r));
      toast.success("Card retornou para Validação para ajustes.");
      setTransicaoModal(null); return;
    }
    setRegistros((prev) => prev.map((r) => r.id === registroId ? { ...r, etapaAtual: etapaDestino, status: etapaDestino === "VIGENTE" ? "vigente" as StatusPromocao : r.status, updatedAt: "2026-07-26" } : r));
    toast.success(`${registros.find((r) => r.id === registroId)?.consultorNome ?? "Registro"} avançou para "${getEtapaPromocaoConfig(etapaDestino).nome}".`);
    setTransicaoModal(null);
  };

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button variant="ghost" size="sm" className="pc-voltar -ml-2 gap-1.5 text-muted-foreground" onClick={() => navigate("/esteira")}><ArrowLeft className="h-4 w-4" />Voltar para Esteira</Button>
      <div className="pc-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Promoção de Consultores</h1>
          <p className="mt-1 text-sm text-muted-foreground">Esteira de promoção por nível de carreira — da solicitação à vigência.</p>
        </div>
        <Button onClick={() => navigate("/esteira/promocao-consultores/novo")} className="gap-1.5"><Plus className="h-4 w-4" />Nova solicitação</Button>
      </div>
      <div className="pc-stats grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Na esteira" color="#3b82f6"><StatVal value={resumo.total} /></StatCard>
        <StatCard icon={Clock} label="Tempo médio (dias)" color="#f59e0b"><StatVal value={resumo.tempoMedioDias} /></StatCard>
        <StatCard icon={CheckCircle2} label="Vigentes" color="#8bc34b"><StatVal value={resumo.finalizados} /></StatCard>
      </div>
      <Card className="pc-board overflow-hidden p-0 shadow-md">
        <div className="flex flex-col gap-3 border-b border-border bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent p-5 sm:flex-row sm:items-center">
          <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por consultor, razão social ou loja…" className="h-11 pl-9 text-base" value={busca} onChange={(e) => setBusca(e.target.value)} /></div>
          <Select value={statusFiltro} onValueChange={(v) => setStatusFiltro(v as typeof statusFiltro)}><SelectTrigger className="h-11 w-full sm:w-[180px]"><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
          <Select value={atrasoFiltro} onValueChange={(v) => setAtrasoFiltro(v as typeof atrasoFiltro)}><SelectTrigger className="h-11 w-full sm:w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Qualquer prazo</SelectItem><SelectItem value="sim">Em atraso</SelectItem><SelectItem value="nao">No prazo</SelectItem></SelectContent></Select>
          <Button variant="ghost" size="sm" className="h-11 gap-1.5" onClick={limparFiltros}><RotateCcw className="h-3.5 w-3.5" />Limpar</Button>
        </div>
        <div className="p-4"><KanbanBoardPromocao registros={filtrados} onRequestTransicao={handleRequestTransicao} onCardClick={(id) => navigate(`/esteira/promocao-consultores/${id}`)} /></div>
      </Card>
      {transicaoModal && <EtapaTransicaoPromocaoModal open={!!transicaoModal} onOpenChange={(o) => { if (!o) setTransicaoModal(null); }} etapaDestino={transicaoModal.etapaDestino} registroNome={registros.find((r) => r.id === transicaoModal.registroId)?.consultorNome ?? ""} onSalvar={handleTransicaoSalvar} />}
    </div>
  );
};

export default PromocaoConsultoresKanbanPage;

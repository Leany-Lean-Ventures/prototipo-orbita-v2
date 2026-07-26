import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Search,
  RotateCcw,
  ClipboardList,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useCountUp } from "@/hooks/use-count-up";
import {
  registrosAberturaUnidades,
  getResumoAberturaUnidades,
  getEtapaConfig,
  STATUS_LABEL,
  type StatusRegistro,
  type RegistroAberturaUnidade,
  type EtapaId,
} from "@/lib/mock-data/esteira-abertura-unidades";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { KanbanBoard } from "@/components/esteira/KanbanBoard";

function StatCardValue({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useCountUp(value);
  return (
    <span>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

const STATUS_FILTRO_OPTIONS: { value: "todos" | StatusRegistro; label: string }[] = [
  { value: "todos", label: "Todos os status" },
  ...(Object.keys(STATUS_LABEL) as StatusRegistro[]).map((s) => ({ value: s, label: STATUS_LABEL[s] })),
];

const AberturaUnidadesKanbanPage = () => {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<RegistroAberturaUnidade[]>(registrosAberturaUnidades);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"todos" | StatusRegistro>("todos");
  const [atrasoFiltro, setAtrasoFiltro] = useState<"todos" | "sim" | "nao">("todos");

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".au-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".au-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".au-stats", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.15" },
    { selector: ".au-board", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const resumo = useMemo(() => getResumoAberturaUnidades(registros), [registros]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return registros.filter((r) => {
      if (
        termo &&
        !r.licenciadoNome.toLowerCase().includes(termo) &&
        !r.cidadeAlvo.toLowerCase().includes(termo) &&
        !r.lojaOrigem.toLowerCase().includes(termo)
      )
        return false;
      if (statusFiltro !== "todos" && r.status !== statusFiltro) return false;
      if (atrasoFiltro !== "todos" && (atrasoFiltro === "sim") !== r.emAtraso) return false;
      return true;
    });
  }, [registros, busca, statusFiltro, atrasoFiltro]);

  const limparFiltros = () => {
    setBusca("");
    setStatusFiltro("todos");
    setAtrasoFiltro("todos");
  };

  const handleMoverRegistro = (id: string, novaEtapa: EtapaId) => {
    setRegistros((prev) =>
      prev.map((r) => (r.id === id ? { ...r, etapaAtual: novaEtapa, updatedAt: "2026-07-26" } : r))
    );
    const registro = registros.find((r) => r.id === id);
    toast.success(`${registro?.licenciadoNome ?? "Registro"} movido para "${getEtapaConfig(novaEtapa).nome}".`);
  };

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="au-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/esteira")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Esteira
      </Button>

      <div className="au-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Abertura de Unidades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhamento das solicitações de abertura de unidade, da solicitação à ativação.
          </p>
        </div>
        <Button onClick={() => navigate("/esteira/abertura-unidades/novo")} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Adicionar registro
        </Button>
      </div>

      <div className="au-stats grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Registros na esteira" color="#3b82f6">
          <StatCardValue value={resumo.total} />
        </StatCard>
        <StatCard icon={Clock} label="Tempo médio (dias)" color="#f59e0b">
          <StatCardValue value={resumo.tempoMedioDias} />
        </StatCard>
        <StatCard icon={CheckCircle2} label="Finalizados" color="#8bc34b">
          <StatCardValue value={resumo.finalizados} />
        </StatCard>
      </div>

      <Card className="au-board overflow-hidden p-0 shadow-md">
        <div className="flex flex-col gap-3 border-b border-border bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent p-5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Buscar por licenciado, cidade ou loja de origem…"
              className="h-11 pl-9 text-base"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar registro de abertura"
            />
          </div>

          <Select value={statusFiltro} onValueChange={(v) => setStatusFiltro(v as typeof statusFiltro)}>
            <SelectTrigger className="h-11 w-full sm:w-[180px]" aria-label="Filtrar por status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTRO_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={atrasoFiltro} onValueChange={(v) => setAtrasoFiltro(v as typeof atrasoFiltro)}>
            <SelectTrigger className="h-11 w-full sm:w-[160px]" aria-label="Filtrar por atraso">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Qualquer prazo</SelectItem>
              <SelectItem value="sim">Em atraso</SelectItem>
              <SelectItem value="nao">No prazo</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" className="h-11 gap-1.5" onClick={limparFiltros}>
            <RotateCcw className="h-3.5 w-3.5" />
            Limpar
          </Button>
        </div>

        <div className="p-4">
          <KanbanBoard
            registros={filtrados}
            onMoverRegistro={handleMoverRegistro}
            onCardClick={(id) => navigate(`/esteira/abertura-unidades/${id}`)}
          />
        </div>
      </Card>
    </div>
  );
};

export default AberturaUnidadesKanbanPage;

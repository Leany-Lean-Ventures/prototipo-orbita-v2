import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  UserCog,
  FileText,
  RefreshCw,
  Scale,
  Filter,
  RotateCcw,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useCountUp } from "@/hooks/use-count-up";
import {
  previasList,
  getPrazoStatus,
  ANALISTAS,
  REGIONAIS,
  ALERTA_DIAS_PROCESSO,
  type PreviaStatus,
  type PrazoStatus,
} from "@/lib/mock-data/previas";
import { unidadesList } from "@/lib/mock-data/unidades";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PreviaStatusBadge } from "@/components/previas/PreviaStatusBadge";
import { PreviaDiasBadge } from "@/components/previas/PreviaDiasBadge";
import { NovaPreviaModal } from "@/components/previas/NovaPreviaModal";

const STATUS_TABS: { value: PreviaStatus; label: string; icon: typeof FileText }[] = [
  { value: "Documental", label: "Documental", icon: FileText },
  { value: "Retificação", label: "Retificação", icon: RefreshCw },
  { value: "Jurídico", label: "Jurídico", icon: Scale },
  { value: "Aprovada", label: "Aprovadas", icon: CheckCircle2 },
  { value: "Reprovada", label: "Reprovadas", icon: XCircle },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const FILTROS_PADRAO = {
  busca: "",
  unidade: "todas",
  regional: "todas",
  ordenacao: "sla",
  tipo: "todos",
  analista: "todos",
  periodoDe: "",
  periodoAte: "",
  sla: "todos" as "todos" | PrazoStatus,
};

function StatCardValue({ value }: { value: number }) {
  const ref = useCountUp(value);
  return <span ref={ref}>0</span>;
}

const PreviasPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PreviaStatus>("Documental");

  // Filtros aplicados (o que realmente filtra a tabela)
  const [filtros, setFiltros] = useState(FILTROS_PADRAO);
  // Rascunho — só vira `filtros` ao clicar em "Aplicar filtros"
  const [draft, setDraft] = useState(FILTROS_PADRAO);

  const [filtrosAvancadosOpen, setFiltrosAvancadosOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [novaModalOpen, setNovaModalOpen] = useState(false);
  const [analistaOverrides, setAnalistaOverrides] = useState<Record<string, string>>({});

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".prev-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".prev-stats", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".prev-tabs", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".prev-filtros", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.15" },
    { selector: ".prev-tabela", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const resetPage = () => setPage(0);

  const dados = useMemo(
    () => previasList.map((p) => (analistaOverrides[p.id] ? { ...p, analista: analistaOverrides[p.id] } : p)),
    [analistaOverrides]
  );

  const emAndamento = useMemo(
    () => dados.filter((p) => p.status !== "Aprovada" && p.status !== "Reprovada"),
    [dados]
  );
  const alerta120Dias = useMemo(
    () => emAndamento.filter((p) => p.diasProcesso >= ALERTA_DIAS_PROCESSO).length,
    [emAndamento]
  );
  const aprovados = useMemo(() => dados.filter((p) => p.status === "Aprovada").length, [dados]);
  const reprovados = useMemo(() => dados.filter((p) => p.status === "Reprovada").length, [dados]);

  const filtrados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase();
    const lista = dados.filter((p) => {
      if (p.status !== activeTab) return false;
      if (
        termo &&
        !p.nome.toLowerCase().includes(termo) &&
        !p.documento.toLowerCase().includes(termo) &&
        !(p.matriculaAva ?? "").toLowerCase().includes(termo)
      )
        return false;
      if (filtros.unidade !== "todas" && p.unidadeId !== filtros.unidade) return false;
      if (filtros.regional !== "todas" && p.regional !== filtros.regional) return false;
      if (filtros.tipo !== "todos" && p.tipo !== filtros.tipo) return false;
      if (filtros.analista !== "todos" && p.analista !== filtros.analista) return false;
      if (filtros.periodoDe && p.dataCadastro < filtros.periodoDe) return false;
      if (filtros.periodoAte && p.dataCadastro > filtros.periodoAte) return false;
      if (filtros.sla !== "todos" && getPrazoStatus(p.diasProcesso) !== filtros.sla) return false;
      return true;
    });

    return [...lista].sort((a, b) => {
      switch (filtros.ordenacao) {
        case "sla":
          return b.diasProcesso - a.diasProcesso;
        case "recentes":
          return b.dataCadastro.localeCompare(a.dataCadastro);
        case "antigos":
          return a.dataCadastro.localeCompare(b.dataCadastro);
        case "nome":
          return a.nome.localeCompare(b.nome);
        default:
          return 0;
      }
    });
  }, [dados, activeTab, filtros]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const paged = filtrados.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const todosDaPaginaSelecionados = paged.length > 0 && paged.every((p) => selecionados.has(p.id));
  const algunsDaPaginaSelecionados = paged.some((p) => selecionados.has(p.id));

  const toggleSelecionado = (id: string) => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelecionarPagina = () => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (todosDaPaginaSelecionados) {
        paged.forEach((p) => next.delete(p.id));
      } else {
        paged.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const handleAtribuirAnalista = (analista: string) => {
    setAnalistaOverrides((prev) => {
      const next = { ...prev };
      selecionados.forEach((id) => { next[id] = analista; });
      return next;
    });
    toast.success(`${selecionados.size} prévia(s) atribuída(s) a ${analista}.`);
    setSelecionados(new Set());
  };

  const handleExportar = (formato: "Excel" | "PDF") => {
    toast.success(`Exportação (mock) de ${selecionados.size} prévia(s) em ${formato} iniciada.`);
    setSelecionados(new Set());
  };

  const handleAplicarFiltros = () => {
    setFiltros(draft);
    resetPage();
  };

  const handleLimparFiltros = () => {
    setDraft(FILTROS_PADRAO);
    setFiltros(FILTROS_PADRAO);
    resetPage();
  };

  const abrirProcesso = (id: string) => navigate(`/previas/${id}`);

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <PageHeader
        className="prev-header"
        title="Esteira de Prévias"
        subtitle="Gestão e credenciamento de novos parceiros da rede."
        actions={
          <Button onClick={() => setNovaModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nova Prévia
          </Button>
        }
      />

      {/* Resumo executivo */}
      <div className="prev-stats grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total na esteira" color="#3b82f6">
          <StatCardValue value={emAndamento.length} />
        </StatCard>
        <StatCard icon={AlertTriangle} label="Alerta de 120 dias" color="#dc2626">
          <StatCardValue value={alerta120Dias} />
        </StatCard>
        <StatCard icon={CheckCircle2} label="Aprovados no mês" color="#8bc34b">
          <StatCardValue value={aprovados} />
        </StatCard>
        <StatCard icon={XCircle} label="Reprovados no mês" color="#64748b">
          <StatCardValue value={reprovados} />
        </StatCard>
      </div>

      {/* Navegação por etapas */}
      <Tabs
        className="prev-tabs"
        value={activeTab}
        onValueChange={(v) => { setActiveTab(v as PreviaStatus); resetPage(); }}
      >
        <TabsList variant="secondary">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Busca/filtros + tabela — um único container, com degradê destacando a busca */}
      <Card className="prev-container overflow-hidden p-0 shadow-md">
        <div className="prev-filtros space-y-4 border-b border-border bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Buscar por nome, razão social, CPF/CNPJ ou matrícula…"
              className="h-11 pl-9 text-base"
              value={draft.busca}
              onChange={(e) => setDraft((d) => ({ ...d, busca: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") handleAplicarFiltros(); }}
              aria-label="Buscar prévia"
            />
          </div>

          <Button
            variant={filtrosAvancadosOpen ? "secondary" : "outline"}
            className="h-11 gap-1.5"
            onClick={() => setFiltrosAvancadosOpen((v) => !v)}
            aria-expanded={filtrosAvancadosOpen}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtro avançado
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-micro ease-micro ${filtrosAvancadosOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <Collapsible open={filtrosAvancadosOpen} onOpenChange={setFiltrosAvancadosOpen}>
          <CollapsibleContent>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-4">
              <Select value={draft.tipo} onValueChange={(v) => setDraft((d) => ({ ...d, tipo: v }))}>
                <SelectTrigger className="w-[140px]" aria-label="Filtrar por tipo de pessoa">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">PF e PJ</SelectItem>
                  <SelectItem value="PF">PF</SelectItem>
                  <SelectItem value="PJ">PJ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={draft.analista} onValueChange={(v) => setDraft((d) => ({ ...d, analista: v }))}>
                <SelectTrigger className="w-[180px]" aria-label="Filtrar por analista">
                  <SelectValue placeholder="Analista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os analistas</SelectItem>
                  {ANALISTAS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={draft.sla} onValueChange={(v) => setDraft((d) => ({ ...d, sla: v as typeof draft.sla }))}>
                <SelectTrigger className="w-[170px]" aria-label="Filtrar por status do prazo">
                  <SelectValue placeholder="Status do prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Qualquer prazo</SelectItem>
                  <SelectItem value="no-prazo">No prazo</SelectItem>
                  <SelectItem value="alerta">Alerta (90+ dias)</SelectItem>
                  <SelectItem value="estourado">Estourado (120+ dias)</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Input
                  type="date"
                  className="w-[150px]"
                  value={draft.periodoDe}
                  onChange={(e) => setDraft((d) => ({ ...d, periodoDe: e.target.value }))}
                  aria-label="Período de registro — de"
                />
                <span>até</span>
                <Input
                  type="date"
                  className="w-[150px]"
                  value={draft.periodoAte}
                  onChange={(e) => setDraft((d) => ({ ...d, periodoAte: e.target.value }))}
                  aria-label="Período de registro — até"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={draft.unidade} onValueChange={(v) => setDraft((d) => ({ ...d, unidade: v }))}>
            <SelectTrigger className="w-[190px]" aria-label="Filtrar por unidade">
              <SelectValue placeholder="Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as unidades</SelectItem>
              {unidadesList.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={draft.regional} onValueChange={(v) => setDraft((d) => ({ ...d, regional: v }))}>
            <SelectTrigger className="w-[190px]" aria-label="Filtrar por regional">
              <SelectValue placeholder="Regional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as regionais</SelectItem>
              {REGIONAIS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={draft.ordenacao} onValueChange={(v) => setDraft((d) => ({ ...d, ordenacao: v }))}>
            <SelectTrigger className="w-[210px]" aria-label="Ordenar por">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sla">SLA mais crítico</SelectItem>
              <SelectItem value="recentes">Cadastro (mais recentes)</SelectItem>
              <SelectItem value="antigos">Cadastro (mais antigos)</SelectItem>
              <SelectItem value="nome">Nome do candidato (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleLimparFiltros}>
              <RotateCcw className="h-3.5 w-3.5" />
              Limpar filtros
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleAplicarFiltros}>
              <Filter className="h-3.5 w-3.5" />
              Aplicar filtros
            </Button>
          </div>
        </div>
        </div>

        {/* Tabela */}
        <div className="prev-tabela p-2">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Nenhuma prévia encontrada</p>
            <p className="text-sm text-muted-foreground">Tente ajustar a busca ou os filtros.</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={todosDaPaginaSelecionados ? true : algunsDaPaginaSelecionados ? "indeterminate" : false}
                      onCheckedChange={toggleSelecionarPagina}
                      aria-label="Selecionar todas as prévias desta página"
                    />
                  </TableHead>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Analista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((p) => (
                  <TableRow key={p.id} data-state={selecionados.has(p.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selecionados.has(p.id)}
                        onCheckedChange={() => toggleSelecionado(p.id)}
                        aria-label={`Selecionar ${p.nome}`}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                        onClick={() => abrirProcesso(p.id)}
                      >
                        <p className="max-w-[220px] truncate text-sm font-medium text-foreground">{p.nome}</p>
                        <p className="text-xs text-muted-foreground">{p.documento}</p>
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <p className="text-sm text-foreground">{p.unidadeNome}</p>
                      <p className="text-xs">{p.regional}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.analista}</TableCell>
                    <TableCell>
                      <PreviaStatusBadge status={p.status} />
                    </TableCell>
                    <TableCell>
                      <PreviaDiasBadge diasProcesso={p.diasProcesso} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Abrir processo de ${p.nome}`}
                        onClick={() => abrirProcesso(p.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
              <p className="text-xs text-muted-foreground">
                Mostrando {filtrados.length === 0 ? 0 : currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, filtrados.length)} de {filtrados.length} registros
              </p>
              <div className="flex items-center gap-3">
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); resetPage(); }}>
                  <SelectTrigger className="h-8 w-[110px] text-xs" aria-label="Registros por página">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={String(size)}>{size} / página</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
                  Anterior
                </Button>
                <span className="text-xs text-muted-foreground">{currentPage + 1} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1} onClick={() => setPage(currentPage + 1)}>
                  Próxima
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      </Card>

      {/* Barra flutuante de ações em lote */}
      {selecionados.size > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-modal flex justify-center px-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/50 bg-card/95 p-3 pl-5 shadow-overlay backdrop-blur-md">
            <p className="text-sm font-medium text-foreground">
              {selecionados.size} selecionada{selecionados.size !== 1 ? "s" : ""}
            </p>
            <Select onValueChange={handleAtribuirAnalista}>
              <SelectTrigger className="h-9 w-[220px] text-sm" aria-label="Atribuir analista em lote">
                <UserCog className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Atribuir analista em lote" />
              </SelectTrigger>
              <SelectContent>
                {ANALISTAS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExportar("Excel")}>Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportar("PDF")}>PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={() => setSelecionados(new Set())}>
              Limpar seleção
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NovaPreviaModal open={novaModalOpen} onOpenChange={setNovaModalOpen} />
    </div>
  );
};

export default PreviasPage;

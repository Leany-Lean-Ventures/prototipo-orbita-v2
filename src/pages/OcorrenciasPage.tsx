import { useState, useMemo } from "react";
import { Search, Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import {
  ocorrenciasList,
  ocorrenciasDetalhe,
  TIPO_CONFIG,
  type OcorrenciaTipo,
  type OcorrenciaStatus,
} from "@/lib/mock-data/ocorrencias";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { NovaOcorrenciaModal } from "@/components/ocorrencias/NovaOcorrenciaModal";
import { OcorrenciaDetalheModal } from "@/components/ocorrencias/OcorrenciaDetalheModal";

const STATUS_ICON = {
  Aberto: AlertTriangle,
  "Em andamento": Clock,
  Resolvido: CheckCircle2,
};

const STATUS_VARIANT: Record<OcorrenciaStatus, "destructive" | "warning" | "success"> = {
  Aberto: "destructive",
  "Em andamento": "warning",
  Resolvido: "success",
};

const PAGE_SIZE = 10;

const OcorrenciasPage = () => {
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [page, setPage] = useState(0);
  const [novaModalOpen, setNovaModalOpen] = useState(false);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".occ-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".occ-filtros", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".occ-tabela", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.2" },
  ]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return ocorrenciasList.filter((o) => {
      if (termo && !o.titulo.toLowerCase().includes(termo) && !o.entidade.toLowerCase().includes(termo)) return false;
      if (tipoFiltro !== "todos" && o.tipo !== tipoFiltro) return false;
      if (statusFiltro !== "todos" && o.status !== statusFiltro) return false;
      return true;
    });
  }, [busca, tipoFiltro, statusFiltro]);

  const totalPages = Math.ceil(filtrados.length / PAGE_SIZE);
  const paged = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const detalhe = detalheId ? ocorrenciasDetalhe[detalheId] : null;

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="occ-header"
        title="Ocorrências & Relacionamento"
        subtitle="Histórico da rede — conflitos, penalidades e registros"
        actions={
          <Button onClick={() => setNovaModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nova Ocorrência
          </Button>
        }
      />

      <Card className="occ-container overflow-hidden p-0 shadow-md">
      <div className="occ-filtros flex flex-wrap items-center gap-3 border-b border-border bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Buscar por título ou entidade…"
            className="pl-9"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(0); }}
            aria-label="Buscar ocorrência"
          />
        </div>

        <Select value={tipoFiltro} onValueChange={(v) => { setTipoFiltro(v); setPage(0); }}>
          <SelectTrigger className="w-[170px]" aria-label="Filtrar por tipo">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="Conflito">Conflito</SelectItem>
            <SelectItem value="Visita">Visita</SelectItem>
            <SelectItem value="Notificação">Notificação</SelectItem>
            <SelectItem value="Penalidade">Penalidade</SelectItem>
            <SelectItem value="Contrato">Contrato</SelectItem>
            <SelectItem value="Denúncia">Denúncia</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFiltro} onValueChange={(v) => { setStatusFiltro(v); setPage(0); }}>
          <SelectTrigger className="w-[170px]" aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Aberto">Aberto</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="occ-tabela p-2">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Nenhuma ocorrência encontrada</p>
            <p className="text-sm text-muted-foreground">Tente ajustar a busca ou os filtros.</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((o) => {
                  const config = TIPO_CONFIG[o.tipo as OcorrenciaTipo];
                  const StatusIcon = STATUS_ICON[o.status];
                  return (
                    <TableRow
                      key={o.id}
                      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      tabIndex={0}
                      onClick={() => setDetalheId(o.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") setDetalheId(o.id); }}
                    >
                      <TableCell>
                        <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
                          {o.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-foreground max-w-[280px] truncate">
                        {o.titulo}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {o.entidade}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {o.tempo}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {o.responsavel}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[o.status]} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {o.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between px-2 pb-2">
                <p className="text-xs text-muted-foreground">
                  Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtrados.length)} de {filtrados.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                    Anterior
                  </Button>
                  <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </Card>

      {/* Modals */}
      <NovaOcorrenciaModal open={novaModalOpen} onOpenChange={setNovaModalOpen} />
      {detalhe && (
        <OcorrenciaDetalheModal
          ocorrencia={detalhe}
          open={!!detalheId}
          onOpenChange={(open) => { if (!open) setDetalheId(null); }}
        />
      )}
    </div>
  );
};

export default OcorrenciasPage;

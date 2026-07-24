import { useState, useMemo } from "react";
import { Search, Plus, AlertTriangle, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import {
  visitasList,
  visitasDetalhe,
  alertaCobertura,
  type VisitaStatus,
} from "@/lib/mock-data/visitas";
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
import { NovaVisitaModal } from "@/components/visitas/NovaVisitaModal";
import { VisitaDetalheModal } from "@/components/visitas/VisitaDetalheModal";

const STATUS_VARIANT: Record<VisitaStatus, "success" | "warning" | "outline"> = {
  Agendada: "warning",
  Realizada: "success",
  Cancelada: "outline",
};

const STATUS_ICON: Record<VisitaStatus, typeof CheckCircle2> = {
  Agendada: Clock,
  Realizada: CheckCircle2,
  Cancelada: XCircle,
};

const PAGE_SIZE = 10;

const VisitasPage = () => {
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [page, setPage] = useState(0);
  const [novaModalOpen, setNovaModalOpen] = useState(false);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".vis-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".vis-alerta", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".vis-filtros", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.15" },
    { selector: ".vis-tabela", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return visitasList.filter((v) => {
      if (termo && !v.unidade.toLowerCase().includes(termo)) return false;
      if (statusFiltro !== "todos" && v.status !== statusFiltro) return false;
      if (tipoFiltro !== "todos" && v.tipo !== tipoFiltro) return false;
      return true;
    });
  }, [busca, statusFiltro, tipoFiltro]);

  const totalPages = Math.ceil(filtrados.length / PAGE_SIZE);
  const paged = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const detalhe = detalheId ? visitasDetalhe[detalheId] : null;

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="vis-header"
        title="Visitas & Alcance de Campo"
        subtitle="Planejamento e registro de visitas às unidades"
        actions={
          <Button onClick={() => setNovaModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Agendar Visita
          </Button>
        }
      />

      {/* Alerta de cobertura */}
      {alertaCobertura.totalSemVisita180d > 0 && (
        <Card className="vis-alerta flex items-center gap-4 border-warning/30 bg-warning/5 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {alertaCobertura.totalSemVisita180d} unidade{alertaCobertura.totalSemVisita180d !== 1 ? "s" : ""} sem visita há mais de 180 dias
            </p>
            <p className="text-xs text-muted-foreground">
              {alertaCobertura.unidadesCriticas.join(" • ")}
            </p>
          </div>
        </Card>
      )}

      {/* Filtros */}
      <Card className="vis-filtros flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Buscar por unidade…"
            className="pl-9"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(0); }}
            aria-label="Buscar visita"
          />
        </div>

        <Select value={tipoFiltro} onValueChange={(v) => { setTipoFiltro(v); setPage(0); }}>
          <SelectTrigger className="w-[160px]" aria-label="Filtrar por tipo">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="Comercial">Comercial</SelectItem>
            <SelectItem value="Auditoria">Auditoria</SelectItem>
            <SelectItem value="Avaliação 360">Avaliação 360</SelectItem>
            <SelectItem value="Estruturação">Estruturação</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFiltro} onValueChange={(v) => { setStatusFiltro(v); setPage(0); }}>
          <SelectTrigger className="w-[160px]" aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Agendada">Agendada</SelectItem>
            <SelectItem value="Realizada">Realizada</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Tabela */}
      <Card className="vis-tabela p-2">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Nenhuma visita encontrada</p>
            <p className="text-sm text-muted-foreground">Tente ajustar a busca ou os filtros.</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Unidade / PV</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((v) => {
                  const StatusIcon = STATUS_ICON[v.status];
                  return (
                    <TableRow
                      key={v.id}
                      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      tabIndex={0}
                      onClick={() => setDetalheId(v.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") setDetalheId(v.id); }}
                    >
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">{v.dataFormatada}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{v.unidade}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{v.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{v.responsavel}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[v.status]} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {v.status}
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
      </Card>

      {/* Modals */}
      <NovaVisitaModal open={novaModalOpen} onOpenChange={setNovaModalOpen} />
      {detalhe && (
        <VisitaDetalheModal
          visita={detalhe}
          open={!!detalheId}
          onOpenChange={(open) => { if (!open) setDetalheId(null); }}
        />
      )}
    </div>
  );
};

export default VisitasPage;

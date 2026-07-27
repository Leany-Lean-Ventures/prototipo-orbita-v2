import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, AlertTriangle, Calendar, Eye } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import {
  visitasList,
  alertaCobertura,
  RESPONSAVEIS_VISITA,
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
import { SelecionarModeloVisitaModal } from "@/components/visitas/SelecionarModeloVisitaModal";

const PAGE_SIZE = 10;

const VisitasPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [responsavelFiltro, setResponsavelFiltro] = useState("todos");
  const [page, setPage] = useState(0);
  const [modeloModalOpen, setModeloModalOpen] = useState(false);

  // Permite abrir a página já com a modal de seleção de formulário aberta
  // (ex.: vindo do dropdown "Realizar registro" da página da unidade).
  useEffect(() => {
    if (searchParams.get("registrar") === "1") {
      setModeloModalOpen(true);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("registrar");
        return next;
      }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".vis-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".vis-alerta", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".vis-container", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return visitasList.filter((v) => {
      if (termo && !v.unidadeNome.toLowerCase().includes(termo) && !v.licenciadoGestor.toLowerCase().includes(termo)) return false;
      if (tipoFiltro !== "todos" && v.tipo !== tipoFiltro) return false;
      if (responsavelFiltro !== "todos" && v.responsavelVisita !== responsavelFiltro) return false;
      return true;
    });
  }, [busca, tipoFiltro, responsavelFiltro]);

  const totalPages = Math.ceil(filtrados.length / PAGE_SIZE);
  const paged = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="vis-header"
        title="Visitas"
        subtitle="Registro de visitas realizadas às unidades e PVs da rede"
        actions={
          <Button onClick={() => setModeloModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Registrar visita
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

      {/* Busca/filtros + tabela — um único container */}
      <Card className="vis-container overflow-hidden p-0 shadow-md">
      <div className="vis-filtros flex flex-wrap items-center gap-3 border-b border-border bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Buscar por unidade ou licenciado…"
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

        <Select value={responsavelFiltro} onValueChange={(v) => { setResponsavelFiltro(v); setPage(0); }}>
          <SelectTrigger className="w-[190px]" aria-label="Filtrar por responsável">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os responsáveis</SelectItem>
            {RESPONSAVEIS_VISITA.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="vis-tabela p-2">
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
                  <TableHead>Visita realizada em</TableHead>
                  <TableHead>Unidade / PV</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{v.dataVisitaFormatada}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{v.unidadeNome}</p>
                      <p className="text-xs text-muted-foreground">{v.licenciadoGestor}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{v.tipo}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.responsavelVisita}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Ver respostas da visita a ${v.unidadeNome}`}
                        onClick={() => navigate(`/visitas/${v.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* Modal de seleção de modelo — abre a página de registro com o modelo escolhido */}
      <SelecionarModeloVisitaModal
        open={modeloModalOpen}
        onOpenChange={setModeloModalOpen}
        onConfirmar={(modeloId) => {
          setModeloModalOpen(false);
          navigate(`/visitas/novo?modelo=${modeloId}`);
        }}
      />
    </div>
  );
};

export default VisitasPage;

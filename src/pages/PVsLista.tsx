import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { pvsList, type PVStatus } from "@/lib/mock-data/pvs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
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

const STATUS_VARIANT: Record<PVStatus, BadgeProps["variant"]> = {
  Ativo: "success",
  Inativo: "outline",
  Suspenso: "warning",
};

const UNIDADES = Array.from(new Set(pvsList.map((pv) => pv.unidadeMae))).sort();
const NIVEIS = Array.from(new Set(pvsList.map((pv) => pv.nivel))).sort();
const PAGE_SIZE = 10;

const PVsLista = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);

  const busca = searchParams.get("busca") ?? "";
  const unidade = searchParams.get("unidade") ?? "todos";
  const nivel = searchParams.get("nivel") ?? "todos";
  const status = searchParams.get("status") ?? "todos";

  const setFiltro = (chave: string, valor: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!valor || valor === "todos") {
          next.delete(chave);
        } else {
          next.set(chave, valor);
        }
        return next;
      },
      { replace: true }
    );
    setPage(0);
  };

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".pvs-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".pvs-filtros", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".pvs-tabela", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.2" },
  ]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return pvsList.filter((pv) => {
      if (termo && !pv.nome.toLowerCase().includes(termo) && !pv.id.toLowerCase().includes(termo)) return false;
      if (unidade !== "todos" && pv.unidadeMae !== unidade) return false;
      if (nivel !== "todos" && pv.nivel !== nivel) return false;
      if (status !== "todos" && pv.status !== status) return false;
      return true;
    });
  }, [busca, unidade, nivel, status]);

  const totalPages = Math.ceil(filtrados.length / PAGE_SIZE);
  const paged = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToDetalhe = (id: string) => navigate(`/pvs/${id}`);

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="pvs-header"
        title="Pontos de Venda (PVs)"
        subtitle="Gestão das estruturas comerciais subordinadas"
      />

      <Card className="pvs-filtros flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar por nome ou código…"
            className="pl-9"
            value={busca}
            onChange={(e) => setFiltro("busca", e.target.value)}
            aria-label="Buscar PV por nome ou código"
          />
        </div>

        <Select value={unidade} onValueChange={(v) => setFiltro("unidade", v)}>
          <SelectTrigger className="w-[180px]" aria-label="Filtrar por unidade mãe">
            <SelectValue placeholder="Unidade Mãe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as unidades</SelectItem>
            {UNIDADES.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={nivel} onValueChange={(v) => setFiltro("nivel", v)}>
          <SelectTrigger className="w-[170px]" aria-label="Filtrar por nível">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os níveis</SelectItem>
            {NIVEIS.map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setFiltro("status", v)}>
          <SelectTrigger className="w-[160px]" aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Suspenso">Suspenso</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="pvs-tabela p-2">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Nenhum PV encontrado</p>
            <p className="text-sm text-muted-foreground">Tente ajustar a busca ou os filtros aplicados.</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Unidade Mãe</TableHead>
                  <TableHead>Gestor</TableHead>
                  <TableHead className="text-right">Carteiras</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((pv) => (
                  <TableRow
                    key={pv.id}
                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    tabIndex={0}
                    onClick={() => goToDetalhe(pv.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") goToDetalhe(pv.id); }}
                  >
                    <TableCell className="font-medium text-foreground">{pv.id}</TableCell>
                    <TableCell>{pv.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{pv.unidadeMae}</TableCell>
                    <TableCell className="text-muted-foreground">{pv.gestor}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{pv.carteirasQtd}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pv.nivel}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[pv.status]}>{pv.status}</Badge>
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default PVsLista;

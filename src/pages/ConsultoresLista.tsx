import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, BriefcaseBusiness } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { consultoresList, type ConsultorStatus } from "@/lib/mock-data/consultores";
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

const STATUS_VARIANT: Record<ConsultorStatus, BadgeProps["variant"]> = {
  Ativo: "success",
  Inativo: "outline",
  Descredenciado: "destructive",
};

/** Cor de avatar baseada no nível do consultor (PRD-03 §5). */
function avatarColorByNivel(nivel: string): { bg: string; border: string; text: string } {
  if (nivel.includes("3.5") || nivel.includes("Licenciado")) return { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-600" };
  if (nivel.includes("2.5") || nivel.includes("2.7") || nivel.includes("3.0")) return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-600" };
  if (nivel.includes("2.2") || nivel.includes("2.0")) return { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-600" };
  return { bg: "bg-secondary/10", border: "border-secondary/20", text: "text-secondary" };
}

const LOJAS = Array.from(new Set(consultoresList.map((c) => c.lojaPrincipal))).sort();
const NIVEIS = Array.from(new Set(consultoresList.map((c) => c.nivel))).sort();
const PAGE_SIZE = 10;

const ConsultoresLista = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);

  const busca = searchParams.get("busca") ?? "";
  const loja = searchParams.get("loja") ?? "todos";
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
    { selector: ".consultores-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".consultores-filtros", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".consultores-tabela", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.2" },
  ]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return consultoresList.filter((c) => {
      if (
        termo &&
        !c.razaoSocial.toLowerCase().includes(termo) &&
        !c.id.toLowerCase().includes(termo) &&
        !c.matricula.toLowerCase().includes(termo) &&
        !c.cnpj.includes(termo)
      ) return false;
      if (loja !== "todos" && c.lojaPrincipal !== loja) return false;
      if (nivel !== "todos" && c.nivel !== nivel) return false;
      if (status !== "todos" && c.status !== status) return false;
      return true;
    });
  }, [busca, loja, nivel, status]);

  const totalPages = Math.ceil(filtrados.length / PAGE_SIZE);
  const paged = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToDetalhe = (id: string) => navigate(`/consultores/${id}`);

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="consultores-header"
        title="Pessoas & Consultores"
        subtitle="Visão unificada por CNPJ — Matrículas, nível e empresas"
      />

      <Card className="consultores-lista-container overflow-hidden p-0">
      <div className="consultores-filtros flex flex-wrap items-center gap-3 border-b border-border bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar por razão social, CNPJ ou matrícula…"
            className="pl-9"
            value={busca}
            onChange={(e) => setFiltro("busca", e.target.value)}
            aria-label="Buscar consultor"
          />
        </div>

        <Select value={loja} onValueChange={(v) => setFiltro("loja", v)}>
          <SelectTrigger className="w-[170px]" aria-label="Filtrar por loja">
            <SelectValue placeholder="Loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as lojas</SelectItem>
            {LOJAS.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
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
          <SelectTrigger className="w-[170px]" aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Descredenciado">Descredenciado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="consultores-tabela p-2">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Nenhum consultor encontrado</p>
            <p className="text-sm text-muted-foreground">Tente ajustar a busca ou os filtros aplicados.</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Razão Social</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Loja Principal</TableHead>
                  <TableHead className="text-right">Empresas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    tabIndex={0}
                    onClick={() => goToDetalhe(c.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") goToDetalhe(c.id); }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {(() => {
                          const colors = avatarColorByNivel(c.nivel);
                          return (
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.bg} border ${colors.border}`}>
                              <BriefcaseBusiness className={`h-4 w-4 ${colors.text}`} />
                            </div>
                          );
                        })()}
                        <span className="font-medium text-foreground">{c.razaoSocial}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.matricula}</TableCell>
                    <TableCell className="text-muted-foreground">{c.cnpj}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.nivel}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.lojaPrincipal}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{c.empresas}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge>
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
      </div>
      </Card>
    </div>
  );
};

export default ConsultoresLista;

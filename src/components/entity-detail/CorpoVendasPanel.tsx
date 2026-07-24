import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Search, Users, BriefcaseBusiness } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
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
import type { ConsultorVinculado, OrganizacionalNode } from "@/lib/mock-data/unidades";
import ademIconCinza from "@/assets/brand/ademicon-icone-cinza.svg";

type TipoFiltro = "todos" | "pv" | "consultor";

interface CorpoVendasItem {
  id: string;
  nome: string;
  tipo: "pv" | "consultor";
  nivel: string;
  responsavel: string;
  carteiraQtd?: number;
  faturamento?: number;
  avatarUrl?: string;
  iniciais?: string;
}

interface CorpoVendasPanelProps {
  consultoresVinculados: ConsultorVinculado[];
  organizacional: OrganizacionalNode[];
}

const PAGE_SIZE = 10;

/**
 * Aba "Corpo de vendas" — lista unificada de PVs e Consultores com filtro,
 * busca, paginação e botão de navegação (olho).
 */
export function CorpoVendasPanel({ consultoresVinculados, organizacional }: CorpoVendasPanelProps) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("todos");
  const [page, setPage] = useState(0);

  // Build unified list from organizacional (PVs) + consultores
  const items: CorpoVendasItem[] = useMemo(() => {
    const pvs: CorpoVendasItem[] = [];
    const flattenPvs = (nodes: OrganizacionalNode[]) => {
      for (const node of nodes) {
        if (node.tipo === "pv") {
          pvs.push({
            id: node.id,
            nome: node.nome,
            tipo: "pv",
            nivel: node.nivelLabel,
            responsavel: node.responsavel,
          });
        }
        if (node.children) flattenPvs(node.children);
      }
    };
    flattenPvs(organizacional);

    const consultores: CorpoVendasItem[] = consultoresVinculados.map((c) => ({
      id: c.id,
      nome: c.nome,
      tipo: "consultor" as const,
      nivel: c.nivel,
      responsavel: c.nome,
      carteiraQtd: c.carteiraQtd,
      faturamento: c.faturamento,
      iniciais: c.iniciais,
      avatarUrl: `https://i.pravatar.cc/40?u=${c.id}`,
    }));

    return [...pvs, ...consultores];
  }, [organizacional, consultoresVinculados]);

  // Filter
  const filtered = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return items.filter((item) => {
      if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false;
      if (termo && !item.nome.toLowerCase().includes(termo) && !item.nivel.toLowerCase().includes(termo)) return false;
      return true;
    });
  }, [items, busca, tipoFiltro]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleView = (item: CorpoVendasItem) => {
    if (item.tipo === "pv") navigate(`/pvs/${item.id}`);
    else navigate(`/consultores/${item.id}`);
  };

  return (
    <Card className="p-6">
      <SectionHeader
        icon={Users}
        title="Corpo de Venda"
        subtitle={`${items.length} PVs e consultores vinculados à unidade`}
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou nível…"
            className="pl-9"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(0); }}
            aria-label="Buscar no corpo de vendas"
          />
        </div>
        <Select value={tipoFiltro} onValueChange={(v) => { setTipoFiltro(v as TipoFiltro); setPage(0); }}>
          <SelectTrigger className="w-[160px]" aria-label="Filtrar por tipo">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pv">Pontos de venda</SelectItem>
            <SelectItem value="consultor">Consultores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum item encontrado com os filtros aplicados.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Carteiras</TableHead>
              <TableHead className="text-right">Faturamento</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {item.tipo === "consultor" ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
                        <BriefcaseBusiness className="h-4 w-4 text-secondary" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <img src={ademIconCinza} alt="" className="h-5 w-5" />
                      </div>
                    )}
                    <span className="font-medium text-foreground">{item.nome}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.tipo === "pv" ? "outline" : "secondary"} className="text-[11px]">
                    {item.tipo === "pv" ? "PV" : "Consultor"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.nivel}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {item.carteiraQtd ?? "—"}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {item.faturamento
                    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(item.faturamento)
                    : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleView(item)}
                    aria-label={`Ver detalhes de ${item.nome}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}
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
    </Card>
  );
}

import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { unidadesList, type UnidadeStatus, type Rating } from "@/lib/mock-data/unidades";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { VinculosGraph } from "@/components/vinculos/VinculosGraph";

const STATUS_VARIANT: Record<UnidadeStatus, BadgeProps["variant"]> = {
  Ativo: "success",
  Inativo: "outline",
  Suspenso: "warning",
};

const RATING_VARIANT: Record<Rating, BadgeProps["variant"]> = {
  A: "success",
  B: "warning",
  C: "destructive",
};

const ESTADOS = Array.from(new Set(unidadesList.map((u) => u.estado))).sort();

const UnidadesLista = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros refletidos na URL (deep-link/compartilhável, volta funciona) —
  // mesma convenção de querystring já usada pelas rotas de ação dos alertas.
  const busca = searchParams.get("busca") ?? "";
  const estado = searchParams.get("estado") ?? "todos";
  const status = searchParams.get("status") ?? "todos";
  const rating = searchParams.get("rating") ?? "todos";
  const tab = searchParams.get("tab") === "mapa" ? "mapa" : "lista";

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
  };

  const setTab = (valor: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (valor === "lista") {
          next.delete("tab");
        } else {
          next.set("tab", valor);
        }
        return next;
      },
      { replace: true }
    );
  };

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".unidades-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    {
      selector: ".unidades-filtros",
      vars: { y: 16, opacity: 0, duration: 0.3 },
      position: "-=0.2",
    },
    {
      selector: ".unidades-tabela",
      vars: { y: 16, opacity: 0, duration: 0.35 },
      position: "-=0.2",
    },
    {
      selector: ".unidades-grafo",
      vars: { y: 16, opacity: 0, duration: 0.35 },
      position: "-=0.2",
    },
  ]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return unidadesList.filter((unidade) => {
      if (
        termo &&
        !unidade.nome.toLowerCase().includes(termo) &&
        !unidade.id.toLowerCase().includes(termo) &&
        !unidade.matricula.toLowerCase().includes(termo)
      ) {
        return false;
      }
      if (estado !== "todos" && unidade.estado !== estado) return false;
      if (status !== "todos" && unidade.status !== status) return false;
      if (rating !== "todos" && unidade.rating !== rating) return false;
      return true;
    });
  }, [busca, estado, status, rating]);

  const goToDetalhe = (id: string) => navigate(`/unidades/${id}`);

  return (
    <div ref={entranceRef} className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <PageHeader
          className="unidades-header"
          title="Unidades da Rede"
          subtitle={
            tab === "lista"
              ? "Gestão de lojas (Licenciado Lojista 3.5)"
              : "Conexões entre macrorregiões, unidades, PVs e consultores"
          }
          tabs={
            <TabsList>
              <TabsTrigger value="lista">Lista de Unidades</TabsTrigger>
              <TabsTrigger value="mapa">Mapa de Vínculos</TabsTrigger>
            </TabsList>
          }
        />

        <TabsContent value="mapa">
          <VinculosGraph />
        </TabsContent>

        <TabsContent value="lista" className="space-y-6">
          <Card className="unidades-filtros flex flex-wrap items-center gap-3 p-4">
            <div className="relative min-w-[220px] flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Buscar por nome ou código…"
                className="pl-9"
                value={busca}
                onChange={(event) => setFiltro("busca", event.target.value)}
                aria-label="Buscar unidade por nome ou código"
              />
            </div>

            <Select value={estado} onValueChange={(value) => setFiltro("estado", value)}>
              <SelectTrigger className="w-[160px]" aria-label="Filtrar por estado">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os estados</SelectItem>
                {ESTADOS.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(value) => setFiltro("status", value)}>
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

            <Select value={rating} onValueChange={(value) => setFiltro("rating", value)}>
              <SelectTrigger className="w-[140px]" aria-label="Filtrar por rating">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os ratings</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="unidades-tabela p-2">
            {filtradas.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-16 text-center">
                <p className="text-sm font-medium text-foreground">Nenhuma unidade encontrada</p>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar a busca ou os filtros aplicados.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Licenciado</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtradas.map((unidade) => (
                    <TableRow
                      key={unidade.id}
                      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      tabIndex={0}
                      onClick={() => goToDetalhe(unidade.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") goToDetalhe(unidade.id);
                      }}
                    >
                      <TableCell className="font-medium text-foreground">{unidade.matricula}</TableCell>
                      <TableCell>{unidade.nome}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {unidade.cidade}/{unidade.estado}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{unidade.dono}</TableCell>
                      <TableCell>
                        <Badge variant={RATING_VARIANT[unidade.rating]}>{unidade.rating}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[unidade.status]}>{unidade.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnidadesLista;

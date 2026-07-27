import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";

import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Carteira } from "@/lib/mock-data/unidades";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

interface CarteirasTableProps {
  carteiras: Carteira[];
}

export function CarteirasTable({ carteiras }: CarteirasTableProps) {
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  // Range values
  const maxClientes = useMemo(() => Math.max(...carteiras.map((c) => c.qtdClientes), 1), [carteiras]);
  const maxValor = useMemo(() => Math.max(...carteiras.map((c) => c.valor), 1), [carteiras]);

  const [clientesRange, setClientesRange] = useState<[number, number]>([0, maxClientes]);
  const [valorRange, setValorRange] = useState<[number, number]>([0, maxValor]);

  const clientesActive = clientesRange[0] > 0 || clientesRange[1] < maxClientes;
  const valorActive = valorRange[0] > 0 || valorRange[1] < maxValor;

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return carteiras.filter((c) => {
      if (termo && !c.cliente.toLowerCase().includes(termo) && !(c.consultor?.toLowerCase().includes(termo) ?? false) && !(c.pvMatricula?.toLowerCase().includes(termo) ?? false)) return false;
      if (statusFiltro !== "todos" && c.status !== statusFiltro) return false;
      if (c.qtdClientes < clientesRange[0] || c.qtdClientes > clientesRange[1]) return false;
      if (c.valor < valorRange[0] || c.valor > valorRange[1]) return false;
      return true;
    });
  }, [carteiras, busca, statusFiltro, clientesRange, valorRange]);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Briefcase}
        title="Carteiras"
        subtitle={`${carteiras.length} carteiras vinculadas`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar…"
                className="h-8 pl-9 text-xs"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar carteira"
              />
            </div>

            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="h-8 w-[110px] text-xs" aria-label="Status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Inativa">Inativa</SelectItem>
                <SelectItem value="Órfã">Órfã</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", clientesActive && "border-primary/50 text-primary")}>
                  <SlidersHorizontal className="h-3 w-3" />
                  Clientes
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-5" align="end">
                <div className="space-y-5">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Quantidade de clientes</Label>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Filtre pelo número de clientes na carteira</p>
                  </div>
                  <div className="px-2">
                    <Slider min={0} max={maxClientes} step={1} value={clientesRange} onValueChange={(v) => setClientesRange(v as [number, number])} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">{clientesRange[0]}</span>
                    <span className="text-[10px] text-muted-foreground">até</span>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">{clientesRange[1]}</span>
                  </div>
                  {clientesActive && <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setClientesRange([0, maxClientes])}>Limpar filtro</Button>}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", valorActive && "border-primary/50 text-primary")}>
                  <SlidersHorizontal className="h-3 w-3" />
                  Valor
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-5" align="end">
                <div className="space-y-5">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Tamanho da carteira</Label>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Filtre pelo valor total da carteira (R$)</p>
                  </div>
                  <div className="px-2">
                    <Slider min={0} max={maxValor} step={1000} value={valorRange} onValueChange={(v) => setValorRange(v as [number, number])} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">{currencyFormatter.format(valorRange[0])}</span>
                    <span className="text-[10px] text-muted-foreground">até</span>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">{currencyFormatter.format(valorRange[1])}</span>
                  </div>
                  {valorActive && <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setValorRange([0, maxValor])}>Limpar filtro</Button>}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        }
      />

      {/* Tabela */}
      {filtradas.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma carteira encontrada para os filtros selecionados.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>PV</TableHead>
              <TableHead className="text-right">Clientes</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Consultor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((carteira) => (
              <TableRow
                key={carteira.id}
                className={cn(
                  carteira.status === "Órfã" && "bg-destructive/[0.04]",
                  carteira.status === "Inativa" && "bg-muted/40"
                )}
              >
                <TableCell className="font-medium text-foreground">{carteira.id}</TableCell>
                <TableCell className="text-foreground">{carteira.cliente}</TableCell>
                <TableCell className="text-muted-foreground">{carteira.pvMatricula ?? "—"}</TableCell>
                <TableCell className="text-right text-muted-foreground">{carteira.qtdClientes}</TableCell>
                <TableCell className="text-right text-muted-foreground">{currencyFormatter.format(carteira.valor)}</TableCell>
                <TableCell className="text-muted-foreground">{carteira.consultor ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={carteira.status === "Ativa" ? "success" : carteira.status === "Órfã" ? "destructive" : "outline"}>
                    {carteira.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

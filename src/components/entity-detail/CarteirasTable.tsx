import { useMemo, useState } from "react";
import { Briefcase, Check, ChevronsUpDown } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Carteira } from "@/lib/mock-data/unidades";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

interface CarteirasTableProps {
  carteiras: Carteira[];
  subtitle: string;
}

/**
 * Aba/seção "Carteiras" (PRD-02 §3.3), com controles de filtro no cabeçalho
 * (toggle "somente órfãs" + filtro por PV em combobox com busca) ao lado do
 * título. Reutilizada por Unidade/PV/Consultor (PRD-04 §5).
 */
export function CarteirasTable({ carteiras, subtitle }: CarteirasTableProps) {
  const [somenteOrfas, setSomenteOrfas] = useState(false);
  const [pvFiltro, setPvFiltro] = useState<string | null>(null);
  const [pvPopoverOpen, setPvPopoverOpen] = useState(false);

  const pvOptions = useMemo(() => {
    const unicos = new Set(
      carteiras
        .map((c) => c.pvMatricula)
        .filter((matricula): matricula is string => matricula !== null)
    );
    return Array.from(unicos).sort();
  }, [carteiras]);

  const filtradas = carteiras.filter((c) => {
    if (somenteOrfas && !c.orfa) return false;
    if (pvFiltro && c.pvMatricula !== pvFiltro) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Briefcase}
        title="Carteiras"
        subtitle={subtitle}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Popover open={pvPopoverOpen} onOpenChange={setPvPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={pvPopoverOpen}
                  className="w-[180px] justify-between font-normal"
                >
                  <span className="truncate">
                    {pvFiltro ?? "Todos os PVs"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px]" align="end">
                <Command>
                  <CommandInput placeholder="Buscar PV..." />
                  <CommandList>
                    <CommandEmpty>Nenhum PV encontrado.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setPvFiltro(null);
                          setPvPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "h-3.5 w-3.5",
                            pvFiltro === null ? "opacity-100" : "opacity-0"
                          )}
                        />
                        Todos os PVs
                      </CommandItem>
                      {pvOptions.map((matricula) => (
                        <CommandItem
                          key={matricula}
                          value={matricula}
                          onSelect={() => {
                            setPvFiltro(matricula);
                            setPvPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "h-3.5 w-3.5",
                              pvFiltro === matricula ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {matricula}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              <Switch
                id="toggle-carteiras-orfas"
                checked={somenteOrfas}
                onCheckedChange={setSomenteOrfas}
              />
              <Label
                htmlFor="toggle-carteiras-orfas"
                className="cursor-pointer whitespace-nowrap font-normal text-muted-foreground"
              >
                Somente órfãs
              </Label>
            </div>
          </div>
        }
      />

      {filtradas.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {somenteOrfas || pvFiltro
            ? "Nenhuma carteira encontrada para os filtros selecionados."
            : "Nenhuma carteira associada."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>PV</TableHead>
              <TableHead>Qtd. Clientes</TableHead>
              <TableHead>Valor da Carteira</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Consultor Responsável</TableHead>
              <TableHead>Órfã</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((carteira) => (
              <TableRow key={carteira.id}>
                <TableCell className="font-medium text-foreground">
                  {carteira.id}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {carteira.pvMatricula ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{carteira.qtdClientes}</TableCell>
                <TableCell className="text-muted-foreground">
                  {currencyFormatter.format(carteira.valor)}
                </TableCell>
                <TableCell>
                  <Badge variant={carteira.status === "Ativa" ? "success" : "outline"}>
                    {carteira.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {carteira.consultor ?? "—"}
                </TableCell>
                <TableCell>
                  {carteira.orfa && <Badge variant="warning">Órfã</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

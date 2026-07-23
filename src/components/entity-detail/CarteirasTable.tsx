import { useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Carteira } from "@/lib/mock-data/unidades";

interface CarteirasTableProps {
  carteiras: Carteira[];
}

/**
 * Tabela de carteiras associadas (PRD-02 §3.3), com o toggle "exibir
 * apenas órfãs" filtrando o array local. Reutilizada por PV (PRD-04 §5).
 */
export function CarteirasTable({ carteiras }: CarteirasTableProps) {
  const [somenteOrfas, setSomenteOrfas] = useState(false);
  const filtradas = somenteOrfas ? carteiras.filter((c) => c.orfa) : carteiras;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          id="toggle-carteiras-orfas"
          checked={somenteOrfas}
          onCheckedChange={setSomenteOrfas}
        />
        <Label
          htmlFor="toggle-carteiras-orfas"
          className="cursor-pointer font-normal text-muted-foreground"
        >
          Exibir apenas carteiras órfãs
        </Label>
      </div>

      {filtradas.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {somenteOrfas
            ? "Nenhuma carteira órfã nesta unidade."
            : "Nenhuma carteira associada a esta unidade."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
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
                <TableCell>{carteira.cliente}</TableCell>
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

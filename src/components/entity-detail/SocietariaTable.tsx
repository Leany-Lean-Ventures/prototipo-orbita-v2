import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { SocietariaItem } from "@/lib/mock-data/unidades";

interface SocietariaTableProps {
  items: SocietariaItem[];
}

/** Aba Estrutura Societária — PRD-02 §3.3. Reutilizada por PV (PRD-04 §5). */
export function SocietariaTable({ items }: SocietariaTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Razão Social</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead className="text-right">% Participação</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.cnpj}>
            <TableCell className="font-medium text-foreground">{item.razao}</TableCell>
            <TableCell className="text-muted-foreground">{item.cnpj}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.papel}</Badge>
            </TableCell>
            <TableCell className="text-right">{item.pct}%</TableCell>
            <TableCell>
              <Badge variant={item.status === "Ativo" ? "success" : "outline"}>
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

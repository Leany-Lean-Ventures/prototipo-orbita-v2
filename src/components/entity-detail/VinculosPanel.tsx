import { useNavigate } from "react-router-dom";
import { Link2, Eye } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { VinculoItem } from "@/lib/mock-data/consultores";

interface VinculosPanelProps {
  vinculos: VinculoItem[];
}

/**
 * Aba "Vínculos" do consultor — matrículas e PVs associados ao CPF.
 */
export function VinculosPanel({ vinculos }: VinculosPanelProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <SectionHeader
        icon={Link2}
        title="Vínculos (Matrículas / PVs)"
        subtitle={`${vinculos.length} vínculo${vinculos.length !== 1 ? "s" : ""} registrado${vinculos.length !== 1 ? "s" : ""}`}
      />

      {vinculos.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum vínculo registrado.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PV / Unidade</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {vinculos.map((v) => (
              <TableRow key={`${v.pvId}-${v.inicio}`}>
                <TableCell className="font-medium text-foreground">{v.pv}</TableCell>
                <TableCell>
                  <Badge variant="outline">{v.papel}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{v.inicio}</TableCell>
                <TableCell>
                  <Badge variant={v.status === "Ativo" ? "success" : "outline"}>
                    {v.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {v.status === "Ativo" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        if (v.pvId.startsWith("PV-")) navigate(`/pvs/${v.pvId}`);
                        else navigate(`/unidades/${v.pvId}`);
                      }}
                      aria-label={`Ver ${v.pv}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

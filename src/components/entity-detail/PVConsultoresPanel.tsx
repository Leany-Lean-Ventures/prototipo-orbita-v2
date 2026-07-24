import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Search, Users, BriefcaseBusiness } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { ConsultorVinculado } from "@/lib/mock-data/unidades";

interface PVConsultoresPanelProps {
  consultores: ConsultorVinculado[];
}

/**
 * Aba "Consultores" para a página de PV — lista simplificada (sem filtro de
 * tipo, pois só mostra consultores vinculados ao PV).
 * Reutiliza a mesma estrutura visual do CorpoVendasPanel.
 */
export function PVConsultoresPanel({ consultores }: PVConsultoresPanelProps) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return consultores;
    return consultores.filter(
      (c) => c.nome.toLowerCase().includes(termo) || c.nivel.toLowerCase().includes(termo)
    );
  }, [consultores, busca]);

  return (
    <Card className="p-6">
      <SectionHeader
        icon={Users}
        title="Consultores Vinculados"
        subtitle={`${consultores.length} consultores atuando neste PV`}
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou nível…"
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar consultor"
          />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum consultor encontrado.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Carteiras</TableHead>
              <TableHead className="text-right">Faturamento</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((c) => (
              <TableRow key={c.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
                      <BriefcaseBusiness className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="font-medium text-foreground">{c.nome}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.nivel}</TableCell>
                <TableCell className="text-right text-muted-foreground">{c.carteiraQtd}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {c.faturamento
                    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(c.faturamento)
                    : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(`/consultores/${c.id}`)}
                    aria-label={`Ver detalhes de ${c.nome}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

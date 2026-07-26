import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Play, Clock, CheckCircle2 } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { tiposRelatorio, type TipoRelatorio, type FiltroRelatorio } from "@/lib/mock-data/relatorios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

type FormatoExport = "excel" | "pdf";
type StatusRelatorio = "processando" | "concluido";

interface RelatorioGerado {
  id: string;
  tipoId: string;
  titulo: string;
  formato: FormatoExport;
  status: StatusRelatorio;
  solicitadoEm: string;
}

// Pre-seeded generated reports
const RELATORIOS_INICIAIS: RelatorioGerado[] = [
  { id: "RG-001", tipoId: "R01", titulo: "Consultores Inativos", formato: "excel", status: "concluido", solicitadoEm: "26/07/2026 09:15" },
  { id: "RG-002", tipoId: "R04", titulo: "Penalidades Ativas", formato: "pdf", status: "concluido", solicitadoEm: "25/07/2026 14:30" },
  { id: "RG-003", tipoId: "R02", titulo: "Carteiras Órfãs", formato: "excel", status: "processando", solicitadoEm: "26/07/2026 10:42" },
];

const RelatoriosPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoRelatorio | null>(null);
  const [formato, setFormato] = useState<FormatoExport>("excel");
  const [filtroValues, setFiltroValues] = useState<Record<string, string>>({});
  const [gerados, setGerados] = useState<RelatorioGerado[]>(RELATORIOS_INICIAIS);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".rel-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".rel-tabs", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
  ]);

  const handleOpenModal = (tipo: TipoRelatorio) => {
    setSelectedTipo(tipo);
    setFormato("excel");
    setFiltroValues({});
    setModalOpen(true);
  };

  const handleGerar = () => {
    if (!selectedTipo) return;
    const novo: RelatorioGerado = {
      id: `RG-${String(gerados.length + 1).padStart(3, "0")}`,
      tipoId: selectedTipo.id,
      titulo: selectedTipo.titulo,
      formato,
      status: "processando",
      solicitadoEm: new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    setGerados((prev) => [novo, ...prev]);
    setModalOpen(false);
    // Simulate processing → done after 3s
    setTimeout(() => {
      setGerados((prev) => prev.map((r) => r.id === novo.id ? { ...r, status: "concluido" as StatusRelatorio } : r));
    }, 3000);
  };

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="rel-header"
        title="Central de Relatórios"
        subtitle="Extração de dados consolidados e visões gerenciais"
      />

      <Tabs defaultValue="tipos" className="rel-tabs">
        <TabsList variant="secondary">
          <TabsTrigger value="tipos">
            <FileText className="h-4 w-4" />
            Tipos de relatórios
          </TabsTrigger>
          <TabsTrigger value="gerados">
            <Download className="h-4 w-4" />
            Relatórios gerados
            {gerados.length > 0 && (
              <Badge variant="outline" className="ml-1.5 text-[10px]">{gerados.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Grid de tipos */}
        <TabsContent value="tipos">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiposRelatorio.map((tipo) => {
              const Icon = tipo.icon;
              return (
                <Card
                  key={tipo.id}
                  interactive
                  onClick={() => handleOpenModal(tipo)}
                  className="relative flex flex-col gap-3 overflow-hidden p-5"
                >
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full" style={{ background: `linear-gradient(135deg, ${tipo.color}22, ${tipo.color}08)` }} />
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${tipo.color}, ${tipo.color}cc)` }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tipo.titulo}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{tipo.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tipo.filtros.slice(0, 3).map((f) => (
                      <Badge key={f.name} variant="outline" className="text-[10px]">{f.label}</Badge>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Lista de gerados */}
        <TabsContent value="gerados">
          <Card className="p-2">
            {gerados.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-16 text-center">
                <p className="text-sm font-medium text-foreground">Nenhum relatório gerado</p>
                <p className="text-sm text-muted-foreground">Selecione um tipo de relatório para começar.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Relatório</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead>Solicitado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gerados.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-foreground">{r.titulo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          {r.formato === "excel" ? <FileSpreadsheet className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                          {r.formato === "excel" ? "Excel" : "PDF"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.solicitadoEm}</TableCell>
                      <TableCell>
                        {r.status === "processando" ? (
                          <Badge variant="warning" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Processando
                          </Badge>
                        ) : (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Concluído
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {r.status === "concluido" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de parametrização */}
      {selectedTipo && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {(() => { const I = selectedTipo.icon; return <I className="h-5 w-5 text-primary" />; })()}
                {selectedTipo.titulo}
              </DialogTitle>
              <DialogDescription>Configure os filtros e o formato de exportação.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {selectedTipo.filtros.map((filtro) => (
                <div key={filtro.name} className="space-y-1.5">
                  {filtro.type === "checkbox" ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Switch
                        checked={filtroValues[filtro.name] === "true"}
                        onCheckedChange={(v) => setFiltroValues((p) => ({ ...p, [filtro.name]: v ? "true" : "false" }))}
                      />
                      <Label>{filtro.label}</Label>
                    </div>
                  ) : (
                    <>
                      <Label>{filtro.label}</Label>
                      <Select
                        value={filtroValues[filtro.name] ?? ""}
                        onValueChange={(v) => setFiltroValues((p) => ({ ...p, [filtro.name]: v }))}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {filtro.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              ))}

              {/* Formato de exportação */}
              <div className="space-y-1.5">
                <Label>Formato de exportação</Label>
                <Select value={formato} onValueChange={(v) => setFormato(v as FormatoExport)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">
                      <span className="flex items-center gap-2"><FileSpreadsheet className="h-3.5 w-3.5" />Excel (.xlsx)</span>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" />PDF</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleGerar} className="gap-1.5">
                <Play className="h-4 w-4" />
                Gerar relatório
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RelatoriosPage;

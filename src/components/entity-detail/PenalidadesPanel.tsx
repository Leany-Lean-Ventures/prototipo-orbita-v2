import { useNavigate } from "react-router-dom";
import { Store, BriefcaseBusiness, ShieldAlert, ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export interface PenalidadeTransferencia {
  id: string;
  lojaOrigem: { id: string; nome: string; matricula: string; cidade: string; estado: string };
  consultor: { id: string; razaoSocial: string; matricula: string; cnpj: string };
  valorMensal: number;
  parcelasPagas: number;
  totalParcelas: number;
}

interface PenalidadesPanelProps {
  penalidades: PenalidadeTransferencia[];
}

// Mock data inline para popular diversas unidades
export const PENALIDADES_MOCK: PenalidadeTransferencia[] = [
  { id: "PEN-001", lojaOrigem: { id: "L001", nome: "SP-Centro", matricula: "M-10001", cidade: "São Paulo", estado: "SP" }, consultor: { id: "C005", razaoSocial: "FL Participações ME", matricula: "M-30005", cnpj: "55.234.567/0001-02" }, valorMensal: 1200, parcelasPagas: 8, totalParcelas: 24 },
  { id: "PEN-002", lojaOrigem: { id: "L001", nome: "SP-Centro", matricula: "M-10001", cidade: "São Paulo", estado: "SP" }, consultor: { id: "C006", razaoSocial: "RC Consórcios ME", matricula: "M-30006", cnpj: "55.456.789/0001-04" }, valorMensal: 950, parcelasPagas: 15, totalParcelas: 24 },
  { id: "PEN-003", lojaOrigem: { id: "L002", nome: "Campinas", matricula: "M-10002", cidade: "Campinas", estado: "SP" }, consultor: { id: "C009", razaoSocial: "CR Consórcios Ltda", matricula: "M-30009", cnpj: "55.890.123/0001-09" }, valorMensal: 1500, parcelasPagas: 3, totalParcelas: 24 },
  { id: "PEN-004", lojaOrigem: { id: "L003", nome: "Curitiba-Norte", matricula: "M-10003", cidade: "Curitiba", estado: "PR" }, consultor: { id: "C020", razaoSocial: "RL Negócios Ltda", matricula: "M-30020", cnpj: "57.100.200/0001-20" }, valorMensal: 800, parcelasPagas: 20, totalParcelas: 24 },
  { id: "PEN-005", lojaOrigem: { id: "L001", nome: "SP-Centro", matricula: "M-10001", cidade: "São Paulo", estado: "SP" }, consultor: { id: "C003", razaoSocial: "BS Investimentos Ltda", matricula: "M-30003", cnpj: "55.345.678/0001-03" }, valorMensal: 1100, parcelasPagas: 12, totalParcelas: 24 },
  { id: "PEN-006", lojaOrigem: { id: "L004", nome: "RJ-Barra", matricula: "M-10004", cidade: "Rio de Janeiro", estado: "RJ" }, consultor: { id: "C030", razaoSocial: "GR Participações Ltda", matricula: "M-30030", cnpj: "58.100.200/0001-30" }, valorMensal: 700, parcelasPagas: 6, totalParcelas: 24 },
  { id: "PEN-007", lojaOrigem: { id: "L002", nome: "Campinas", matricula: "M-10002", cidade: "Campinas", estado: "SP" }, consultor: { id: "C010", razaoSocial: "LM Participações ME", matricula: "M-30010", cnpj: "55.901.234/0001-10" }, valorMensal: 1350, parcelasPagas: 18, totalParcelas: 24 },
  { id: "PEN-008", lojaOrigem: { id: "L005", nome: "BH-Savassi", matricula: "M-10005", cidade: "Belo Horizonte", estado: "MG" }, consultor: { id: "C040", razaoSocial: "PG Consórcios ME", matricula: "M-30040", cnpj: "59.100.200/0001-40" }, valorMensal: 600, parcelasPagas: 22, totalParcelas: 24 },
];

/**
 * Tab "Penalidades" — cards de penalidades de transferência com dados de
 * loja de origem, consultor transferido, valor mensal, parcelas e progresso.
 */
export function PenalidadesPanel({ penalidades }: PenalidadesPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionHeader
          icon={ShieldAlert}
          title="Penalidades de transferência"
          subtitle={`${penalidades.length} penalidade${penalidades.length !== 1 ? "s" : ""} ativas`}
        />

        {penalidades.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <ShieldAlert className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhuma penalidade ativa</p>
            <p className="text-sm text-muted-foreground">Esta unidade está em conformidade.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {penalidades.map((p) => {
              const progresso = Math.round((p.parcelasPagas / p.totalParcelas) * 100);
              const valorTotalPago = p.valorMensal * p.parcelasPagas;

              return (
                <div key={p.id} className="flex items-stretch gap-5 rounded-2xl border border-border bg-muted/30 p-5">
                  {/* Esquerda: Loja + Consultor lado a lado, dividindo o espaço igualmente */}
                  <div className="flex min-w-0 flex-[3] gap-3">
                    <button
                      onClick={() => navigate(`/unidades/${p.lojaOrigem.id}`)}
                      className="flex flex-1 items-center gap-2.5 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Loja de origem</p>
                        <p className="truncate text-xs font-medium text-foreground">{p.lojaOrigem.nome}</p>
                        <p className="truncate text-[10px] text-muted-foreground">{p.lojaOrigem.matricula} · {p.lojaOrigem.cidade}/{p.lojaOrigem.estado}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>

                    <button
                      onClick={() => navigate(`/consultores/${p.consultor.id}`)}
                      className="flex flex-1 items-center gap-2.5 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                        <BriefcaseBusiness className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Consultor transferido</p>
                        <p className="truncate text-xs font-medium text-foreground">{p.consultor.razaoSocial}</p>
                        <p className="truncate text-[10px] text-muted-foreground">{p.consultor.matricula} · {p.consultor.cnpj}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Separador visual */}
                  <div className="w-px shrink-0 self-stretch bg-border" />

                  {/* Direita: Valor + progresso, distribuído por toda a altura da linha */}
                  <div className="flex min-w-[200px] flex-[2] flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Mensal</p>
                        <p className="font-display text-lg font-bold text-destructive">{currencyFormatter.format(p.valorMensal)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Total pago</p>
                        <p className="font-display text-lg font-bold text-foreground">{currencyFormatter.format(valorTotalPago)}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Progress value={progresso} className="h-2" />
                      <p className="text-center text-[10px] text-muted-foreground">
                        {p.parcelasPagas} de {p.totalParcelas} parcelas pagas
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

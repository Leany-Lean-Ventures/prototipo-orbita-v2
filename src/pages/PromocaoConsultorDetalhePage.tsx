import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Building2,
  Gavel,
  FileSignature,
  CheckCircle2,
  Calendar,
  Clock,
  BriefcaseBusiness,
  AlertTriangle,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { cn } from "@/lib/utils";
import {
  getRegistroPromocao,
  getEtapaPromocaoConfig,
  diasEmProcessoPromocao,
  STATUS_PROMOCAO_LABEL,
  STATUS_PROMOCAO_COLOR,
  NIVEIS_LABEL,
  ETAPAS_PROMOCAO,
  CANAL_LABEL,
} from "@/lib/mock-data/esteira-promocao-consultores";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

function formatDateBR(iso?: string | null): string {
  if (!iso) return "—";
  if (iso.includes("/")) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function Fact({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function BooleanFact({ label, value }: { label: string; value?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm text-foreground">
      {value ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />}
      {label}
    </div>
  );
}

function PendenteHint({ etapaNome }: { etapaNome: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
      Ainda não preenchido — aguardando o registro chegar à etapa "{etapaNome}".
    </p>
  );
}

const PromocaoConsultorDetalhePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const registro = id ? getRegistroPromocao(id) : undefined;

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".rpc-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".rpc-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".rpc-grid", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  if (!id || !registro) {
    return <Navigate to="/esteira/promocao-consultores" replace />;
  }

  const idxAtual = ETAPAS_PROMOCAO.findIndex((e) => e.id === registro.etapaAtual);
  const passou = (etapa: string) => idxAtual >= ETAPAS_PROMOCAO.findIndex((e) => e.id === etapa);

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button variant="ghost" size="sm" className="rpc-voltar -ml-2 gap-1.5 text-muted-foreground" onClick={() => navigate("/esteira/promocao-consultores")}>
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Kanban
      </Button>

      <div className="rpc-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{registro.consultorNome}</h1>
            <Badge variant="outline" style={{ borderColor: `${STATUS_PROMOCAO_COLOR[registro.status]}55`, color: STATUS_PROMOCAO_COLOR[registro.status] }}>
              {STATUS_PROMOCAO_LABEL[registro.status]}
            </Badge>
            {registro.emAtraso && (
              <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
                <AlertTriangle className="h-3 w-3" />
                Em atraso
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {registro.razaoSocial} — {NIVEIS_LABEL[registro.nivelAtual].nome} → {NIVEIS_LABEL[registro.nivelAlvo].nome} — etapa atual: {getEtapaPromocaoConfig(registro.etapaAtual).nome}
          </p>
        </div>
      </div>

      <div className="rpc-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          {/* Bloco A — Solicitação */}
          <Card className="p-6">
            <SectionHeader icon={User} title="1. Solicitação" subtitle="Dados iniciais do pedido de promoção" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Fact icon={User} label="Consultor" value={registro.consultorNome} />
              <Fact icon={BriefcaseBusiness} label="Razão social" value={registro.razaoSocial} />
              <Fact icon={BriefcaseBusiness} label="Matrícula" value={registro.matricula} />
              <Fact icon={ShieldCheck} label="Nível atual" value={`${NIVEIS_LABEL[registro.nivelAtual].nome} (${NIVEIS_LABEL[registro.nivelAtual].comissao})`} />
              <Fact icon={ShieldCheck} label="Nível-alvo" value={`${NIVEIS_LABEL[registro.nivelAlvo].nome} (${NIVEIS_LABEL[registro.nivelAlvo].comissao})`} />
              <Fact icon={Building2} label="Loja de origem" value={registro.lojaOrigem} />
              <Fact icon={Calendar} label="Tipo de movimento" value={registro.tipoMovimento === "promocao" ? "Promoção" : registro.tipoMovimento === "troca_de_contrato" ? "Troca de contrato" : "Convite sócio"} />
              <Fact icon={Calendar} label="Canal" value={CANAL_LABEL[registro.canalOrigem]} />
            </div>
            {registro.teraEquipeAbaixo && <BooleanFact label="Terá equipe abaixo após a promoção" value={true} />}
          </Card>

          {/* Bloco B — Validação */}
          <Card className="space-y-3 p-6">
            <SectionHeader icon={ShieldCheck} title="2. Validação: plano × trajetória × score" subtitle="Critérios do nível-alvo do plano da loja" />
            {!passou("VALIDACAO") ? (
              <PendenteHint etapaNome="Validação" />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Fact icon={Clock} label="Tempo de casa" value={`${registro.tempoCasaMeses ?? "—"} meses`} />
                <Fact icon={BriefcaseBusiness} label="Volume vendas/mês" value={registro.volumeVendasMensal ? `R$ ${registro.volumeVendasMensal.toLocaleString("pt-BR")}` : "—"} />
                <Fact icon={ShieldCheck} label="Retenção" value={`${registro.retencaoPercentual ?? "—"}%`} />
                <Fact icon={ShieldCheck} label="Score do consultor" value={`${registro.scoreConsultor ?? "—"} pts`} />
              </div>
            )}
          </Card>

          {/* Bloco C — Estrutura PV */}
          <Card className="space-y-3 p-6">
            <SectionHeader icon={Building2} title="3. Estrutura de PV na origem" subtitle="Cadeia de categoria por matrícula" />
            {!passou("ESTRUTURA_PV") ? (
              <PendenteHint etapaNome="Estrutura de PV" />
            ) : (
              <div className="space-y-2">
                <BooleanFact label="Cadeia do PV declarada (categoria por matrícula)" value={registro.cadeiaPVDeclarada} />
                <BooleanFact label="Monotonicidade validada (todo nível ≥ o de baixo)" value={registro.monotonicidadeOk} />
              </div>
            )}
          </Card>

          {/* Bloco D — Deliberação */}
          <Card className="space-y-3 p-6">
            <SectionHeader icon={Gavel} title="4. Deliberação / aprovação" subtitle="Decisão da autoridade competente" />
            {!passou("DELIBERACAO") ? (
              <PendenteHint etapaNome="Deliberação" />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={User} label="Autoridade aprovadora" value={registro.autoridadeAprovadora ?? "—"} />
                  <Fact icon={Calendar} label="Data da deliberação" value={formatDateBR(registro.dataDeliberacao)} />
                  <Fact icon={registro.decisao === "reprovado" ? AlertTriangle : CheckCircle2} label="Decisão" value={registro.decisao === "aprovado" ? "Aprovado" : registro.decisao === "reprovado" ? "Reprovado" : "Ajuste solicitado"} />
                </div>
                {registro.justificativa && <p className="text-sm leading-relaxed text-foreground">{registro.justificativa}</p>}
              </>
            )}
          </Card>

          {/* Bloco E — Efetivação */}
          <Card className="space-y-3 p-6">
            <SectionHeader icon={FileSignature} title="5. Efetivação" subtitle="Escrita governada + janela mensal (dia 13 → 21)" />
            {!passou("EFETIVACAO") ? (
              <PendenteHint etapaNome="Efetivação" />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={Calendar} label="Janela de efetivação" value={registro.janelaEfetivacao ?? "—"} />
                  <Fact icon={Calendar} label="Data de vigência" value={registro.dataVigencia ?? "—"} />
                </div>
                <BooleanFact label="Gravação S-SIS-2 OK" value={registro.gravacaoSis2Ok} />
                <BooleanFact label="Contrato aditivo assinado" value={registro.aditivoAssinado} />
              </>
            )}
          </Card>

          {/* Bloco F — Vigente */}
          <Card className="space-y-3 p-6">
            <SectionHeader icon={CheckCircle2} title="6. Nova categoria vigente" subtitle="Promoção efetivada" />
            {!passou("VIGENTE") ? (
              <PendenteHint etapaNome="Vigente" />
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="text-sm font-medium text-foreground">
                  Promoção vigente — {NIVEIS_LABEL[registro.nivelAlvo].nome} ({NIVEIS_LABEL[registro.nivelAlvo].comissao}) desde {registro.dataVigencia ?? "—"}.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar — Resumo + Histórico */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="p-6">
            <SectionHeader icon={Clock} title="Resumo" subtitle="Prazo e responsável" />
            <div className="space-y-4">
              <Fact icon={User} label="Responsável atual" value={registro.responsavelAtual} />
              <Fact icon={Calendar} label="Prazo da etapa" value={formatDateBR(registro.prazoEtapa)} />
              <Fact icon={Clock} label="Dias em processo" value={`${diasEmProcessoPromocao(registro)} dias`} />
            </div>
          </Card>

          <Card className={cn("p-6", registro.emAtraso && "border-destructive/30")}>
            <SectionHeader icon={Clock} title="Histórico" subtitle="Trajetória pelas etapas" />
            <div className="relative space-y-4">
              <div className="absolute bottom-2 left-[15px] top-2 w-px bg-border" aria-hidden="true" />
              {registro.historico.map((h) => (
                <div key={`${h.etapa}-${h.entrouEm}`} className="relative flex items-start gap-3">
                  <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card", h.saiuEm ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
                    {h.saiuEm ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-[13px] font-medium text-foreground">{getEtapaPromocaoConfig(h.etapa).nome}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                      {h.saiuEm
                        ? `Concluída em ${formatDateBR(h.saiuEm)} — ${h.responsavel}${h.decisao ? ` (${h.decisao})` : ""}`
                        : `Em andamento desde ${formatDateBR(h.entrouEm)} — ${h.responsavel}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default PromocaoConsultorDetalhePage;

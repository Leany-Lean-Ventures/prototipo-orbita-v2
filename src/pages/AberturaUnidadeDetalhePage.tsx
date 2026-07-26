import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Briefcase,
  Users,
  FolderCheck,
  FileSignature,
  HardHat,
  PartyPopper,
  Calendar,
  User,
  MapPin,
  Store,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { cn } from "@/lib/utils";
import {
  getRegistroAbertura,
  getEtapaConfig,
  diasEmProcesso,
  STATUS_LABEL,
  STATUS_COLOR,
  CANAL_LABEL,
  ETAPAS_ABERTURA,
} from "@/lib/mock-data/esteira-abertura-unidades";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

function formatDateBR(iso?: string | null): string {
  if (!iso) return "—";
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
      {value ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> : <XCircle className="h-4 w-4 shrink-0 text-destructive" />}
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

const AberturaUnidadeDetalhePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const registro = id ? getRegistroAbertura(id) : undefined;

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".rau-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".rau-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".rau-grid", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  if (!id || !registro) {
    return <Navigate to="/esteira/abertura-unidades" replace />;
  }

  const idxAtual = ETAPAS_ABERTURA.findIndex((e) => e.id === registro.etapaAtual);
  const passou = (etapa: string) => idxAtual >= ETAPAS_ABERTURA.findIndex((e) => e.id === etapa);

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="rau-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/esteira/abertura-unidades")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Kanban
      </Button>

      <div className="rau-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{registro.licenciadoNome}</h1>
            <Badge
              variant="outline"
              style={{ borderColor: `${STATUS_COLOR[registro.status]}55`, color: STATUS_COLOR[registro.status] }}
            >
              {STATUS_LABEL[registro.status]}
            </Badge>
            {registro.emAtraso && (
              <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
                <AlertTriangle className="h-3 w-3" />
                Em atraso
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Solicitação de abertura em {registro.cidadeAlvo}/{registro.uf} — etapa atual: {getEtapaConfig(registro.etapaAtual).nome}
          </p>
        </div>
      </div>

      <div className="rau-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          <Card className="p-6">
            <SectionHeader icon={FileText} title="1. Solicitação" subtitle="Dados iniciais do pedido de abertura" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Fact icon={User} label="Licenciado solicitante" value={registro.licenciadoNome} />
              <Fact icon={Store} label="Loja de origem" value={registro.lojaOrigem} />
              <Fact icon={MapPin} label="Cidade-alvo" value={`${registro.cidadeAlvo}/${registro.uf}`} />
              <Fact icon={Phone} label="Canal de origem" value={CANAL_LABEL[registro.canalOrigem]} />
              <Fact icon={Calendar} label="Data da solicitação" value={formatDateBR(registro.dataSolicitacao)} />
            </div>
            {registro.observacoesIniciais && (
              <p className="mt-4 text-sm leading-relaxed text-foreground">{registro.observacoesIniciais}</p>
            )}
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={ShieldCheck} title="2. Filtro de elegibilidade" subtitle="Desempenho, conformidade e disponibilidade da cidade" />
            {!passou("ELEGIBILIDADE") ? (
              <PendenteHint etapaNome="Filtro de elegibilidade" />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={ShieldCheck} label="Desempenho comprovado" value={`${registro.desempenhoPercentual}%`} />
                  <Fact icon={MapPin} label="Cidade disponível" value={registro.cidadeDisponivel === "sim" ? "Sim" : "Não"} />
                </div>
                <BooleanFact label="Conformidade contratual validada" value={registro.conformidadeContratual} />
                {registro.parecerElegibilidade && <p className="text-sm leading-relaxed text-foreground">{registro.parecerElegibilidade}</p>}
              </>
            )}
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Briefcase} title="3. Plano de negócio" subtitle="Projeção de faturamento e perfil da cidade" />
            {!passou("PLANO_NEGOCIO") ? (
              <PendenteHint etapaNome="Plano de negócio" />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact
                    icon={Briefcase}
                    label="Projeção de faturamento"
                    value={registro.projecaoFaturamento?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "—"}
                  />
                  <Fact icon={Users} label="Equipe estimada" value={`${registro.equipeEstimada ?? "—"} pessoas`} />
                  <Fact icon={FileText} label="Plano anexado" value={registro.planoNegocioArquivo ?? "—"} />
                </div>
                {registro.perfilCidade && <p className="text-sm leading-relaxed text-foreground">{registro.perfilCidade}</p>}
              </>
            )}
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Users} title="4. Comitê de expansão" subtitle="Decisão, score e participantes da reunião" />
            {!passou("COMITE") ? (
              <PendenteHint etapaNome="Comitê de expansão" />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={Calendar} label="Data da reunião" value={formatDateBR(registro.dataReuniaoComite)} />
                  <Fact icon={Users} label="Score do comitê" value={`${registro.scoreComite ?? "—"}/100`} />
                  <Fact
                    icon={registro.decisaoComite === "reprovado" ? XCircle : CheckCircle2}
                    label="Decisão"
                    value={
                      registro.decisaoComite === "aprovado" ? "Aprovado" : registro.decisaoComite === "reprovado" ? "Reprovado" : "Ajuste solicitado"
                    }
                  />
                </div>
                {registro.participantesComite && (
                  <p className="text-xs text-muted-foreground">Participantes: {registro.participantesComite.join(", ")}</p>
                )}
                {registro.justificativaComite && <p className="text-sm leading-relaxed text-foreground">{registro.justificativaComite}</p>}
              </>
            )}
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={FolderCheck} title="5. Documentação" subtitle="Checklist documental da abertura" />
            {!passou("DOCUMENTACAO") ? (
              <PendenteHint etapaNome="Aprovação e coleta de documentos" />
            ) : (
              <div className="divide-y divide-border">
                {registro.checklistDocumentos?.map((doc) => (
                  <div key={doc.item} className="flex items-center justify-between gap-4 py-2.5">
                    <p className="text-sm text-foreground">{doc.item}</p>
                    <Badge variant={doc.status === "validado" ? "success" : doc.status === "recebido" ? "outline" : "outline"} className="whitespace-nowrap capitalize">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={FileSignature} title="6. Contrato e dados bancários" subtitle="Assinatura e conta para repasses" />
            {!passou("CONTRATO") ? (
              <PendenteHint etapaNome="Contrato e dados bancários" />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={FileSignature} label="Status da assinatura" value={registro.statusAssinatura === "assinado" ? "Assinado" : "Em assinatura"} />
                  <Fact icon={Briefcase} label="Banco" value={registro.banco ?? "—"} />
                  <Fact icon={Briefcase} label="Agência / Conta" value={`${registro.agencia ?? "—"} / ${registro.conta ?? "—"}`} />
                </div>
                <BooleanFact label="Aceite da cláusula de penalty (0,5% por até 24 meses)" value={registro.aceitePenalty} />
              </>
            )}
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={HardHat} title="7. Obra" subtitle="Planejamento e execução do ponto físico" />
            {!passou("OBRA") ? (
              <PendenteHint etapaNome="Planejamento e execução da obra" />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={Calendar} label="Início da obra" value={formatDateBR(registro.dataInicioObra)} />
                  <Fact icon={Calendar} label="Prazo previsto" value={formatDateBR(registro.prazoPrevistoObra)} />
                  <Fact icon={HardHat} label="Andamento" value={`${registro.andamentoObra ?? 0}%`} />
                </div>
                {registro.extrapolacaoPrazo === "sim" && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm text-foreground">{registro.motivoExtrapolacao}</p>
                  </div>
                )}
              </>
            )}
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={PartyPopper} title="8. Abertura e funcionamento" subtitle="Ativação final da unidade" />
            {!passou("ABERTURA") || !registro.dataAbertura ? (
              <PendenteHint etapaNome="Abertura e funcionamento" />
            ) : (
              <>
                <Fact icon={Calendar} label="Data de abertura" value={formatDateBR(registro.dataAbertura)} />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <BooleanFact label="E-mail corporativo criado" value={registro.emailCorporativoCriado} />
                  <BooleanFact label="Publicado no site" value={registro.publicacaoSite} />
                  <BooleanFact label="Meta definida" value={registro.metaDefinida} />
                  <BooleanFact label="Território bloqueado p/ prévias externas" value={registro.territorioBloqueado} />
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Resumo lateral */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="p-6">
            <SectionHeader icon={Clock} title="Resumo" subtitle="Prazo e responsável da etapa atual" />
            <div className="space-y-4">
              <Fact icon={User} label="Responsável atual" value={registro.responsavelAtual} />
              <Fact icon={Calendar} label="Prazo da etapa" value={formatDateBR(registro.prazoEtapa)} />
              <Fact icon={Clock} label="Dias em processo" value={`${diasEmProcesso(registro)} dias`} />
            </div>
          </Card>

          <Card className={cn("p-6", registro.emAtraso && "border-destructive/30")}>
            <SectionHeader icon={Clock} title="Histórico" subtitle="Trajetória do registro pelas etapas" />
            <div className="relative space-y-4">
              <div className="absolute bottom-2 left-[15px] top-2 w-px bg-border" aria-hidden="true" />
              {registro.historico.map((h) => (
                <div key={`${h.etapa}-${h.entrouEm}`} className="relative flex items-start gap-3">
                  <span
                    className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                      h.saiuEm ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    )}
                  >
                    {h.saiuEm ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-[13px] font-medium text-foreground">{getEtapaConfig(h.etapa).nome}</p>
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

export default AberturaUnidadeDetalhePage;

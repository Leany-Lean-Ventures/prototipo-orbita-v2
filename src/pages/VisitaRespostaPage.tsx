import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Briefcase,
  UserPlus,
  Rocket,
  Users,
  LineChart,
  Headset,
  UserCog,
  Smartphone,
  Star,
  Camera,
  NotebookPen,
  CheckCircle2,
  XCircle,
  Lock,
  ExternalLink,
  FileStack,
  Calendar,
  User,
  MapPin,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { cn } from "@/lib/utils";
import { getVisitaDetalhe, AMBIENTES_COMUNICACAO_VISUAL, type ChecklistResposta } from "@/lib/mock-data/visitas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

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

function RespostaSimNao({ label, value }: { label: string; value: ChecklistResposta }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border px-3 py-2">
      {value === "Sim" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      )}
      <div className="min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-xs font-medium text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function RespostaTexto({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm leading-relaxed text-foreground">{value || "—"}</p>
    </div>
  );
}

const VisitaRespostaPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const visita = id ? getVisitaDetalhe(id) : undefined;

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".resp-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".resp-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".resp-grid", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  if (!id || !visita) {
    return <Navigate to="/visitas" replace />;
  }

  const { checklist } = visita;
  const ambientesFotografados = AMBIENTES_COMUNICACAO_VISUAL.filter((a) => checklist.comunicacaoVisual[a.key] > 0).length;

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="resp-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/visitas")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a lista de visitas
      </Button>

      <div className="resp-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Respostas da Visita</h1>
            <Badge variant="outline" className="gap-1.5">
              <FileStack className="h-3 w-3" />
              Modelo: {visita.modeloUsado}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {visita.unidadeNome} — checklist aplicado em {visita.dataVisitaFormatada}
          </p>
        </div>
      </div>

      <div className="resp-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          <Card className="p-6">
            <SectionHeader icon={ClipboardList} title="Identificação da visita" subtitle="Loja, responsável e data de aplicação do checklist" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Fact icon={MapPin} label="Loja" value={visita.unidadeNome} />
              <Fact icon={User} label="Licenciado ou gestor" value={visita.licenciadoGestor} />
              <Fact icon={Calendar} label="Data da aplicação" value={visita.dataVisitaFormatada} />
              <Fact icon={ClipboardList} label="Tipo de visita" value={visita.tipo} />
              <Fact icon={User} label="Responsável pela visita" value={visita.responsavelVisita} />
            </div>
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Briefcase} title="1. Plano de carreiras" subtitle="Formalização e divulgação ao front da loja" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <RespostaSimNao label="Status" value={checklist.planoCarreiras.status} />
              <RespostaSimNao label="Formalizado para o front (e-mail)?" value={checklist.planoCarreiras.formalizadoFront} />
            </div>
            <RespostaTexto label="Comprovação de divulgação na loja" value={checklist.planoCarreiras.comprovacao} />
            <RespostaTexto label="Observações" value={checklist.planoCarreiras.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={UserPlus} title="2. Processo de contratação e periodicidade" subtitle="Existência de um processo estruturado" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <RespostaSimNao label="Status" value={checklist.processoContratacao.status} />
              <RespostaSimNao label="Existe um processo periódico?" value={checklist.processoContratacao.processoPeriodico} />
            </div>
            <RespostaTexto label="Observações" value={checklist.processoContratacao.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Rocket} title="3. Acelerador Ademicon" subtitle="Candidatos recebidos e treinamento da plataforma" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <RespostaSimNao label="Status" value={checklist.aceleradorAdemicon.status} />
              <RespostaSimNao label="Treinamento plataforma, playbook e dashboard" value={checklist.aceleradorAdemicon.treinamentoPlataforma} />
            </div>
            <RespostaTexto label="Quem é o focal da loja?" value={checklist.aceleradorAdemicon.focal} />
            <RespostaTexto label="Observações" value={checklist.aceleradorAdemicon.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Users} title="4. Multiplicador" subtitle="Deve ser administrativo, nunca comercial" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <RespostaSimNao label="Status" value={checklist.multiplicador.status} />
              <RespostaTexto label="Nome do multiplicador" value={checklist.multiplicador.nome} />
            </div>
            <RespostaTexto label="Observações" value={checklist.multiplicador.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={LineChart} title="5. Avaliações prévias" subtitle="Destaque para candidatos com alta indicação e pouca conversão" />
            <div className="flex items-center gap-2 text-sm text-foreground">
              {checklist.avaliacoesPrevias.dashboardExplorado ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              Explorou o dashboard da unidade
            </div>
            <RespostaTexto label="Quais candidatos estão utilizando" value={checklist.avaliacoesPrevias.candidatosUtilizando} />
            <RespostaTexto label="Observações" value={checklist.avaliacoesPrevias.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Headset} title="6. Devolutiva BackOffice" subtitle="Feedback informal sobre SLA de prévias e qualitativo" />
            <RespostaTexto label="Feedback" value={checklist.devolutivaBackoffice.feedback} />
            <RespostaTexto label="Observações" value={checklist.devolutivaBackoffice.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={UserCog} title="7. Visita diretoria (Master / Regional)" subtitle="Última visita da diretoria e necessidades de treinamento" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Fact icon={Calendar} label="Última data" value={checklist.visitaDiretoria.ultimaData ? checklist.visitaDiretoria.ultimaData.split("-").reverse().join("/") : "—"} />
              <Fact icon={User} label="Quem foi?" value={checklist.visitaDiretoria.quemFoi || "—"} />
            </div>
            <RespostaTexto label="Necessidades de treinamento a informar ao diretor" value={checklist.visitaDiretoria.necessidadesTreinamento} />
            <RespostaTexto label="Observações" value={checklist.visitaDiretoria.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Smartphone} title="8. Normativa Digital" subtitle="Conteúdo repassado com a unidade" />
            <RespostaSimNao label="Conteúdo repassado com a unidade" value={checklist.normativaDigital.status} />
            <RespostaTexto label="Observações" value={checklist.normativaDigital.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Star} title="9. Avaliação 360 e premissas" subtitle="Devolutiva de rating, planos de ação e novas premissas" />
            <RespostaTexto label="Devolutiva de rating + planos de ações" value={checklist.avaliacao360Premissas.devolutiva} />
            <div className="flex items-center gap-2 text-sm text-foreground">
              {checklist.avaliacao360Premissas.novasPremissasExplicadas ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              Novas premissas e atualizações explicadas
            </div>
            <RespostaTexto label="Observações" value={checklist.avaliacao360Premissas.observacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={Camera} title="10. Comunicação Visual" subtitle={`${ambientesFotografados}/${AMBIENTES_COMUNICACAO_VISUAL.length} ambientes fotografados`} />
            <div className="divide-y divide-border">
              {AMBIENTES_COMUNICACAO_VISUAL.map((ambiente) => {
                const qtd = checklist.comunicacaoVisual[ambiente.key];
                return (
                  <div key={ambiente.key} className="flex items-center justify-between gap-4 py-2.5">
                    <p className="text-sm text-foreground">{ambiente.label}</p>
                    <Badge
                      variant={qtd > 0 ? "success" : "outline"}
                      className={cn("gap-1 whitespace-nowrap", qtd === 0 && "text-muted-foreground")}
                    >
                      <Camera className="h-3 w-3" />
                      {qtd > 0 ? `${qtd} foto(s)` : "Sem foto"}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <RespostaTexto label="Observações" value={checklist.comunicacaoVisualObservacoes} />
          </Card>

          <Card className="space-y-3 p-6">
            <SectionHeader icon={NotebookPen} title="Observações adicionais" subtitle="Qualquer outro ponto relevante sobre a visita" />
            <p className="text-sm leading-relaxed text-foreground">{checklist.observacoesAdicionais || "—"}</p>
          </Card>
        </div>

        {/* Resumo lateral */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="p-6">
            <SectionHeader icon={ClipboardList} title="Resumo" subtitle="Metadados do registro" />
            <div className="space-y-4">
              <Fact icon={FileStack} label="Modelo utilizado" value={visita.modeloUsado} />
              <Fact icon={Camera} label="Comunicação visual" value={`${ambientesFotografados}/${AMBIENTES_COMUNICACAO_VISUAL.length} ambientes`} />
            </div>
          </Card>

          {visita.anotacaoPrivada && (
            <Card className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4 dark:border-amber-700 dark:bg-amber-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  Anotação Privada
                </span>
              </div>
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{visita.anotacaoPrivada}</p>
            </Card>
          )}

          {visita.ocorrenciaGerada && (
            <Card className="space-y-2 p-4">
              <p className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Ocorrência gerada no histórico
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/ocorrencias")}>
                {visita.ocorrenciaGerada}
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </Button>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
};

export default VisitaRespostaPage;

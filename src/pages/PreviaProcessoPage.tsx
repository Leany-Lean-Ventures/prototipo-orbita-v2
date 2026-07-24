import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  FileCheck,
  Clock,
  Mail,
  Phone,
  IdCard,
  Store,
  UserCog,
  Link2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Ban,
  Bot,
  ShieldAlert,
  Copy,
  FileSignature,
  FileStack,
  Loader2,
  Cloud,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import {
  getPrevia,
  getProcessoDetalhe,
  getDataAbertura,
  STATUS_STAGE_LABEL,
  type EventoCor,
} from "@/lib/mock-data/previas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { EntityDetailHeader, type EntityFact } from "@/components/entity-detail/EntityDetailHeader";
import { PreviaDiasBadge } from "@/components/previas/PreviaDiasBadge";

const STATUS_VARIANT = {
  Documental: "outline",
  "Retificação": "warning",
  "Jurídico": "outline",
  Aprovada: "success",
  Reprovada: "destructive",
} as const;

function Fact({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
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

const DOC_STATUS_LABEL: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  conforme: { label: "Conforme", className: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  "nao-conforme": { label: "Não conforme", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  analisando: { label: "Analisando…", className: "bg-warning/10 text-warning border-warning/20", icon: Loader2 },
};

const EVENTO_COR_CLASSES: Record<EventoCor, string> = {
  gray: "bg-muted text-muted-foreground border-border",
  blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  amber: "bg-warning/10 text-warning border-warning/20",
  violet: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  green: "bg-success/10 text-success border-success/20",
  red: "bg-destructive/10 text-destructive border-destructive/20",
};

const PreviaProcessoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const previa = id ? getPrevia(id) : undefined;

  const [negando, setNegando] = useState(false);
  const [justificativa, setJustificativa] = useState("");

  useEffect(() => {
    if (previa?.blacklist) setNegando(true);
  }, [previa?.id, previa?.blacklist]);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".proc-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".proc-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".proc-grid", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  if (!id || !previa) {
    return <Navigate to="/previas" replace />;
  }

  const detalhe = getProcessoDetalhe(previa);
  const finalizado = previa.status === "Aprovada" || previa.status === "Reprovada";

  const facts: EntityFact[] = [
    { icon: previa.tipo === "PJ" ? FileStack : User, label: "Tipo", value: previa.tipo === "PJ" ? "Pessoa jurídica" : "Pessoa física" },
    { icon: IdCard, label: previa.tipo === "PJ" ? "CNPJ" : "CPF", value: previa.documento },
    { icon: Store, label: "Unidade", value: `${previa.unidadeNome} • ${previa.regional}` },
    { icon: UserCog, label: "Analista", value: previa.analista },
  ];

  const handleCopiar = (valor: string, rotulo: string) => {
    navigator.clipboard?.writeText(valor).catch(() => {});
    toast.success(`${rotulo} copiado.`);
  };

  const handleDocumentoMock = (nome: string) => {
    toast.info(`${nome} indisponível neste protótipo.`);
  };

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="proc-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/previas")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a lista de processos
      </Button>

      <EntityDetailHeader
        className="proc-header"
        nome={previa.nome}
        statusLabel={STATUS_STAGE_LABEL[previa.status]}
        statusVariant={STATUS_VARIANT[previa.status]}
        facts={facts}
        indicator={
          <div className="flex flex-col items-end gap-2">
            <PreviaDiasBadge diasProcesso={previa.diasProcesso} className="text-sm" />
            <p className="text-xs text-muted-foreground">de 120 dias de janela</p>
          </div>
        }
        actions={
          !finalizado && (
            <>
              <Button size="sm" disabled={previa.blacklist} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Aprovar Credenciamento
              </Button>
              {!negando && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setNegando(true)}
                >
                  <Ban className="h-4 w-4" />
                  Negar Credenciamento
                </Button>
              )}
            </>
          )
        }
      />

      {!finalizado && previa.blacklist && (
        <Card className="flex items-start gap-3 border-destructive/30 bg-destructive/10 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-destructive">Candidato em blacklist</p>
            <p className="mt-0.5 text-xs text-destructive/90">
              CPF/CNPJ com correspondência na base de bloqueados. Aprovação impedida — registre a justificativa de recusa para arquivar esta prévia.
            </p>
          </div>
        </Card>
      )}

      {!finalizado && negando && (
        <Card className="space-y-2 p-4">
          <Label htmlFor="proc-justificativa" className="text-xs">
            Justificativa de recusa {previa.blacklist && "(obrigatória)"}
          </Label>
          <Textarea
            id="proc-justificativa"
            placeholder="Descreva o motivo da recusa…"
            rows={3}
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            {!previa.blacklist && (
              <Button variant="outline" size="sm" onClick={() => { setNegando(false); setJustificativa(""); }}>
                Cancelar
              </Button>
            )}
            <Button variant="destructive" size="sm" disabled={!justificativa.trim()}>
              Confirmar recusa e arquivar
            </Button>
          </div>
        </Card>
      )}

      <div className="proc-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Coluna principal */}
        <div className="min-w-0 space-y-4">
          <Tabs defaultValue="dados">
            <TabsList variant="secondary">
              <TabsTrigger value="dados">
                <User className="h-4 w-4" />
                Dados Cadastrais
              </TabsTrigger>
              <TabsTrigger value="docs">
                <FileCheck className="h-4 w-4" />
                Análise / Documentos
              </TabsTrigger>
              <TabsTrigger value="hist">
                <Clock className="h-4 w-4" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-4">
              <Card className="p-6">
                <SectionHeader icon={User} title="Dados pessoais" subtitle="Informações cadastrais do candidato" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={User} label="Nome completo / Razão social" value={previa.nome} />
                  <Fact icon={IdCard} label={previa.tipo === "PJ" ? "CNPJ" : "CPF"} value={previa.documento} />
                  <Fact icon={IdCard} label="RG" value={detalhe.dadosPessoais.rg} />
                  <Fact icon={IdCard} label="Órgão emissor" value={detalhe.dadosPessoais.orgaoEmissor} />
                  <Fact icon={CalendarDays} label="Data de nascimento" value={detalhe.dadosPessoais.nascimento} />
                  <Fact icon={User} label="Nacionalidade" value={detalhe.dadosPessoais.nacionalidade} />
                  <Fact icon={UserCog} label="Profissão" value={detalhe.dadosPessoais.profissao} />
                  <Fact icon={Store} label="Cidade de nascimento" value={`${detalhe.dadosPessoais.cidadeNascimento}/${detalhe.dadosPessoais.estadoNascimento}`} />
                  <Fact icon={Store} label="Unidade de atendimento" value={previa.unidadeNome} />
                  <Fact icon={User} label="Estado civil" value={detalhe.dadosPessoais.estadoCivil} />
                  <Fact icon={User} label="Nome do cônjuge" value={detalhe.dadosPessoais.conjuge} />
                </div>
              </Card>

              <Card className="p-6">
                <SectionHeader icon={Phone} title="Informação de contato" subtitle="Canais de contato do candidato" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={Mail} label="E-mail" value={previa.email} />
                  <Fact icon={Phone} label="Telefone fixo" value={detalhe.dadosPessoais.telefoneFixo} />
                  <Fact icon={Phone} label="Celular" value={previa.telefone} />
                </div>
              </Card>

              <Card className="p-6">
                <SectionHeader icon={Store} title="Endereço" subtitle="Endereço residencial informado" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact icon={IdCard} label="CEP" value={detalhe.endereco.cep} />
                  <Fact icon={Store} label="Endereço" value={`${detalhe.endereco.logradouro}, ${detalhe.endereco.numero}`} />
                  <Fact icon={Store} label="Referência" value={detalhe.endereco.referencia} />
                  <Fact icon={Store} label="Cidade" value={detalhe.endereco.cidade} />
                  <Fact icon={Store} label="Estado" value={detalhe.endereco.estado} />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <Card className="flex items-start gap-3 border-blue-500/20 bg-blue-500/5 p-4">
                <Bot className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Validação automática por IA</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Cada documento é analisado e validado quanto à conformidade (legibilidade, dados e padrão) — sem etapa manual.{" "}
                    <span className="font-semibold text-success">
                      {detalhe.documentos.filter((d) => d.status === "conforme").length}/{detalhe.documentos.length}
                    </span>{" "}
                    conformes.
                  </p>
                </div>
              </Card>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${detalhe.atuacao.situacaoNewcon === "Cadastrado" ? "bg-success" : "bg-destructive"}`}
                  aria-hidden="true"
                />
                Situação Newcon: <span className="font-semibold text-foreground">{detalhe.atuacao.situacaoNewcon}</span>
              </div>

              <Card className="p-6">
                <SectionHeader icon={FileCheck} title="Documentos" subtitle="Conformidade avaliada automaticamente pela IA" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Validação IA</TableHead>
                      <TableHead>Análise da IA</TableHead>
                      <TableHead className="text-center">Confiança</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalhe.documentos.map((doc) => {
                      const cfg = DOC_STATUS_LABEL[doc.status];
                      const StatusIcon = cfg.icon;
                      return (
                        <TableRow key={doc.nome}>
                          <TableCell className="font-medium text-foreground">{doc.nome}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${cfg.className}`}>
                              <StatusIcon className={`h-3 w-3 ${doc.status === "analisando" ? "animate-spin" : ""}`} aria-hidden="true" />
                              {cfg.label}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs text-xs text-muted-foreground">{doc.analiseIA}</TableCell>
                          <TableCell className="text-center text-sm font-semibold text-foreground">
                            {doc.confianca !== null ? `${doc.confianca}%` : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>

              <Card className="p-6">
                <SectionHeader icon={Cloud} title="Consultas automáticas" subtitle="Verificações externas realizadas pelo sistema" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plataforma</TableHead>
                      <TableHead className="text-center">Situação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalhe.consultas.map((c) => (
                      <TableRow key={c.plataforma}>
                        <TableCell className="font-medium text-foreground">{c.plataforma}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block h-2.5 w-2.5 rounded-full ${c.status === "ok" ? "bg-success" : "bg-warning"}`}
                            aria-label={c.status === "ok" ? "Regular" : "Alerta"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="hist">
              <Card className="p-6">
                <SectionHeader icon={Clock} title="Histórico de andamento" subtitle="Linha do tempo do processo de credenciamento" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...detalhe.historico].reverse().map((h, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{h.data}</TableCell>
                        <TableCell className="text-foreground">{h.responsavel}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${EVENTO_COR_CLASSES[h.cor]}`}>
                            {h.statusLabel}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-md text-xs text-muted-foreground">{h.desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar do candidato */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="p-6">
            <SectionHeader icon={User} title="Candidato" subtitle="Identificação e situação no AVA" />
            <div className="space-y-4">
              <Fact icon={CalendarDays} label="Data do registro" value={getDataAbertura(previa).split("-").reverse().join("/")} />
              <div className="flex items-start gap-3">
                <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Matrícula AVA</p>
                  <p className="flex items-center gap-1.5 text-sm text-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full ${previa.matriculaAva ? "bg-success" : "bg-destructive"}`} aria-hidden="true" />
                    {previa.matriculaAva ?? "Ainda não gerada"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeader icon={Store} title="Atuação" subtitle="Vínculo operacional na rede" />
            <div className="space-y-4">
              <Fact icon={Store} label="BU" value={detalhe.atuacao.bu} />
              <Fact icon={Store} label="Área de atuação" value={`${previa.unidadeNome} • ${previa.regional}`} />
              <div className="flex items-start gap-3">
                <Store className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Lojista</p>
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm text-foreground">{previa.lojista}</p>
                    <button
                      type="button"
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => handleCopiar(previa.lojista, "Nome do lojista")}
                      aria-label="Copiar nome do lojista"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              {previa.tipo === "PJ" && (
                <>
                  <Fact icon={Link2} label="ID Pessoa PJ" value={detalhe.atuacao.idPessoaPJ ?? "—"} />
                  <Fact icon={Link2} label="ID Pessoa Sócio" value={detalhe.atuacao.idPessoaSocio ?? "—"} />
                </>
              )}
              <Fact icon={Link2} label="Indicador / Formador" value={`${previa.indicador.razaoSocial} • ${previa.indicador.matricula}`} />
            </div>
          </Card>

          <Card className="space-y-2 p-6">
            <SectionHeader icon={FileSignature} title="Documentos do processo" subtitle="Termo e contrato gerados" />
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleDocumentoMock("Termo de confidencialidade")}
            >
              <FileSignature className="mr-1.5 h-4 w-4" />
              Detalhes do termo
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleDocumentoMock("Contrato de credenciamento")}
            >
              <FileStack className="mr-1.5 h-4 w-4" />
              Detalhes do contrato
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default PreviaProcessoPage;

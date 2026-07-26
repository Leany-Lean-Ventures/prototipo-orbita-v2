import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Send,
  Check,
  ChevronsUpDown,
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
  Upload,
  FileStack,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { getFormTemplate } from "@/lib/mock-data/form-templates";
import { Badge } from "@/components/ui/badge";
import {
  lojasParaVisita,
  RESPONSAVEIS_VISITA,
  AMBIENTES_COMUNICACAO_VISUAL,
  type VisitaTipo,
  type AmbienteKey,
  type ChecklistResposta,
} from "@/lib/mock-data/visitas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type SimNao = ChecklistResposta | "";

interface FormState {
  lojaId: string;
  tipo: VisitaTipo | "";
  dataChecklist: string;
  responsavelVisita: string;
  planoCarreiras: { status: SimNao; formalizadoFront: SimNao; comprovacao: string; observacoes: string };
  processoContratacao: { status: SimNao; processoPeriodico: SimNao; observacoes: string };
  aceleradorAdemicon: { status: SimNao; treinamentoPlataforma: SimNao; focal: string; observacoes: string };
  multiplicador: { status: SimNao; nome: string; observacoes: string };
  avaliacoesPrevias: { dashboardExplorado: boolean; candidatosUtilizando: string; observacoes: string };
  devolutivaBackoffice: { feedback: string; observacoes: string };
  visitaDiretoria: { ultimaData: string; quemFoi: string; necessidadesTreinamento: string; observacoes: string };
  normativaDigital: { status: SimNao; observacoes: string };
  avaliacao360Premissas: { devolutiva: string; novasPremissasExplicadas: boolean; observacoes: string };
  comunicacaoVisual: Record<AmbienteKey, number>;
  comunicacaoVisualObservacoes: string;
  observacoesAdicionais: string;
}

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function estadoInicial(responsavel: string): FormState {
  return {
    lojaId: "",
    tipo: "",
    dataChecklist: hojeISO(),
    responsavelVisita: responsavel,
    planoCarreiras: { status: "", formalizadoFront: "", comprovacao: "", observacoes: "" },
    processoContratacao: { status: "", processoPeriodico: "", observacoes: "" },
    aceleradorAdemicon: { status: "", treinamentoPlataforma: "", focal: "", observacoes: "" },
    multiplicador: { status: "", nome: "", observacoes: "" },
    avaliacoesPrevias: { dashboardExplorado: false, candidatosUtilizando: "", observacoes: "" },
    devolutivaBackoffice: { feedback: "", observacoes: "" },
    visitaDiretoria: { ultimaData: "", quemFoi: "", necessidadesTreinamento: "", observacoes: "" },
    normativaDigital: { status: "", observacoes: "" },
    avaliacao360Premissas: { devolutiva: "", novasPremissasExplicadas: false, observacoes: "" },
    comunicacaoVisual: AMBIENTES_COMUNICACAO_VISUAL.reduce((acc, a) => {
      acc[a.key] = 0;
      return acc;
    }, {} as Record<AmbienteKey, number>),
    comunicacaoVisualObservacoes: "",
    observacoesAdicionais: "",
  };
}

const SECOES = [
  { id: "identificacao", label: "Identificação da visita" },
  { id: "plano-carreiras", label: "1. Plano de carreiras" },
  { id: "processo-contratacao", label: "2. Processo de contratação" },
  { id: "acelerador", label: "3. Acelerador Ademicon" },
  { id: "multiplicador", label: "4. Multiplicador" },
  { id: "avaliacoes-previas", label: "5. Avaliações prévias" },
  { id: "devolutiva-backoffice", label: "6. Devolutiva BackOffice" },
  { id: "visita-diretoria", label: "7. Visita diretoria" },
  { id: "normativa-digital", label: "8. Normativa Digital" },
  { id: "avaliacao-360", label: "9. Avaliação 360 e premissas" },
  { id: "comunicacao-visual", label: "10. Comunicação Visual" },
  { id: "observacoes-adicionais", label: "Observações adicionais" },
];

function SimNaoField({
  id,
  label,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  value: SimNao;
  onChange: (v: ChecklistResposta) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <RadioGroup id={id} value={value} onValueChange={(v) => onChange(v as ChecklistResposta)} className="flex gap-2" aria-label={label}>
        {(["Sim", "Não"] as const).map((opt) => (
          <label
            key={opt}
            className={cn(
              "flex h-11 min-w-[88px] cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors duration-micro ease-micro",
              value === opt
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:bg-muted/50"
            )}
          >
            <RadioGroupItem value={opt} className="sr-only" />
            {opt}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

function CampoObservacoes({ id, value, onChange, label = "Observações" }: { id: string; value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} rows={2} placeholder="Texto livre…" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const RegistrarVisitaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const modelo = getFormTemplate(searchParams.get("modelo") ?? "");
  const [form, setForm] = useState<FormState>(() => estadoInicial(user?.name ?? RESPONSAVEIS_VISITA[0]));
  const [lojaPopoverOpen, setLojaPopoverOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(SECOES[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".reg-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".reg-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".reg-grid", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  // Scroll spy — destaca a seção ativa na navegação lateral.
  useEffect(() => {
    const elements = SECOES.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries.find((e) => e.isIntersecting);
        if (visivel) setActiveSection(visivel.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const lojaSelecionada = lojasParaVisita.find((l) => l.id === form.lojaId);

  const update = <K extends keyof FormState>(key: K, patch: Partial<FormState[K]> | FormState[K]) => {
    setForm((f) => ({
      ...f,
      [key]: typeof patch === "object" && patch !== null && typeof f[key] === "object"
        ? { ...(f[key] as object), ...(patch as object) }
        : patch,
    }));
  };

  const handleLojaSelecionada = (lojaId: string) => {
    const loja = lojasParaVisita.find((l) => l.id === lojaId);
    setForm((f) => ({ ...f, lojaId }));
    setLojaPopoverOpen(false);
    if (loja) toast.info(`Licenciado/gestor "${loja.gestor}" preenchido automaticamente.`);
  };

  const updateAmbiente = (key: AmbienteKey, qtd: number) => {
    setForm((f) => ({ ...f, comunicacaoVisual: { ...f.comunicacaoVisual, [key]: qtd } }));
  };

  const isValid = useMemo(() => {
    return (
      !!form.lojaId &&
      !!form.tipo &&
      !!form.dataChecklist &&
      !!form.responsavelVisita &&
      !!form.planoCarreiras.status &&
      !!form.planoCarreiras.formalizadoFront &&
      !!form.processoContratacao.status &&
      !!form.processoContratacao.processoPeriodico &&
      !!form.aceleradorAdemicon.status &&
      !!form.aceleradorAdemicon.treinamentoPlataforma &&
      !!form.aceleradorAdemicon.focal.trim() &&
      !!form.multiplicador.status &&
      !!form.multiplicador.nome.trim() &&
      !!form.normativaDigital.status
    );
  }, [form]);

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Preencha os campos obrigatórios (marcados com *) antes de registrar.");
      return;
    }
    toast.success(`Visita a ${lojaSelecionada?.nome} registrada com sucesso.`);
    navigate("/visitas");
  };

  const totalFotos = AMBIENTES_COMUNICACAO_VISUAL.reduce((acc, a) => acc + (form.comunicacaoVisual[a.key] > 0 ? 1 : 0), 0);

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="reg-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/visitas")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a lista de visitas
      </Button>

      <div className="reg-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Registrar Visita</h1>
            {modelo && (
              <Badge variant="outline" className="gap-1.5">
                <FileStack className="h-3 w-3" />
                Modelo: {modelo.nome}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Checklist gerencial de visita à rede — preencha após a visita à loja.
          </p>
        </div>
        <Button onClick={handleSubmit} className="gap-1.5">
          <Send className="h-4 w-4" />
          Registrar visita
        </Button>
      </div>

      <div ref={containerRef} className="reg-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        {/* Coluna principal — seções do checklist */}
        <div className="min-w-0 space-y-4">
          <Card id="identificacao" className="scroll-mt-24 p-6">
            <SectionHeader
              icon={ClipboardList}
              title="Identificação da visita"
              subtitle="Loja, responsável e data de aplicação do checklist"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="reg-loja">
                  Loja <span className="text-destructive">*</span>
                </Label>
                <Popover open={lojaPopoverOpen} onOpenChange={setLojaPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="reg-loja"
                      variant="outline"
                      role="combobox"
                      aria-expanded={lojaPopoverOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className={cn("truncate", !lojaSelecionada && "text-muted-foreground")}>
                        {lojaSelecionada ? lojaSelecionada.nome : "Buscar unidade ou PV…"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar por nome ou código…" />
                      <CommandList>
                        <CommandEmpty>Nenhuma loja encontrada.</CommandEmpty>
                        <CommandGroup>
                          {lojasParaVisita.map((loja) => (
                            <CommandItem
                              key={loja.id}
                              value={loja.nome}
                              onSelect={() => handleLojaSelecionada(loja.id)}
                            >
                              <Check className={cn("h-3.5 w-3.5", form.lojaId === loja.id ? "opacity-100" : "opacity-0")} />
                              <span className="flex-1 truncate">{loja.nome}</span>
                              <span className="text-xs text-muted-foreground">{loja.tipo}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-licenciado">Licenciado ou gestor</Label>
                <Input
                  id="reg-licenciado"
                  value={lojaSelecionada?.gestor ?? ""}
                  disabled
                  placeholder="Preenchido ao selecionar a loja"
                  className="disabled:opacity-80"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-tipo">
                  Tipo de visita <span className="text-destructive">*</span>
                </Label>
                <Select value={form.tipo} onValueChange={(v) => update("tipo", v as VisitaTipo)}>
                  <SelectTrigger id="reg-tipo">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Auditoria">Auditoria</SelectItem>
                    <SelectItem value="Avaliação 360">Avaliação 360</SelectItem>
                    <SelectItem value="Estruturação">Estruturação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-data">
                  Data da aplicação do checklist <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-data"
                  type="date"
                  value={form.dataChecklist}
                  onChange={(e) => update("dataChecklist", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-responsavel">
                  Responsável pela visita <span className="text-destructive">*</span>
                </Label>
                <Select value={form.responsavelVisita} onValueChange={(v) => update("responsavelVisita", v)}>
                  <SelectTrigger id="reg-responsavel">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSAVEIS_VISITA.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card id="plano-carreiras" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={Briefcase} title="1. Plano de carreiras" subtitle="Formalização e divulgação ao front da loja" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SimNaoField id="pc-status" label="Status" required value={form.planoCarreiras.status} onChange={(v) => update("planoCarreiras", { status: v })} />
              <SimNaoField id="pc-front" label="Formalizado para o front (e-mail)?" required value={form.planoCarreiras.formalizadoFront} onChange={(v) => update("planoCarreiras", { formalizadoFront: v })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pc-comprovacao">Comprovação de divulgação na loja</Label>
              <Input id="pc-comprovacao" placeholder="Link, protocolo ou descrição do anexo" value={form.planoCarreiras.comprovacao} onChange={(e) => update("planoCarreiras", { comprovacao: e.target.value })} />
              <p className="text-xs text-muted-foreground">Só será considerado se enviado por e-mail em até 5 dias úteis após a visita à loja.</p>
            </div>
            <CampoObservacoes id="pc-obs" value={form.planoCarreiras.observacoes} onChange={(v) => update("planoCarreiras", { observacoes: v })} />
          </Card>

          <Card id="processo-contratacao" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={UserPlus} title="2. Processo de contratação e periodicidade" subtitle="Existência de um processo estruturado de contratação" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SimNaoField id="pcont-status" label="Status" required value={form.processoContratacao.status} onChange={(v) => update("processoContratacao", { status: v })} />
              <SimNaoField id="pcont-periodico" label="Existe um processo periódico?" required value={form.processoContratacao.processoPeriodico} onChange={(v) => update("processoContratacao", { processoPeriodico: v })} />
            </div>
            <CampoObservacoes id="pcont-obs" value={form.processoContratacao.observacoes} onChange={(v) => update("processoContratacao", { observacoes: v })} />
          </Card>

          <Card id="acelerador" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={Rocket} title="3. Acelerador Ademicon" subtitle="Candidatos recebidos e treinamento da plataforma" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SimNaoField id="acel-status" label="Status" required value={form.aceleradorAdemicon.status} onChange={(v) => update("aceleradorAdemicon", { status: v })} />
              <SimNaoField id="acel-treinamento" label="Treinamento plataforma, playbook e dashboard" required value={form.aceleradorAdemicon.treinamentoPlataforma} onChange={(v) => update("aceleradorAdemicon", { treinamentoPlataforma: v })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acel-focal">
                Quem é o focal da loja? <span className="text-destructive">*</span>
              </Label>
              <Input id="acel-focal" placeholder="Nome do responsável focal" value={form.aceleradorAdemicon.focal} onChange={(e) => update("aceleradorAdemicon", { focal: e.target.value })} />
            </div>
            <CampoObservacoes id="acel-obs" value={form.aceleradorAdemicon.observacoes} onChange={(v) => update("aceleradorAdemicon", { observacoes: v })} />
          </Card>

          <Card id="multiplicador" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={Users} title="4. Multiplicador" subtitle="Deve ser administrativo, nunca comercial" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SimNaoField id="mult-status" label="Status" required value={form.multiplicador.status} onChange={(v) => update("multiplicador", { status: v })} />
              <div className="space-y-1.5">
                <Label htmlFor="mult-nome">
                  Nome do multiplicador <span className="text-destructive">*</span>
                </Label>
                <Input id="mult-nome" placeholder="Nome completo" value={form.multiplicador.nome} onChange={(e) => update("multiplicador", { nome: e.target.value })} />
              </div>
            </div>
            <CampoObservacoes id="mult-obs" value={form.multiplicador.observacoes} onChange={(v) => update("multiplicador", { observacoes: v })} />
          </Card>

          <Card id="avaliacoes-previas" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={LineChart} title="5. Avaliações prévias" subtitle="Destaque para candidatos com alta indicação e pouca conversão" />
            <label className="flex h-11 w-fit cursor-pointer items-center gap-2.5 rounded-lg border border-input px-4 text-sm font-medium text-foreground transition-colors duration-micro ease-micro hover:bg-muted/50">
              <Checkbox
                checked={form.avaliacoesPrevias.dashboardExplorado}
                onCheckedChange={(c) => update("avaliacoesPrevias", { dashboardExplorado: c === true })}
              />
              Explorei o dashboard da unidade
            </label>
            <div className="space-y-1.5">
              <Label htmlFor="aval-candidatos">Quais candidatos estão utilizando</Label>
              <Textarea id="aval-candidatos" rows={2} placeholder="Texto livre…" value={form.avaliacoesPrevias.candidatosUtilizando} onChange={(e) => update("avaliacoesPrevias", { candidatosUtilizando: e.target.value })} />
            </div>
            <CampoObservacoes id="aval-obs" value={form.avaliacoesPrevias.observacoes} onChange={(v) => update("avaliacoesPrevias", { observacoes: v })} />
          </Card>

          <Card id="devolutiva-backoffice" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={Headset} title="6. Devolutiva BackOffice" subtitle="Feedback informal sobre SLA de prévias e qualitativo" />
            <div className="space-y-1.5">
              <Label htmlFor="devol-feedback">Feedback</Label>
              <Textarea id="devol-feedback" rows={3} placeholder="Texto livre…" value={form.devolutivaBackoffice.feedback} onChange={(e) => update("devolutivaBackoffice", { feedback: e.target.value })} />
              <p className="text-xs text-muted-foreground">
                A Ademicon tem o direito de não aceitar candidatos para prevenir problemas futuros, sem necessidade de informar o motivo.
              </p>
            </div>
            <CampoObservacoes id="devol-obs" value={form.devolutivaBackoffice.observacoes} onChange={(v) => update("devolutivaBackoffice", { observacoes: v })} />
          </Card>

          <Card id="visita-diretoria" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={UserCog} title="7. Visita diretoria (Master / Regional)" subtitle="Última visita da diretoria e necessidades de treinamento" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dir-data">Última data</Label>
                <Input id="dir-data" type="date" value={form.visitaDiretoria.ultimaData} onChange={(e) => update("visitaDiretoria", { ultimaData: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dir-quem">Quem foi?</Label>
                <Input id="dir-quem" placeholder="Nome do diretor/responsável" value={form.visitaDiretoria.quemFoi} onChange={(e) => update("visitaDiretoria", { quemFoi: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dir-necessidades">Necessidades de treinamento a informar ao diretor</Label>
              <Textarea id="dir-necessidades" rows={2} placeholder="Texto livre…" value={form.visitaDiretoria.necessidadesTreinamento} onChange={(e) => update("visitaDiretoria", { necessidadesTreinamento: e.target.value })} />
            </div>
            <CampoObservacoes id="dir-obs" value={form.visitaDiretoria.observacoes} onChange={(v) => update("visitaDiretoria", { observacoes: v })} />
          </Card>

          <Card id="normativa-digital" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={Smartphone} title="8. Normativa Digital" subtitle="Conteúdo repassado com a unidade" />
            <SimNaoField id="norm-status" label="Conteúdo repassado com a unidade" required value={form.normativaDigital.status} onChange={(v) => update("normativaDigital", { status: v })} />
            <CampoObservacoes id="norm-obs" value={form.normativaDigital.observacoes} onChange={(v) => update("normativaDigital", { observacoes: v })} />
          </Card>

          <Card id="avaliacao-360" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={Star} title="9. Avaliação 360 e premissas" subtitle="Devolutiva de rating, planos de ação e novas premissas" />
            <div className="space-y-1.5">
              <Label htmlFor="a360-devolutiva">Devolutiva de rating + planos de ações</Label>
              <Textarea id="a360-devolutiva" rows={3} placeholder="Texto livre…" value={form.avaliacao360Premissas.devolutiva} onChange={(e) => update("avaliacao360Premissas", { devolutiva: e.target.value })} />
            </div>
            <label className="flex h-11 w-fit cursor-pointer items-center gap-2.5 rounded-lg border border-input px-4 text-sm font-medium text-foreground transition-colors duration-micro ease-micro hover:bg-muted/50">
              <Checkbox
                checked={form.avaliacao360Premissas.novasPremissasExplicadas}
                onCheckedChange={(c) => update("avaliacao360Premissas", { novasPremissasExplicadas: c === true })}
              />
              Novas premissas e atualizações explicadas
            </label>
            <CampoObservacoes id="a360-obs" value={form.avaliacao360Premissas.observacoes} onChange={(v) => update("avaliacao360Premissas", { observacoes: v })} />
          </Card>

          <Card id="comunicacao-visual" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={Camera} title="10. Comunicação Visual" subtitle="Fotos dos ambientes da loja" />
            <div className="divide-y divide-border">
              {AMBIENTES_COMUNICACAO_VISUAL.map((ambiente) => (
                <div key={ambiente.key} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{ambiente.label}</p>
                    {ambiente.detalhe && <p className="text-xs text-muted-foreground">{ambiente.detalhe}</p>}
                  </div>
                  <label className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-input px-3 text-xs font-medium text-foreground transition-colors duration-micro ease-micro hover:bg-muted/50">
                    <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                    {form.comunicacaoVisual[ambiente.key] > 0
                      ? `${form.comunicacaoVisual[ambiente.key]} foto(s)`
                      : "Enviar fotos"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) => updateAmbiente(ambiente.key, e.target.files?.length ?? 0)}
                    />
                  </label>
                </div>
              ))}
            </div>
            <CampoObservacoes id="cv-obs" label="Observações" value={form.comunicacaoVisualObservacoes} onChange={(v) => update("comunicacaoVisualObservacoes", v)} />
          </Card>

          <Card id="observacoes-adicionais" className="scroll-mt-24 space-y-4 p-6">
            <SectionHeader icon={NotebookPen} title="Observações adicionais" subtitle="Qualquer outro ponto relevante sobre a visita" />
            <Textarea rows={3} placeholder="Texto livre…" value={form.observacoesAdicionais} onChange={(e) => update("observacoesAdicionais", e.target.value)} />
          </Card>
        </div>

        {/* Navegação lateral fixa + progresso + envio */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="p-4">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Seções do checklist</p>
            <nav className="flex flex-col gap-0.5">
              {SECOES.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-micro ease-micro",
                    activeSection === s.id
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </Card>

          <Card className="space-y-3 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Camera className="h-3.5 w-3.5" />
              {totalFotos}/{AMBIENTES_COMUNICACAO_VISUAL.length} ambientes com foto
            </div>
            <Button className="w-full gap-1.5" onClick={handleSubmit}>
              <Send className="h-4 w-4" />
              Registrar visita
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/visitas")}>
              Cancelar
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default RegistrarVisitaPage;

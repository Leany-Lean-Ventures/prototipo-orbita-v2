import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, FileText, User, Store, MapPin, Phone, AlertTriangle } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { unidadesList } from "@/lib/mock-data/unidades";
import { CANAL_LABEL, type CanalOrigem, type CategoriaLicenciado } from "@/lib/mock-data/esteira-abertura-unidades";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const NovoRegistroAberturaPage = () => {
  const navigate = useNavigate();

  const [licenciadoNome, setLicenciadoNome] = useState("");
  const [ehDono, setEhDono] = useState(true);
  const [categoriaLicenciado, setCategoriaLicenciado] = useState<CategoriaLicenciado | "">("");
  const [lojaOrigemId, setLojaOrigemId] = useState("");
  const [cidadeAlvo, setCidadeAlvo] = useState("");
  const [uf, setUf] = useState("");
  const [canalOrigem, setCanalOrigem] = useState<CanalOrigem | "">("");
  const [observacoes, setObservacoes] = useState("");

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".nra-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".nra-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".nra-card", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  const isValid = useMemo(
    () => licenciadoNome.trim().length > 0 && lojaOrigemId !== "" && cidadeAlvo.trim().length > 0 && uf !== "" && canalOrigem !== "" && categoriaLicenciado !== "",
    [licenciadoNome, lojaOrigemId, cidadeAlvo, uf, canalOrigem, categoriaLicenciado]
  );

  const handleSalvar = () => {
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios para registrar a solicitação.");
      return;
    }
    toast.success(`Solicitação de abertura de ${licenciadoNome} registrada — card criado na etapa "Solicitação de abertura".`);
    navigate("/esteira/abertura-unidades");
  };

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="nra-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/esteira/abertura-unidades")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Kanban
      </Button>

      <div className="nra-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Nova Solicitação de Abertura</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registre os dados iniciais — o card entra na esteira já na etapa "Solicitação de abertura".
          </p>
        </div>
        <Button onClick={handleSalvar} className="gap-1.5">
          <Save className="h-4 w-4" />
          Registrar solicitação
        </Button>
      </div>

      <Card className="nra-card mx-auto max-w-2xl space-y-5 p-6">
        <SectionHeader icon={FileText} title="Dados da solicitação" subtitle="Campos base para abrir o processo de expansão" />

        <div className="space-y-1.5">
          <Label htmlFor="nra-licenciado">
            Licenciado solicitante <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="nra-licenciado"
              className="pl-9"
              placeholder="Nome do licenciado"
              value={licenciadoNome}
              onChange={(e) => setLicenciadoNome(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Switch id="nra-dono" checked={ehDono} onCheckedChange={setEhDono} />
            <Label htmlFor="nra-dono" className="cursor-pointer text-sm">É dono da loja de origem</Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nra-categoria">
              Categoria de comissão <span className="text-destructive">*</span>
            </Label>
            <Select value={categoriaLicenciado} onValueChange={(v) => setCategoriaLicenciado(v as CategoriaLicenciado)}>
              <SelectTrigger id="nra-categoria" aria-label="Categoria">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2.5%">2,5%</SelectItem>
                <SelectItem value="2.7%+">2,7%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!ehDono && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-foreground">
              Apenas o <strong>dono</strong> da loja pode solicitar abertura de uma nova unidade. Solicitações de autorizados não são consideradas.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="nra-loja-origem">
            Loja de origem <span className="text-destructive">*</span>
          </Label>
          <Select value={lojaOrigemId} onValueChange={setLojaOrigemId}>
            <SelectTrigger id="nra-loja-origem" aria-label="Loja de origem">
              <Store className="mr-1.5 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Selecione a loja do licenciado" />
            </SelectTrigger>
            <SelectContent>
              {unidadesList.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.nome} ({u.id})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
          <div className="space-y-1.5">
            <Label htmlFor="nra-cidade">
              Cidade-alvo <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nra-cidade"
                className="pl-9"
                placeholder="Ex.: Sorocaba"
                value={cidadeAlvo}
                onChange={(e) => setCidadeAlvo(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nra-uf">
              UF <span className="text-destructive">*</span>
            </Label>
            <Select value={uf} onValueChange={setUf}>
              <SelectTrigger id="nra-uf" aria-label="UF">
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                {UFS.map((sigla) => (
                  <SelectItem key={sigla} value={sigla}>{sigla}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nra-canal">
            Canal de origem da solicitação <span className="text-destructive">*</span>
          </Label>
          <Select value={canalOrigem} onValueChange={(v) => setCanalOrigem(v as CanalOrigem)}>
            <SelectTrigger id="nra-canal" aria-label="Canal de origem">
              <Phone className="mr-1.5 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Como a solicitação chegou?" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CANAL_LABEL) as CanalOrigem[]).map((canal) => (
                <SelectItem key={canal} value={canal}>{CANAL_LABEL[canal]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nra-observacoes">Observações iniciais</Label>
          <Textarea
            id="nra-observacoes"
            rows={3}
            placeholder="Qualquer contexto relevante sobre a solicitação…"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <Button className="w-full gap-1.5" onClick={handleSalvar}>
          <Save className="h-4 w-4" />
          Registrar solicitação
        </Button>
      </Card>
    </div>
  );
};

export default NovoRegistroAberturaPage;

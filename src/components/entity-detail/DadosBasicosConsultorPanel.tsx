import { User, Mail, Phone, MapPin, BriefcaseBusiness, IdCard } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DadosBasicosConsultor, ConsultorStatus } from "@/lib/mock-data/consultores";

const STATUS_VARIANT: Record<ConsultorStatus, "success" | "outline" | "destructive"> = {
  Ativo: "success",
  Inativo: "outline",
  Descredenciado: "destructive",
};

interface DadosBasicosConsultorPanelProps {
  dados: DadosBasicosConsultor;
  indicador: { id: string; nome: string; razaoSocial: string } | null;
  ingresso: string;
  cnpj: string;
  matricula: string;
  razaoSocial: string;
  nivel: string;
  status: ConsultorStatus;
}

/**
 * Aba "Dados Básicos" do consultor — mini header de identidade (ícone
 * gradiente + nome + matrícula + nível/status) seguido das seções
 * cadastrais (Identificação, Contato, Endereço).
 */
export function DadosBasicosConsultorPanel({
  dados,
  indicador,
  ingresso,
  cnpj,
  matricula,
  razaoSocial,
  nivel,
  status,
}: DadosBasicosConsultorPanelProps) {
  return (
    <div className="space-y-4">
      {/* Mini header de identidade — mesmo padrão de "gradient icon card" do StatCard */}
      <Card className="relative overflow-hidden p-6">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5" />
        <div className="absolute -right-1 -top-1 h-16 w-16 rounded-full bg-gradient-to-br from-secondary/10 to-transparent" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg">
              <BriefcaseBusiness className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold tracking-tight text-foreground">
                {razaoSocial}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <IdCard className="h-3.5 w-3.5" aria-hidden="true" />
                  {matricula}
                </span>
                <span aria-hidden="true">•</span>
                <span>CNPJ {cnpj}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline">{nivel}</Badge>
            <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
          </div>
        </div>
      </Card>

      {/* Identificação */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="h-4 w-4 text-primary" />
          Identificação
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DataField label="CNPJ" value={cnpj} />
          <DataField label="Matrícula" value={matricula} />
          <DataField label="Data de ingresso" value={ingresso} />
          <DataField label="Indicador / Formador" value={indicador ? indicador.razaoSocial : "—"} />
        </div>
      </Card>

      {/* Contato */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="h-4 w-4 text-primary" />
          Contato
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <DataField label="E-mail" value={dados.email} icon={<Mail className="h-3.5 w-3.5" />} />
          <DataField label="Telefone" value={dados.telefone} icon={<Phone className="h-3.5 w-3.5" />} />
        </div>
      </Card>

      {/* Endereço */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Endereço
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DataField label="Logradouro" value={dados.endereco} className="sm:col-span-2 lg:col-span-2" />
          <DataField label="Bairro" value={dados.bairro} />
          <DataField label="Cidade" value={dados.cidade} />
          <DataField label="Estado" value={dados.estado} />
          <DataField label="CEP" value={dados.cep} />
        </div>
      </Card>
    </div>
  );
}

/** Campo de exibição de dado com label + valor. */
function DataField({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="flex items-center gap-1.5 text-sm text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {value}
      </p>
    </div>
  );
}

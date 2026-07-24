import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, FileText, Camera } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { DadosBasicosConsultor } from "@/lib/mock-data/consultores";

interface DadosBasicosConsultorPanelProps {
  dados: DadosBasicosConsultor;
  indicador: { id: string; nome: string } | null;
  ingresso: string;
  cpf: string;
  matricula: string;
  nome: string;
  avatarUrl?: string;
}

/**
 * Aba "Dados Básicos" do consultor — layout com foto + upload à esquerda,
 * dados cadastrais agrupados em seções visuais à direita.
 */
export function DadosBasicosConsultorPanel({
  dados,
  indicador,
  ingresso,
  cpf,
  matricula,
  nome,
  avatarUrl,
}: DadosBasicosConsultorPanelProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const initials = nome
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const displayAvatar = photoPreview || avatarUrl;

  return (
    <div className="space-y-4">
      {/* Photo circle centered, overlapping the first card */}
      <div className="relative flex flex-col items-center">
        {/* Avatar overlapping */}
        <div className="relative z-10 mb-[-56px]">
          <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-background shadow-lg">
            {displayAvatar ? (
              <img src={displayAvatar} alt={nome} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary/10 text-3xl font-bold text-secondary">
                {initials}
              </div>
            )}
          </div>
          <label
            className="absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
            aria-label="Alterar foto"
          >
            <Camera className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Identificação — first card with top padding for the overlapping avatar */}
        <Card className="w-full p-5 pt-16">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold text-foreground">{nome}</p>
            <p className="text-xs text-muted-foreground">{matricula}</p>
          </div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <User className="h-4 w-4 text-primary" />
            Identificação
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DataField label="CPF" value={cpf} />
            <DataField label="RG" value={dados.rg} />
            <DataField label="Matrícula" value={matricula} />
            <DataField label="Data de nascimento" value={dados.nascimento} />
            <DataField label="Data de ingresso" value={ingresso} />
            <DataField label="Indicador / Formador" value={indicador ? indicador.nome : "—"} />
          </div>
        </Card>
      </div>

      {/* Contato */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="h-4 w-4 text-primary" />
          Contato
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DataField label="E-mail" value={dados.email} icon={<Mail className="h-3.5 w-3.5" />} />
          <DataField label="Telefone" value={dados.telefone} icon={<Phone className="h-3.5 w-3.5" />} />
        </div>
      </Card>

      {/* Endereço */}
      <Card className="p-5">
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

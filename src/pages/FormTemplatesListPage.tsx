import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileStack, ListChecks, MessageSquareText } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { formTemplatesList } from "@/lib/mock-data/form-templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const FormTemplatesListPage = () => {
  const navigate = useNavigate();

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".tmpl-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".tmpl-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".tmpl-grid", vars: { y: 16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
  ]);

  return (
    <div ref={entranceRef} className="space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="tmpl-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/configuracoes")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Configurações
      </Button>

      <div className="tmpl-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Modelos de Formulário</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Modelos de checklist disponíveis ao registrar uma visita.
          </p>
        </div>
        <Button onClick={() => navigate("/configuracoes/modelos-formularios/novo")}>
          <Plus className="mr-1.5 h-4 w-4" />
          Novo modelo
        </Button>
      </div>

      <div className="tmpl-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formTemplatesList.map((tmpl) => (
          <Card
            key={tmpl.id}
            interactive
            onClick={() => navigate(`/configuracoes/modelos-formularios/${tmpl.id}`)}
            className="flex flex-col gap-3 p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-foreground">
                <FileStack className="h-5 w-5 text-secondary" />
              </div>
              <Badge variant="outline" className="gap-1 whitespace-nowrap">
                <MessageSquareText className="h-3 w-3" />
                {tmpl.respostasQtd} resposta{tmpl.respostasQtd !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">{tmpl.nome}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{tmpl.descricao}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ListChecks className="h-3 w-3" />
                {tmpl.campos.length} campos
              </span>
              <span>Atualizado em {formatDateBR(tmpl.atualizadoEm)}</span>
            </div>
          </Card>
        ))}

        <Card
          interactive
          onClick={() => navigate("/configuracoes/modelos-formularios/novo")}
          className="flex min-h-[172px] flex-col items-center justify-center gap-2 border-dashed p-6 text-center"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
            <Plus className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">Novo modelo</p>
          <p className="text-xs text-muted-foreground">Monte um checklist personalizado</p>
        </Card>
      </div>
    </div>
  );
};

export default FormTemplatesListPage;

import { useState } from "react";
import { FileStack, MessageSquareText } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formTemplatesList } from "@/lib/mock-data/form-templates";

interface SelecionarModeloVisitaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (modeloId: string) => void;
}

/**
 * Modal disparado pelo CTA "Registrar visita" — o operador escolhe qual
 * modelo de checklist (Configurações → Modelos de Formulário) usar antes de
 * abrir a página de registro. Mock/MVP: a página de registro sempre mostra o
 * mesmo checklist padrão, independente do modelo escolhido aqui — só o nome
 * do modelo selecionado é exibido, sem alterar os campos exibidos.
 */
export function SelecionarModeloVisitaModal({ open, onOpenChange, onConfirmar }: SelecionarModeloVisitaModalProps) {
  const [modeloId, setModeloId] = useState(formTemplatesList[0]?.id ?? "");

  const handleConfirmar = () => {
    if (!modeloId) return;
    onConfirmar(modeloId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileStack className="h-5 w-5 text-primary" />
            Selecione o modelo de formulário
          </DialogTitle>
          <DialogDescription>
            Escolha o checklist que será aplicado nesta visita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {formTemplatesList.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setModeloId(tmpl.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-micro ease-micro",
                modeloId === tmpl.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <FileStack className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{tmpl.nome}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{tmpl.descricao}</p>
              </div>
              <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap">
                <MessageSquareText className="h-3 w-3" />
                {tmpl.respostasQtd}
              </Badge>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} disabled={!modeloId}>
            Confirmar e abrir checklist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

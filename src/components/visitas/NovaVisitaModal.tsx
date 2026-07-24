import { useState } from "react";
import { Lock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface NovaVisitaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para agendar ou registrar uma visita.
 * Campos condicionais: relatório e anotação privada aparecem quando status = Realizada.
 */
export function NovaVisitaModal({ open, onOpenChange }: NovaVisitaModalProps) {
  const [unidade, setUnidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [relatorio, setRelatorio] = useState("");
  const [anotacao, setAnotacao] = useState("");

  const isRealizada = status === "Realizada";

  const handleSubmit = () => {
    onOpenChange(false);
    setUnidade(""); setTipo(""); setData(""); setStatus(""); setObjetivos(""); setRelatorio(""); setAnotacao("");
  };

  const isValid = unidade && tipo && data && status && objetivos;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Agendar / Registrar Visita</DialogTitle>
          <DialogDescription>
            Planeje uma visita futura ou registre uma visita já realizada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Unidade */}
          <div className="space-y-1.5">
            <Label htmlFor="vis-unidade">Unidade / PV de Destino</Label>
            <Input
              id="vis-unidade"
              placeholder="Buscar unidade ou PV…"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            />
          </div>

          {/* Tipo + Data lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vis-tipo">Tipo de Visita</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="vis-tipo">
                  <SelectValue placeholder="Tipo" />
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
              <Label htmlFor="vis-data">Data e Hora</Label>
              <Input
                id="vis-data"
                type="datetime-local"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="vis-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="vis-status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agendada">Agendada</SelectItem>
                <SelectItem value="Realizada">Realizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Objetivos */}
          <div className="space-y-1.5">
            <Label htmlFor="vis-objetivos">Objetivos da Visita</Label>
            <Textarea
              id="vis-objetivos"
              placeholder="Descreva os objetivos…"
              rows={2}
              value={objetivos}
              onChange={(e) => setObjetivos(e.target.value)}
            />
          </div>

          {/* Campos condicionais — só se Realizada */}
          {isRealizada && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="vis-relatorio">Relatório da Visita</Label>
                <Textarea
                  id="vis-relatorio"
                  placeholder="Descreva o que foi observado e as conclusões…"
                  rows={3}
                  value={relatorio}
                  onChange={(e) => setRelatorio(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vis-anotacao" className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-amber-600" />
                  Anotação Privada
                  <span className="text-[10px] text-muted-foreground">(apenas Diretoria)</span>
                </Label>
                <Textarea
                  id="vis-anotacao"
                  placeholder="Percepções sensíveis…"
                  rows={2}
                  className="border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-950/10"
                  value={anotacao}
                  onChange={(e) => setAnotacao(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {isRealizada ? "Registrar Visita" : "Agendar Visita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

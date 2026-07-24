import { useState } from "react";
import { UserPlus, Send, Check, ChevronsUpDown, Paperclip } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { unidadesList } from "@/lib/mock-data/unidades";
import { indicadoresDisponiveis, type PreviaTipo } from "@/lib/mock-data/previas";

interface NovaPreviaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal "Nova Prévia" (PRD-05 §6). Indicador/Formador usa autocomplete
 * (Popover + Command) restrito a consultores ativos — regra crítica do PRD.
 */
export function NovaPreviaModal({ open, onOpenChange }: NovaPreviaModalProps) {
  const [tipo, setTipo] = useState<PreviaTipo | "">("");
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [unidadeId, setUnidadeId] = useState("");
  const [indicadorId, setIndicadorId] = useState("");
  const [indicadorPopoverOpen, setIndicadorPopoverOpen] = useState(false);

  const indicadorSelecionado = indicadoresDisponiveis.find((i) => i.id === indicadorId);

  const reset = () => {
    setTipo(""); setNome(""); setDocumento(""); setEmail(""); setTelefone("");
    setUnidadeId(""); setIndicadorId("");
  };

  const handleSubmit = () => {
    onOpenChange(false);
    reset();
  };

  const isValid = tipo && nome.trim() && documento.trim() && unidadeId && indicadorId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Nova Prévia
          </DialogTitle>
          <DialogDescription>
            Inicie o credenciamento de um novo parceiro na rede.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor="prev-tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as PreviaTipo)}>
                <SelectTrigger id="prev-tipo">
                  <SelectValue placeholder="PF/PJ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">PF</SelectItem>
                  <SelectItem value="PJ">PJ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prev-nome">Nome Completo / Razão Social</Label>
              <Input
                id="prev-nome"
                placeholder={tipo === "PJ" ? "Razão social da empresa" : "Nome completo do candidato"}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prev-documento">{tipo === "PJ" ? "CNPJ" : "CPF"}</Label>
              <Input
                id="prev-documento"
                placeholder={tipo === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"}
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prev-unidade">Unidade de Destino</Label>
              <Select value={unidadeId} onValueChange={setUnidadeId}>
                <SelectTrigger id="prev-unidade">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesList.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prev-email">E-mail</Label>
              <Input
                id="prev-email"
                type="email"
                placeholder="contato@email.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prev-telefone">Telefone</Label>
              <Input
                id="prev-telefone"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prev-indicador">Indicador / Formador</Label>
            <Popover open={indicadorPopoverOpen} onOpenChange={setIndicadorPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="prev-indicador"
                  variant="outline"
                  role="combobox"
                  aria-expanded={indicadorPopoverOpen}
                  className="w-full justify-between font-normal"
                >
                  <span className={cn("truncate", !indicadorSelecionado && "text-muted-foreground")}>
                    {indicadorSelecionado
                      ? `${indicadorSelecionado.razaoSocial} • ${indicadorSelecionado.matricula}`
                      : "Buscar consultor ativo…"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar por razão social ou matrícula…" />
                  <CommandList>
                    <CommandEmpty>Nenhum consultor ativo encontrado.</CommandEmpty>
                    <CommandGroup>
                      {indicadoresDisponiveis.map((ind) => (
                        <CommandItem
                          key={ind.id}
                          value={`${ind.razaoSocial} ${ind.matricula}`}
                          onSelect={() => {
                            setIndicadorId(ind.id);
                            setIndicadorPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "h-3.5 w-3.5",
                              indicadorId === ind.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="flex-1 truncate">{ind.razaoSocial}</span>
                          <span className="text-xs text-muted-foreground">{ind.matricula}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Apenas parceiros credenciados ativos podem indicar novos parceiros.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prev-anexos">Documentos Obrigatórios</Label>
            <Input id="prev-anexos" type="file" multiple />
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Paperclip className="h-3 w-3" />
              RG/CNH, Contrato Social (se PJ) e comprovante de endereço.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            <Send className="mr-1.5 h-4 w-4" />
            Iniciar Prévia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, MessageSquare, CheckCircle2, ExternalLink, Clock, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  type OcorrenciaDetalhe,
  type OcorrenciaStatus,
  TIPO_CONFIG,
} from "@/lib/mock-data/ocorrencias";

interface OcorrenciaDetalheModalProps {
  ocorrencia: OcorrenciaDetalhe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_VARIANT: Record<OcorrenciaStatus, "destructive" | "warning" | "success"> = {
  Aberto: "destructive",
  "Em andamento": "warning",
  Resolvido: "success",
};

/**
 * Modal de detalhe e resolução de uma ocorrência.
 * Mostra descrição, entidades, anotação privada (visual diferenciado),
 * histórico de interações e área de resolução.
 */
export function OcorrenciaDetalheModal({ ocorrencia, open, onOpenChange }: OcorrenciaDetalheModalProps) {
  const navigate = useNavigate();
  const [comentario, setComentario] = useState("");
  const [desfecho, setDesfecho] = useState("");
  const config = TIPO_CONFIG[ocorrencia.tipo];
  const isResolvido = ocorrencia.status === "Resolvido";

  const handleNavigate = (tipo: string, id: string) => {
    onOpenChange(false);
    if (tipo === "Unidade") navigate(`/unidades/${id}`);
    else if (tipo === "PV") navigate(`/pvs/${id}`);
    else navigate(`/consultores/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
              {ocorrencia.tipo}
            </Badge>
            <Badge variant={STATUS_VARIANT[ocorrencia.status]}>
              {ocorrencia.status}
            </Badge>
          </div>
          <DialogTitle className="text-lg">{ocorrencia.titulo}</DialogTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ocorrencia.dataCriacao}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {ocorrencia.criador}
            </span>
            <span>Canal: {ocorrencia.canal}</span>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Descrição */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descrição</h4>
            <p className="text-sm leading-relaxed text-foreground">{ocorrencia.descricao}</p>
          </div>

          {/* Entidades vinculadas */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entidades envolvidas</h4>
            <div className="flex flex-wrap gap-2">
              {ocorrencia.entidades.map((ent) => (
                <button
                  key={ent.id}
                  onClick={() => handleNavigate(ent.tipo, ent.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <span className="text-muted-foreground">{ent.tipo}:</span>
                  {ent.nome}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Anotação privada */}
          {ocorrencia.anotacaoPrivada && (
            <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4 dark:border-amber-700 dark:bg-amber-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  Anotação Privada — Apenas Diretoria
                </span>
              </div>
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                {ocorrencia.anotacaoPrivada}
              </p>
            </div>
          )}

          <Separator />

          {/* Histórico de interações */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico de Interações ({ocorrencia.historicoInteracoes.length})
            </h4>
            {ocorrencia.historicoInteracoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma interação registrada.</p>
            ) : (
              <div className="space-y-3">
                {ocorrencia.historicoInteracoes.map((interacao, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{interacao.autor}</span>
                        <span className="text-[10px] text-muted-foreground">{interacao.data}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{interacao.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de resolução ou desfecho */}
          {isResolvido ? (
            <div className="rounded-xl bg-success/5 border border-success/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-xs font-semibold uppercase tracking-wide text-success">Resolvido</span>
              </div>
              {ocorrencia.desfecho && (
                <p className="text-sm text-foreground">{ocorrencia.desfecho}</p>
              )}
              {ocorrencia.dataResolucao && (
                <p className="mt-1 text-xs text-muted-foreground">Resolução em: {ocorrencia.dataResolucao}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <h4 className="text-sm font-semibold text-foreground">Adicionar Interação</h4>

              <div className="space-y-1.5">
                <Label htmlFor="occ-comentario">Comentário / Ação</Label>
                <Textarea
                  id="occ-comentario"
                  placeholder="Registre a evolução do caso…"
                  rows={2}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="occ-desfecho">Desfecho (para resolução)</Label>
                <Select value={desfecho} onValueChange={setDesfecho}>
                  <SelectTrigger id="occ-desfecho">
                    <SelectValue placeholder="Selecione se for resolver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acordo">Acordo</SelectItem>
                    <SelectItem value="Penalidade">Penalidade</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                    <SelectItem value="Descredenciamento">Descredenciamento</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!comentario.trim()}
                  onClick={() => setComentario("")}
                >
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  Adicionar Comentário
                </Button>
                <Button
                  size="sm"
                  disabled={!desfecho || !comentario.trim()}
                  onClick={() => onOpenChange(false)}
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Marcar como Resolvido
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

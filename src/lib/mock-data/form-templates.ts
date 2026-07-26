import {
  Type,
  AlignLeft,
  Hash,
  CalendarDays,
  CircleCheck,
  ListChecks,
  Upload,
  type LucideIcon,
} from "lucide-react";

/**
 * Mock do construtor de "Modelos de Formulário de Visita" (Configurações →
 * Modelos de Formulário). Escopo fora de qualquer PRD numerado — pedido
 * direto do usuário (2026-07-26, ver MEMORY.md): o operador monta modelos
 * reutilizáveis (nome + pilha de campos) que ficam disponíveis na hora de
 * registrar uma visita. Os 3 campos de identificação (Loja, Licenciado ou
 * gestor, Data da aplicação do checklist) são fixos em todo modelo — não
 * podem ser removidos nem ter o tipo alterado, só existem para deixar
 * explícito que já vêm preenchidos por padrão.
 */

export type CampoTipo = "texto" | "textarea" | "numero" | "data" | "sim-nao" | "select" | "upload";

export const CAMPO_TIPO_CONFIG: Record<CampoTipo, { label: string; icon: LucideIcon }> = {
  texto: { label: "Texto curto", icon: Type },
  textarea: { label: "Texto longo", icon: AlignLeft },
  numero: { label: "Número", icon: Hash },
  data: { label: "Data", icon: CalendarDays },
  "sim-nao": { label: "Sim / Não", icon: CircleCheck },
  select: { label: "Lista de opções", icon: ListChecks },
  upload: { label: "Upload de foto/arquivo", icon: Upload },
};

export interface CampoTemplate {
  id: string;
  label: string;
  tipo: CampoTipo;
  obrigatorio: boolean;
  /** Campo de identificação padrão — não pode ser removido nem ter o tipo alterado. */
  fixo?: boolean;
  /** Opções — só relevante quando tipo === "select". */
  opcoes?: string[];
}

export interface FormTemplate {
  id: string;
  nome: string;
  descricao: string;
  atualizadoEm: string;
  campos: CampoTemplate[];
  respostasQtd: number;
}

export const CAMPOS_FIXOS: CampoTemplate[] = [
  { id: "fixo-loja", label: "Loja", tipo: "select", obrigatorio: true, fixo: true },
  { id: "fixo-licenciado", label: "Licenciado ou gestor", tipo: "texto", obrigatorio: true, fixo: true },
  { id: "fixo-data", label: "Data da aplicação do checklist", tipo: "data", obrigatorio: true, fixo: true },
];

export const formTemplatesList: FormTemplate[] = [
  {
    id: "TMPL-001",
    nome: "Checklist Gerencial Padrão",
    descricao: "Os 10 itens completos do checklist de visita à rede — plano de carreiras, contratação, acelerador, multiplicador e comunicação visual.",
    atualizadoEm: "2026-07-20",
    campos: [
      ...CAMPOS_FIXOS,
      { id: "c1", label: "Plano de carreiras — Status", tipo: "sim-nao", obrigatorio: true },
      { id: "c2", label: "Processo de contratação periódico", tipo: "sim-nao", obrigatorio: true },
      { id: "c3", label: "Acelerador Ademicon — Status", tipo: "sim-nao", obrigatorio: true },
      { id: "c4", label: "Multiplicador — Nome", tipo: "texto", obrigatorio: true },
      { id: "c5", label: "Normativa Digital repassada", tipo: "sim-nao", obrigatorio: true },
      { id: "c6", label: "Observações adicionais", tipo: "textarea", obrigatorio: false },
      { id: "c7", label: "Fotos da comunicação visual", tipo: "upload", obrigatorio: false },
    ],
    respostasQtd: 12,
  },
  {
    id: "TMPL-002",
    nome: "Checklist Simplificado — Auditoria Express",
    descricao: "Versão reduzida para visitas rápidas de auditoria, focada em conformidade documental.",
    atualizadoEm: "2026-07-12",
    campos: [
      ...CAMPOS_FIXOS,
      { id: "a1", label: "Documentação em conformidade?", tipo: "sim-nao", obrigatorio: true },
      { id: "a2", label: "Fachada com comunicação visual adequada?", tipo: "sim-nao", obrigatorio: true },
      { id: "a3", label: "Observações da auditoria", tipo: "textarea", obrigatorio: false },
    ],
    respostasQtd: 4,
  },
  {
    id: "TMPL-003",
    nome: "Visita Comercial — Follow-up",
    descricao: "Acompanhamento comercial rápido: metas, carteiras ativas e próximos passos.",
    atualizadoEm: "2026-06-30",
    campos: [
      ...CAMPOS_FIXOS,
      { id: "f1", label: "Meta do trimestre revisada?", tipo: "sim-nao", obrigatorio: true },
      { id: "f2", label: "Quantidade de carteiras ativas", tipo: "numero", obrigatorio: false },
      { id: "f3", label: "Próximos passos combinados", tipo: "textarea", obrigatorio: false },
    ],
    respostasQtd: 7,
  },
];

export function getFormTemplate(id: string): FormTemplate | undefined {
  return formTemplatesList.find((t) => t.id === id);
}

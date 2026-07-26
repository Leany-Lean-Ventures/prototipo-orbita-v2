import { useNavigate } from "react-router-dom";
import { AlertTriangle, ShieldCheck, FileStack, Workflow, ArrowRight, type LucideIcon } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";

interface ConfigSection {
  path: string;
  icon: LucideIcon;
  color: string;
  titulo: string;
  descricao: string;
}

const SECOES: ConfigSection[] = [
  {
    path: "/configuracoes/alertas",
    icon: AlertTriangle,
    color: "#dc2626",
    titulo: "Gestão de Alertas",
    descricao: "Parametrize os gatilhos e severidades que disparam notificações no Dashboard.",
  },
  {
    path: "/configuracoes/perfis-acesso",
    icon: ShieldCheck,
    color: "#3b82f6",
    titulo: "Perfis de Acesso (RBAC)",
    descricao: "Visão estrutural de quem pode fazer o quê — Diretoria, Gerente BU, Backoffice e Lojista.",
  },
  {
    path: "/configuracoes/modelos-formularios",
    icon: FileStack,
    color: "#8bc34b",
    titulo: "Modelos de Formulário",
    descricao: "Crie e gerencie os modelos de checklist usados no registro de visitas às lojas.",
  },
];

const ConfiguracoesHubPage = () => {
  const navigate = useNavigate();

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".cfg-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".cfg-card", vars: { y: 16, opacity: 0, duration: 0.3, stagger: 0.08 }, position: "-=0.2" },
  ]);

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="cfg-header"
        title="Configurações do Sistema"
        subtitle="Gestão de alertas, parâmetros e modelos do sistema"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECOES.map((secao) => (
          <Card
            key={secao.path}
            interactive
            onClick={() => navigate(secao.path)}
            className="cfg-card relative flex flex-col gap-4 overflow-hidden p-6"
          >
            {/* Círculos decorativos gradiente — mesmo padrão do StatCard */}
            <div
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full"
              style={{ background: `linear-gradient(135deg, ${secao.color}33, ${secao.color}0d)` }}
            />
            <div
              className="absolute -right-1 -top-1 h-16 w-16 rounded-full"
              style={{ background: `linear-gradient(135deg, ${secao.color}1a, transparent)` }}
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-foreground">{secao.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{secao.descricao}</p>
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${secao.color}, ${secao.color}cc)` }}
              >
                <secao.icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="relative flex items-center gap-1.5 text-sm font-medium text-primary">
              Acessar
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConfiguracoesHubPage;

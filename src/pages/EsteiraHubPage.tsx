import { useNavigate } from "react-router-dom";
import { Building2, UserCog, ArrowRight, type LucideIcon } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";

interface EsteiraSection {
  path: string;
  icon: LucideIcon;
  color: string;
  titulo: string;
  descricao: string;
}

const SECOES: EsteiraSection[] = [
  {
    path: "/esteira/abertura-unidades",
    icon: Building2,
    color: "#8bc34b",
    titulo: "Abertura de Unidades",
    descricao: "Acompanhe cada solicitação de abertura de unidade, da solicitação inicial até a ativação, em um Kanban por etapas.",
  },
  {
    path: "/esteira/promocao-consultores",
    icon: UserCog,
    color: "#3b82f6",
    titulo: "Promoção de Consultores",
    descricao: "Esteira de promoção de consultores por nível de carreira — solicitação, validação, deliberação e efetivação.",
  },
];

const EsteiraHubPage = () => {
  const navigate = useNavigate();

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".est-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".est-card", vars: { y: 16, opacity: 0, duration: 0.3, stagger: 0.08 }, position: "-=0.2" },
  ]);

  return (
    <div ref={entranceRef} className="space-y-6">
      <PageHeader
        className="est-header"
        title="Esteira"
        subtitle="Processos operacionais da rede acompanhados etapa por etapa."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECOES.map((secao) => (
          <Card
            key={secao.path}
            interactive
            onClick={() => navigate(secao.path)}
            className="est-card relative flex flex-col gap-4 overflow-hidden p-6"
          >
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

export default EsteiraHubPage;

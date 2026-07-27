import { useParams, useNavigate, Navigate } from "react-router-dom";
import { UserRound, ArrowLeft } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { sociosDetalhe } from "@/lib/mock-data/socios";
import { EntityHeroHeader } from "@/components/entity-detail/EntityHeroHeader";
import { VinculosPanel } from "@/components/entity-detail/VinculosPanel";
import { Button } from "@/components/ui/button";
import headerBg from "@/assets/header-pv-background.jpg";

const SocioDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const socio = id ? sociosDetalhe[id] : undefined;

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".socio-voltar", vars: { y: -12, opacity: 0, duration: 0.3 } },
    { selector: ".socio-header", vars: { y: -16, opacity: 0, duration: 0.35 }, position: "-=0.15" },
    { selector: ".socio-vinculos", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
  ]);

  if (!socio) {
    return <Navigate to="/" replace />;
  }

  return (
    <div ref={entranceRef} className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="socio-voltar -ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <EntityHeroHeader
        className="socio-header"
        backgroundImage={headerBg}
        avatarFallback={<UserRound className="h-8 w-8 text-white/80" aria-hidden="true" />}
        verified={false}
        tag={socio.nivelLabel}
        location={`PV: ${socio.pv.nome}`}
        name={socio.nome}
        subtitle={`Documento: ${socio.documento}`}
      />

      <div className="socio-vinculos">
        <VinculosPanel vinculos={socio.vinculos} />
      </div>
    </div>
  );
};

export default SocioDetalhe;

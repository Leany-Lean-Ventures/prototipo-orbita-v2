import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { resolveNavLabel } from "@/components/shell/nav-items";

const ComingSoon = () => {
  const location = useLocation();
  const title = resolveNavLabel(location.pathname);

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".coming-soon-card", vars: { y: 16, opacity: 0 } },
  ]);

  return (
    <div
      ref={entranceRef}
      className="flex h-full min-h-[60vh] items-center justify-center"
    >
      <div className="coming-soon-card flex max-w-sm flex-col items-center gap-4 text-center">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground"
          aria-hidden="true"
        >
          <Construction className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Este módulo está em desenvolvimento e será liberado em uma
            próxima etapa do protótipo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import type { Rating } from "@/lib/mock-data/unidades";

// Verde (A) / âmbar (B) / vermelho (C) — mesma lógica semântica dos badges
// de status/rating do restante do app (ver KpiCard.tsx).
const RATING_COLOR: Record<Rating, string> = {
  A: "#8bc34b",
  B: "#f59e0b",
  C: "#dc2626",
};

interface RatingDonutProps {
  rating: Rating;
  score: number;
  /** Render on a dark background (hero header) — uses white text for the score label. */
  onDark?: boolean;
}

export function RatingDonut({ rating, score, onDark = false }: RatingDonutProps) {
  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
      animations: { enabled: !prefersReducedMotion(), speed: 600 },
      fontFamily: "'Lato', ui-sans-serif, system-ui, sans-serif",
    },
    colors: [RATING_COLOR[rating]],
    plotOptions: {
      radialBar: {
        hollow: { size: "62%" },
        track: { background: onDark ? "rgba(255,255,255,0.15)" : "hsl(214 32% 91%)" },
        dataLabels: {
          name: { show: false },
          value: {
            show: true,
            offsetY: 8,
            fontSize: "32px",
            fontWeight: 700,
            color: onDark ? "#ffffff" : "hsl(var(--foreground))",
            formatter: () => rating,
          },
        },
      },
    },
    stroke: { lineCap: "round" },
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Chart options={options} series={[score]} type="radialBar" width={140} height={140} />
      <p className={cn("-mt-2 text-xs font-semibold", onDark ? "text-white/70" : "text-muted-foreground")}>{score}/100</p>
      {/* Dado crítico sempre disponível como texto (design-system §12) */}
      <p className="sr-only">{`Rating ${rating}, score ${score} de 100.`}</p>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { usePageEntrance } from "@/hooks/use-page-entrance";

const swatches = [
  { label: "Primary (accent)", className: "bg-primary" },
  { label: "Secondary (accent-secondary)", className: "bg-secondary" },
  { label: "Success", className: "bg-success" },
  { label: "Warning", className: "bg-warning" },
  { label: "Destructive", className: "bg-destructive" },
  { label: "Info", className: "bg-info" },
];

const chartSwatches = [
  { label: "Chart 1", className: "bg-chart-1" },
  { label: "Chart 2", className: "bg-chart-2" },
  { label: "Chart 3", className: "bg-chart-3" },
  { label: "Chart 4", className: "bg-chart-4" },
  { label: "Chart 5", className: "bg-chart-5" },
];

const Index = () => {
  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".index-intro", vars: { y: -16, opacity: 0 } },
    {
      selector: ".index-card",
      vars: { y: 16, opacity: 0, duration: 0.45 },
      position: "-=0.2",
    },
  ]);

  return (
    <div ref={entranceRef}>
      <div className="index-intro mx-auto max-w-2xl text-center">
        <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground">
          Fundação Visual
        </h1>
        <p className="mb-8 text-muted-foreground">
          Tokens do design-system oficial aplicados: cores de marca, tipografia
          (Montserrat + IBM Plex Sans), sombras e raios.
        </p>
        <Button onClick={() => toast.success("Tokens aplicados com sucesso!")}>
          Testar toast
        </Button>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6">
        <Card className="index-card">
          <CardHeader>
            <CardTitle>Paleta de marca</CardTitle>
            <CardDescription>
              accent, accent-secondary e cores funcionais (AA-escurecidas)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {swatches.map((s) => (
                <div key={s.label} className="space-y-1.5">
                  <div className={`h-12 rounded-md ${s.className}`} />
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="index-card">
          <CardHeader>
            <CardTitle>Paleta de gráficos</CardTitle>
            <CardDescription>chart-1 a chart-5 — ordem fixa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {chartSwatches.map((s) => (
                <div key={s.label} className="space-y-1.5">
                  <div className={`h-12 rounded-md ${s.className}`} />
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="index-card grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">shadow-soft</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Nível 1 — Card
            </CardContent>
          </Card>
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-base">shadow-elevated</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Nível 2 — Raised
            </CardContent>
          </Card>
          <Card className="shadow-overlay">
            <CardHeader>
              <CardTitle className="text-base">shadow-overlay</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Nível 3 — Overlay
            </CardContent>
          </Card>
        </div>

        <Card className="index-card">
          <CardHeader>
            <CardTitle>Tipografia</CardTitle>
            <CardDescription>Montserrat (display) + IBM Plex Sans (corpo)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-display text-2xl font-bold text-foreground">
              Montserrat 700 — títulos e valores de KPI
            </p>
            <p className="font-sans text-base text-foreground">
              IBM Plex Sans 400 — corpo de texto e dados tabulares (1.234,56)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

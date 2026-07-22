import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-lg font-semibold">Órbita</span>
          <span className="text-sm text-muted-foreground">Ademicon</span>
        </div>
      </header>

      <main className="container py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Protótipo Órbita
          </h1>
          <p className="mb-8 text-muted-foreground">
            Ambiente de desenvolvimento configurado com Vite, React,
            TypeScript, Tailwind CSS e shadcn/ui.
          </p>
          <Button onClick={() => toast.success("Ambiente configurado com sucesso!")}>
            Testar ambiente
          </Button>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Stack</CardTitle>
              <CardDescription>
                React 18 + Vite 5 + TypeScript
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Componentes shadcn/ui sobre Radix UI e Tailwind CSS.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Próximos passos</CardTitle>
              <CardDescription>Construir as telas do Órbita</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Adicione novas rotas em <code>src/App.tsx</code> e páginas em{" "}
              <code>src/pages</code>.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;

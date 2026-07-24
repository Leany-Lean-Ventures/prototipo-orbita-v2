import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import { usePageEntrance } from "@/hooks/use-page-entrance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ademiconIcon from "@/assets/brand/ademicon-icone-vermelho.svg";
import loginBgVideo from "@/assets/login-background-video.webm";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Autenticação mockada: qualquer e-mail válido + senha não vazia autentica
 * com sucesso, exceto a senha "senha-invalida", reservada para demonstrar
 * o estado de erro (não há backend real neste protótipo).
 */
const INVALID_PASSWORD = "senha-invalida";

/** Latência simulada do "servidor" para o botão refletir um estado de carregamento real. */
const MOCK_AUTH_DELAY_MS = 400;

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  const entranceRef = usePageEntrance<HTMLDivElement>([
    {
      selector: ".login-card",
      vars: { y: 16, opacity: 0, duration: 0.45 },
    },
  ]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (values: LoginFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (values.senha === INVALID_PASSWORD) {
        setAuthError(true);
        setIsSubmitting(false);
        return;
      }
      setAuthError(false);
      login();
      navigate("/", { replace: true });
    }, MOCK_AUTH_DELAY_MS);
  };

  return (
    <div
      ref={entranceRef}
      className="relative flex min-h-screen items-center justify-center p-6 overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={loginBgVideo} type="video/webm" />
      </video>

      {/* Video Overlay with Blur */}
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="login-card rounded-card border border-white/50 bg-card/90 backdrop-blur-md p-6 shadow-soft dark:border-white/5">
          {/* Logo e Título Internos */}
          <div className="flex items-center justify-between gap-3 mb-6 select-none">
            <div className="flex items-center gap-3">
              <img
                src={ademiconIcon}
                alt="Ademicon"
                className="h-7 w-auto"
              />
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Órbita
              </h1>
            </div>
            <span className="text-xs text-muted-foreground">
              Acesse com suas credenciais
            </span>
          </div>
          {authError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>E-mail ou senha inválidos. Tente novamente.</span>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="voce@ademicon.com.br"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={() =>
                          toast.info(
                            "Recuperação de senha não está disponível neste protótipo."
                          )
                        }
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

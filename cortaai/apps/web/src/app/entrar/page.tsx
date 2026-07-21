"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard, AuthDivider, GoogleButton } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { demoGoogleIdToken } from "@/lib/google";
import { DEMO_EMAIL } from "@/lib/session-scope";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginGoogle } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  // Entra na conta de demonstração (com projetos e cortes de exemplo já
  // semeados) e vai direto para o app — o caminho ideal para quem chega pelo
  // link público e quer explorar o produto sem criar conta.
  async function handleDemo() {
    setDemoLoading(true);
    try {
      await login(DEMO_EMAIL, "demonstracao");
      toast("Bem-vindo à demonstração!", {
        description: "Explore o app com projetos e cortes de exemplo.",
      });
      router.push("/app");
    } catch {
      toast("Não foi possível abrir a demonstração", { variant: "error" });
      setDemoLoading(false);
    }
  }

  // Atalho de 1 clique a partir da landing: /entrar?demo=1 já abre a demo.
  // Usamos window.location (em vez de useSearchParams) para ser export-safe
  // no GitHub Pages, sem exigir uma fronteira de Suspense.
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1") {
      void handleDemo();
    }
    // Executa uma vez na montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Informe um e-mail válido.";
    if (password.length < 6) next.password = "A senha precisa de pelo menos 6 caracteres.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
      toast("Bem-vinda de volta!", { description: "Login realizado com sucesso." });
      router.push("/app");
    } catch {
      toast("Não foi possível entrar", {
        description: "Verifique e-mail e senha e tente novamente.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function completeGoogle(idToken: string) {
    setGoogleLoading(true);
    try {
      await loginGoogle(idToken);
      toast("Login com Google concluído");
      router.push("/app");
    } catch {
      toast("Falha no login com Google", { variant: "error" });
    } finally {
      setGoogleLoading(false);
    }
  }

  // Fallback de demonstração (sem Client ID do Google): entra com um token
  // demo decodificável, gerando um usuário de exemplo.
  async function handleGoogleDemo() {
    await completeGoogle(demoGoogleIdToken());
  }

  return (
    <AuthCard title="Entrar na sua conta" subtitle="Seus cortes estão esperando por você.">
      <div className="mb-2 rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 to-fuchsia-950/40 p-3">
        <Button
          type="button"
          className="w-full"
          onClick={handleDemo}
          loading={demoLoading}
        >
          🎬 Ver demonstração com exemplos
        </Button>
        <p className="mt-1.5 text-center text-[11px] text-zinc-400">
          Entre sem cadastro e explore o app com projetos e cortes de exemplo.
        </p>
      </div>
      <AuthDivider />
      <GoogleButton onClick={handleGoogleDemo} onCredential={completeGoogle} loading={googleLoading} />
      <AuthDivider />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="flex justify-end">
          <Link href="/recuperar-senha" className="text-xs text-violet-400 hover:text-violet-300">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-violet-400 hover:text-violet-300">
          Criar conta grátis
        </Link>
      </p>
    </AuthCard>
  );
}

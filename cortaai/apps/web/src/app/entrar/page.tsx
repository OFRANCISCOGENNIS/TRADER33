"use client";

// Acesso direto: o app não exige mais login com e-mail. Qualquer visita a
// /entrar abre o programa na hora — o app entra sozinho na conta de
// demonstração (com conteúdo de exemplo) pelo guardião em /app/layout.
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EntrarRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Abrindo o app">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  );
}

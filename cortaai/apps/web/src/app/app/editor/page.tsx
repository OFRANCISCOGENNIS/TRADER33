"use client";

// Rota legada mantida só como ponte: `/app/editor?cut=<id>` abre o clipe no
// Estúdio (/app/estudio), que é o editor de verdade.

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OpenCutInStudio } from "@/components/open-cut-in-studio";

function Loading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center" role="status" aria-label="Abrindo o Estúdio">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  );
}

function FromQuery() {
  const cutId = useSearchParams().get("cut") ?? "";
  return <OpenCutInStudio cutId={cutId} />;
}

export default function EditorBridgePage() {
  return (
    <Suspense fallback={<Loading />}>
      <FromQuery />
    </Suspense>
  );
}

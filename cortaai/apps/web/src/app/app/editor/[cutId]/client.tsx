"use client";

// Rota legada mantida só como ponte: `/app/editor/<id>` abre o clipe no
// Estúdio (/app/estudio), que é o editor de verdade.

import { useParams } from "next/navigation";
import { OpenCutInStudio } from "@/components/open-cut-in-studio";

export default function EditorBridgeByParam() {
  const params = useParams<{ cutId: string }>();
  return <OpenCutInStudio cutId={params.cutId} />;
}

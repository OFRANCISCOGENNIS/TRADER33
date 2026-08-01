"use client";

// Ponte /app/editor → /app/estudio.
//
// O editor antigo foi removido: existia um segundo editor, com controles de
// áudio que não processavam nada (ducking, LUFS, remoção de silêncio eram só
// estado). Os links antigos (`/app/editor?cut=<id>` e `/app/editor/<id>`)
// continuam válidos — aqui o clipe vira um projeto do Estúdio e o usuário é
// levado para lá, que é o editor de verdade.

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";
import { openInStudio } from "@/lib/open-in-studio";
import { toast } from "@/store/toast";

export function OpenCutInStudio({ cutId }: { cutId: string }) {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      // O destino é SEMPRE o Estúdio — quando o clipe não pode ser carregado,
      // explicamos o motivo por toast em vez de deixar o usuário sem saída.
      let motivo: string | null = null;
      try {
        if (cutId) {
          const cut = await api.getCut(cutId).catch(() => null);
          if (!cut) {
            motivo = "Esse clipe não existe mais.";
          } else {
            const project = await api.getProject(cut.projectId).catch(() => null);
            const result = await openInStudio({
              mediaId: project?.mediaId,
              mediaUrl: project?.mediaUrl,
              name: cut.title,
              startSec: cut.startSeconds,
              endSec: cut.endSeconds,
            });
            if (result.ok) {
              toast("Clipe aberto no Estúdio", {
                description: "Só o trecho do clipe entrou na timeline — edite à vontade.",
              });
            } else {
              motivo = result.reason;
            }
          }
        }
      } catch {
        motivo = "Não foi possível carregar esse clipe.";
      }
      if (motivo) {
        toast("Abrimos o Estúdio vazio", {
          description: `${motivo} Envie um vídeo em “Novo vídeo” para começar.`,
          variant: "info",
        });
      }
      router.replace("/app/estudio");
    })();
  }, [cutId, router]);

  return (
    <div
      className="flex min-h-[60dvh] items-center justify-center"
      role="status"
      aria-label="Abrindo o clipe no Estúdio"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  );
}

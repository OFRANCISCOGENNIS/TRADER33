// Suporte a exportação e escolha de codecs (WebCodecs) — compartilhado pelo
// pipeline de exportação do Estúdio.
//
// Ordem de codec: H.264+AAC (MP4) → VP9+Opus (WebM) → VP8+Opus (WebM),
// conforme o suporte real do navegador (isConfigSupported).

export interface ExportProgress {
  pct: number; // 0-100
  message: string;
}

export interface ExportResult {
  blob: Blob;
  mimeType: string;
  fileName: string;
}

export function isExportSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof VideoEncoder !== "undefined" &&
    typeof VideoFrame !== "undefined"
  );
}

// ------------------------------------------------------------- codec picking

export interface CodecPlan {
  container: "mp4" | "webm";
  videoCodec: string; // WebCodecs string
  audioCodec: string | null;
  mimeType: string;
  ext: string;
}

export async function pickCodecs(
  width: number,
  height: number,
  wantAudio: boolean,
  prefer?: "auto" | "mp4" | "webm",
): Promise<CodecPlan> {
  const tryVideo = async (codec: string) => {
    try {
      const res = await VideoEncoder.isConfigSupported({ codec, width, height, bitrate: 6_000_000 });
      return res.supported === true;
    } catch {
      return false;
    }
  };
  const tryAudio = async (codec: string, sampleRate: number) => {
    if (typeof AudioEncoder === "undefined") return false;
    try {
      const res = await AudioEncoder.isConfigSupported({ codec, sampleRate, numberOfChannels: 2, bitrate: 128_000 });
      return res.supported === true;
    } catch {
      return false;
    }
  };

  // MP4 (H.264 + AAC) — o mais compatível para redes sociais. Acima de 1080p
  // tenta perfis High com nível maior (1440p/4K/8K); mantém Baseline 3.1 como
  // padrão para ≤1080p (comportamento validado). Se nenhum H.264 servir na
  // resolução pedida, cai para VP9/WebM (que suporta 4K/8K).
  const px = width * height;
  if (prefer !== "webm") {
    const h264Candidates: string[] = [];
    if (px > 2_100_000) h264Candidates.push("avc1.640033", "avc1.64002a"); // High L5.1 / L4.2
    h264Candidates.push("avc1.42001f"); // Baseline L3.1
    for (const codec of h264Candidates) {
      if (await tryVideo(codec)) {
        const aacOk = !wantAudio || (await tryAudio("mp4a.40.2", 48000));
        if (aacOk) {
          return { container: "mp4", videoCodec: codec, audioCodec: wantAudio ? "mp4a.40.2" : null, mimeType: "video/mp4", ext: "mp4" };
        }
      }
    }
    if (prefer === "mp4") {
      throw new Error("Este navegador não codifica MP4 (H.264) nessa resolução — exporte em WebM, que toca em qualquer player");
    }
  }
  // WebM (VP9/VP8 + Opus) — sempre presente no Chromium.
  const opusOk = !wantAudio || (await tryAudio("opus", 48000));
  if ((await tryVideo("vp09.00.10.08")) && opusOk) {
    return { container: "webm", videoCodec: "vp09.00.10.08", audioCodec: wantAudio ? "opus" : null, mimeType: "video/webm", ext: "webm" };
  }
  if ((await tryVideo("vp8")) && opusOk) {
    return { container: "webm", videoCodec: "vp8", audioCodec: wantAudio ? "opus" : null, mimeType: "video/webm", ext: "webm" };
  }
  throw new Error("Nenhum codec de exportação é suportado neste navegador");
}

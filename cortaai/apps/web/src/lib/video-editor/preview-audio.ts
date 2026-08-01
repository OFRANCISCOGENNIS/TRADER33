// ROTEAMENTO DE ÁUDIO DA PRÉVIA (Web Audio).
//
// Sem isto, o player usava `el.volume` direto no <video>/<audio> e os
// tratamentos de áudio (reverb, eco, compressor, tom, ruído, voz) só eram
// ouvidos no arquivo exportado. Aqui cada elemento vira um nó de origem e
// passa pela MESMA cadeia da exportação (buildClipAudioChain), então o que se
// ouve na prévia é o que sai no arquivo.
//
// Detalhes importantes:
// - `createMediaElementSource` só pode ser chamado UMA vez por elemento, então
//   a origem é cacheada por elemento.
// - A cadeia é remontada quando os efeitos do clipe mudam (chave de assinatura).
// - O AudioContext começa suspenso por política de autoplay; `resume()` é
//   chamado no play (gesto do usuário).

import { buildClipAudioChain } from "./audio-fx";
import type { Clip } from "./model";

interface Routed {
  source: MediaElementAudioSourceNode;
  gain: GainNode;
  /** Assinatura dos efeitos com que a cadeia atual foi montada. */
  key: string;
  /** Nós intermediários, para desconectar ao remontar. */
  tail: AudioNode | null;
}

/** Assinatura dos parâmetros de áudio do clipe (muda → remonta a cadeia). */
export function audioFxKey(clip: Clip | null): string {
  if (!clip) return "none";
  return JSON.stringify([
    clip.audioFx?.denoise ?? false,
    clip.audioFx?.voice ?? false,
    clip.eq ?? null,
    clip.toneFx ?? null,
    clip.compressor ?? null,
    clip.echo ?? null,
    clip.reverb ?? null,
  ]);
}

export class PreviewAudioGraph {
  private ctx: AudioContext | null = null;
  private routed = new Map<HTMLMediaElement, Routed>();

  /** Cria (ou devolve) o AudioContext. Null quando não suportado. */
  private context(): AudioContext | null {
    if (this.ctx) return this.ctx;
    if (typeof window === "undefined") return null;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      this.ctx = new Ctor();
    } catch {
      return null;
    }
    return this.ctx;
  }

  /** Retoma o contexto (precisa de gesto do usuário — chamar no play). */
  resume(): void {
    const ctx = this.ctx ?? this.context();
    if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  }

  /**
   * Aplica volume e efeitos do clipe ao elemento. Devolve true quando o áudio
   * passou pelo grafo (quem chama não deve mexer em `el.volume`).
   */
  apply(el: HTMLMediaElement, clip: Clip | null, volume: number): boolean {
    const ctx = this.context();
    if (!ctx) return false;
    // segurança: uma vez roteado, o som só sai com o contexto ativo — se algo
    // chamou apply() fora do gesto de play, tenta retomar aqui também.
    if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);

    let entry = this.routed.get(el);
    if (!entry) {
      let source: MediaElementAudioSourceNode;
      try {
        source = ctx.createMediaElementSource(el);
      } catch {
        // elemento já ligado a outro contexto (ou sem CORS) → mantém o caminho simples
        return false;
      }
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      entry = { source, gain, key: "", tail: null };
      this.routed.set(el, entry);
      // volume passa a ser controlado pelo GainNode
      el.volume = 1;
    }

    const key = audioFxKey(clip);
    if (key !== entry.key) {
      try {
        entry.source.disconnect();
        entry.tail?.disconnect();
      } catch {
        /* já desconectado */
      }
      const tail = clip ? buildClipAudioChain(ctx, entry.source, clip) : entry.source;
      tail.connect(entry.gain);
      entry.tail = tail === entry.source ? null : tail;
      entry.key = key;
    }

    const v = Math.min(1, Math.max(0, volume));
    // rampa curta evita estalos ao variar o volume a cada frame
    try {
      entry.gain.gain.setTargetAtTime(v, ctx.currentTime, 0.01);
    } catch {
      entry.gain.gain.value = v;
    }
    return true;
  }

  /** Libera o grafo (desmontagem do componente). */
  dispose(): void {
    this.routed.forEach((r) => {
      try {
        r.source.disconnect();
        r.tail?.disconnect();
        r.gain.disconnect();
      } catch {
        /* ignore */
      }
    });
    this.routed.clear();
    if (this.ctx) {
      void this.ctx.close().catch(() => undefined);
      this.ctx = null;
    }
  }
}

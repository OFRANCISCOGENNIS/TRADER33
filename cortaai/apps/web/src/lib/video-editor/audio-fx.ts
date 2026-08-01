// CADEIA DE EFEITOS DE ÁUDIO por clipe — compartilhada pela PRÉVIA e pela
// EXPORTAÇÃO, para o que se ouve no player ser o que sai no arquivo.
//
// Funciona com qualquer BaseAudioContext: OfflineAudioContext (exportação) ou
// AudioContext (prévia ao vivo). Recebe o nó de origem e devolve o último nó
// da cadeia — quem chama conecta no ganho/destino.

import type { Clip } from "./model";

/**
 * Impulso sintético para o convolver (ruído decaindo exponencialmente) —
 * evita depender de um arquivo de impulso externo.
 */
export function makeReverbImpulse(ctx: BaseAudioContext, seconds: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.max(1, Math.floor(rate * seconds));
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      // cauda decaindo; o expoente controla o "tamanho" do ambiente
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  return buf;
}

/** True quando o clipe tem algum tratamento de áudio configurado. */
export function hasAudioFx(clip: Clip): boolean {
  return Boolean(
    clip.audioFx?.denoise ||
      clip.audioFx?.voice ||
      clip.eq ||
      clip.toneFx ||
      clip.compressor ||
      clip.echo ||
      clip.reverb,
  );
}

/**
 * Monta a cadeia de DSP do clipe a partir de `src` e devolve o nó final.
 * A ordem é: redução de ruído → voz → equalizador → tom → compressor →
 * eco → reverberação.
 */
export function buildClipAudioChain(ctx: BaseAudioContext, src: AudioNode, clip: Clip): AudioNode {
  let head: AudioNode = src;

  // redução de ruído básica
  if (clip.audioFx?.denoise) {
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 100; // corta ronco/vibração
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 7500; // corta chiado agudo
    head.connect(hp);
    hp.connect(lp);
    head = lp;
  }

  // realce de voz (presença + compressão)
  if (clip.audioFx?.voice) {
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 120;
    const presence = ctx.createBiquadFilter();
    presence.type = "peaking";
    presence.frequency.value = 3000;
    presence.Q.value = 1;
    presence.gain.value = 5; // presença/clareza da fala
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -28;
    comp.ratio.value = 4;
    comp.attack.value = 0.005;
    comp.release.value = 0.15;
    head.connect(hp);
    hp.connect(presence);
    presence.connect(comp);
    head = comp;
  }

  // equalizador de 3 bandas
  if (clip.eq) {
    const low = ctx.createBiquadFilter();
    low.type = "lowshelf";
    low.frequency.value = 250;
    low.gain.value = clip.eq.low;
    const mid = ctx.createBiquadFilter();
    mid.type = "peaking";
    mid.frequency.value = 1200;
    mid.Q.value = 0.9;
    mid.gain.value = clip.eq.mid;
    const high = ctx.createBiquadFilter();
    high.type = "highshelf";
    high.frequency.value = 4000;
    high.gain.value = clip.eq.high;
    head.connect(low);
    low.connect(mid);
    mid.connect(high);
    head = high;
  }

  // grave/agudo extra + telefone/rádio (passa-banda estreito)
  if (clip.toneFx) {
    if (clip.toneFx.bass) {
      const bass = ctx.createBiquadFilter();
      bass.type = "lowshelf";
      bass.frequency.value = 120;
      bass.gain.value = clip.toneFx.bass;
      head.connect(bass);
      head = bass;
    }
    if (clip.toneFx.treble) {
      const tre = ctx.createBiquadFilter();
      tre.type = "highshelf";
      tre.frequency.value = 6000;
      tre.gain.value = clip.toneFx.treble;
      head.connect(tre);
      head = tre;
    }
    if (clip.toneFx.phone) {
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 500;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 3000;
      head.connect(hp);
      hp.connect(lp);
      head = lp;
    }
  }

  // compressor por clipe: nivela picos (quanto maior, mais "colado")
  if (clip.compressor) {
    const a = clip.compressor.amount / 100;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -6 - 30 * a;
    comp.ratio.value = 1.5 + 10 * a;
    comp.knee.value = 24;
    comp.attack.value = 0.006;
    comp.release.value = 0.2;
    // compensa a perda de volume causada pela compressão
    const makeup = ctx.createGain();
    makeup.gain.value = 1 + 0.9 * a;
    head.connect(comp);
    comp.connect(makeup);
    head = makeup;
  }

  // eco / delay com realimentação (wet paralelo ao seco)
  if (clip.echo) {
    const mix = clip.echo.mix / 100;
    const delay = ctx.createDelay(2.5);
    delay.delayTime.value = Math.min(2.5, clip.echo.timeMs / 1000);
    const fb = ctx.createGain();
    fb.gain.value = Math.min(0.9, clip.echo.feedback / 100);
    const wet = ctx.createGain();
    wet.gain.value = mix;
    const dry = ctx.createGain();
    dry.gain.value = 1;
    const sum = ctx.createGain();
    head.connect(delay);
    delay.connect(fb);
    fb.connect(delay); // realimentação: repete o eco
    delay.connect(wet);
    head.connect(dry);
    dry.connect(sum);
    wet.connect(sum);
    head = sum;
  }

  // reverberação por convolução (impulso sintético decaindo)
  if (clip.reverb) {
    const mix = clip.reverb.mix / 100;
    const seconds = 0.25 + (clip.reverb.size / 100) * 2.75; // 0,25s .. 3s
    const conv = ctx.createConvolver();
    conv.buffer = makeReverbImpulse(ctx, seconds);
    const wet = ctx.createGain();
    wet.gain.value = mix;
    const dry = ctx.createGain();
    dry.gain.value = 1 - mix * 0.35; // mantém corpo do sinal seco
    const sum = ctx.createGain();
    head.connect(conv);
    conv.connect(wet);
    wet.connect(sum);
    head.connect(dry);
    dry.connect(sum);
    head = sum;
  }

  return head;
}

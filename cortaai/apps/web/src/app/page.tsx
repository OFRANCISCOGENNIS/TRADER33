import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clapperboard, Download, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "CortaAí — editor de vídeo no navegador",
  description:
    "Timeline multi-trilha, legendas em 8 estilos, correção de cor e exportação 4K. Tudo no navegador, de graça.",
  alternates: { canonical: "/" },
};

const FAQ_ITEMS = [
  {
    question: "Preciso instalar alguma coisa?",
    answer:
      "Não. Timeline, legendas, cor, editor de fotos e estúdio de capa rodam no navegador — sem download, sem plugin e sem enviar seus arquivos para terceiros.",
  },
  {
    question: "Quais formatos posso enviar?",
    answer: "MP4, MOV, MKV e WEBM, até 10 GB por arquivo.",
  },
  {
    question: "Como funcionam as legendas?",
    answer:
      "O áudio vira texto no navegador; você escolhe um dos 8 estilos e exporta queimado ou em .srt.",
  },
  {
    question: "Qual a qualidade máxima de exportação?",
    answer: "2160×3840 a 60 fps em H.264 ou H.265.",
  },
  {
    question: "Tem marca d'água ou cobrança?",
    answer: "Nenhuma das duas. Todos os recursos são gratuitos e sem marca d'água.",
  },
];

const PILLARS = [
  {
    n: "01",
    title: "Timeline multi-trilha",
    desc: "Corte no playhead, marque entrada e saída, desfaça tudo. Atalhos de teclado iguais aos de editor profissional.",
  },
  {
    n: "02",
    title: "Legendas com estilo",
    desc: "Oito estilos prontos, safe zone de cada rede e exportação em .srt. Um clique do áudio à legenda queimada.",
  },
  {
    n: "03",
    title: "Cor e áudio finos",
    desc: "Curvas, filtros, chroma key, transições e normalização em −14 LUFS — o padrão que as redes esperam.",
  },
];

const STEPS = [
  {
    n: "1",
    icon: Clapperboard,
    title: "Envie seu vídeo",
    desc: "Até 10 GB em MP4, MOV, MKV ou WEBM. Vários arquivos viram um só, no navegador.",
  },
  {
    n: "2",
    icon: Scissors,
    title: "Edite na timeline",
    desc: "Corte, ajuste cor e áudio, aplique legendas, textos, stickers e transições.",
  },
  {
    n: "3",
    icon: Download,
    title: "Exporte em até 4K",
    desc: "2160×3840 a 60 fps, com safe zones, legenda .srt, capa e descrição.",
  },
];

const FEATURES = [
  { title: "Timeline multi-trilha", desc: "Atalhos de teclado e histórico de versões automático." },
  { title: "Legendas em 8 estilos", desc: "Hormozi, karaokê, neon e mais — com safe zones e .srt." },
  { title: "Cor, efeitos e áudio", desc: "Curvas, chroma key, velocidade e normalização −14 LUFS." },
  { title: "Editor de fotos", desc: "Ajustes, filtros, retoque e geometria sem trocar de aba." },
  { title: "Estúdio de capa", desc: "Thumbnails com o seu kit de marca: logo, fontes e cores." },
  { title: "Exportação até 4K", desc: "H.264 ou H.265, 60 fps, com .srt, capa e descrição." },
];

/** Marca da landing: quadrado âmbar com cantos alternados + nome. */
function CineLogo({ size = 22 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="rounded-[6px_2px_6px_2px] bg-cine-accent"
        style={{ width: size, height: size }}
      />
      <span className="font-display text-[19px] font-bold tracking-[-0.02em]">CortaAí</span>
    </div>
  );
}

/** Demonstração animada do fluxo Envie → Edite → Exporte (CSS puro). */
function FlowDemo() {
  return (
    <div className="grid w-full grid-cols-3 gap-3 sm:gap-5" aria-hidden>
      <div className="animate-float rounded-2xl border border-cine-line2 bg-cine-panel p-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-cine-accent">
          <Clapperboard className="h-4 w-4" /> SEU VÍDEO
        </div>
        <div className="mt-3 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-1.5">
              <span className="h-6 w-9 rounded-md bg-cine-accent/70" />
              <span className="h-1.5 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </div>
        <div className="relative mt-3 h-1 overflow-hidden rounded bg-white/[0.06]">
          <span className="animate-flow-dot absolute h-1 w-1/3 rounded bg-cine-accent" />
        </div>
      </div>

      <div className="animate-float rounded-2xl border border-cine-line2 bg-cine-panel p-4 [animation-delay:600ms]">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-cine-accent">
          <Scissors className="h-4 w-4" /> TIMELINE
        </div>
        <div className="mt-3 flex h-[68px] items-end gap-[3px]">
          {[6, 12, 9, 18, 26, 20, 32, 24, 14, 30, 22, 10, 16, 8].map((h, i) => (
            <span
              key={i}
              className="animate-pulse-soft w-full rounded-sm bg-gradient-to-t from-cine-accent/40 to-cine-accent"
              style={{ height: `${h * 2}px`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.03] px-2 py-1.5 text-[10px] text-cine-mute">
          <span>Legendas + cor + áudio</span>
          <span className="font-mono text-cine-accent">ok</span>
        </div>
      </div>

      <div className="animate-float rounded-2xl border border-cine-line2 bg-cine-panel p-4 [animation-delay:1200ms]">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-cine-accent">
          <Download className="h-4 w-4" /> EXPORTAR 4K
        </div>
        <div className="mx-auto mt-3 h-[72px] w-11 rounded-lg border border-cine-line2 bg-black/40 p-1">
          <span className="block h-2 w-full rounded-sm bg-white/15" />
          <span className="mt-1 block h-1.5 w-3/4 rounded-sm bg-white/10" />
          <span className="mt-6 block h-1.5 w-full rounded-sm bg-cine-accent/60" />
        </div>
        <div className="relative mt-3 h-1.5 overflow-hidden rounded bg-white/[0.06]">
          <span className="animate-bar-grow absolute inset-y-0 left-0 rounded bg-cine-accent" />
        </div>
        <p className="mt-1.5 text-center font-mono text-[10px] text-cine-dim">2160×3840 · 60fps</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cine-bg font-sans text-cine-ink">
      <div className="mx-auto max-w-[1280px]">
        {/* ---------------------------------------------------------- nav */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-cine-line bg-cine-bg/90 px-5 py-4 backdrop-blur-xl sm:px-14 sm:py-6">
          <CineLogo />
          <nav className="hidden gap-8 text-[15px] text-cine-mute md:flex" aria-label="Navegação principal">
            <a href="#como-funciona" className="transition-opacity hover:opacity-70">Como funciona</a>
            <a href="#recursos" className="transition-opacity hover:opacity-70">Recursos</a>
            <a href="#faq" className="transition-opacity hover:opacity-70">Dúvidas</a>
          </nav>
          <Link
            href="/app"
            className="rounded-full bg-cine-ink px-5 py-2.5 text-[15px] font-semibold text-cine-bg transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-accent"
          >
            Abrir o editor
          </Link>
        </header>

        <main>
          {/* ------------------------------------------------------- hero */}
          <section className="flex flex-col items-center px-5 pt-14 text-center sm:px-14 sm:pt-24">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-cine-rule py-1.5 pl-2.5 pr-3.5 font-mono text-[12px] tracking-[0.04em] text-cine-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-cine-accent" />
              Roda no navegador · nada para instalar
            </p>
            <h1 className="mt-7 max-w-[1000px] text-balance font-display text-[44px] font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-[104px]">
              Edite. Legende.
              <br />
              Exporte em <span className="text-cine-accent">4K</span>.
            </h1>
            <p className="mt-6 max-w-[620px] text-pretty text-[17px] leading-[1.55] text-cine-mute sm:text-[20px]">
              Timeline multi-trilha, legendas com estilo, correção de cor e estúdio de capa — um
              editor de vídeo inteiro dentro de uma aba do navegador.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/app"
                className="rounded-full bg-cine-accent px-7 py-4 text-[16px] font-semibold text-cine-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-ink"
              >
                Editar meu primeiro vídeo
              </Link>
              <a
                href="#recursos"
                className="rounded-full border border-cine-rule px-7 py-4 text-[16px] font-semibold transition-colors hover:border-cine-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-accent"
              >
                Ver recursos
              </a>
            </div>
            <p className="mt-4 font-mono text-[12px] tracking-[0.04em] text-cine-dim">
              grátis · sem limites · sem cartão
            </p>

            <div className="mt-14 w-full max-w-[1080px] rounded-[18px] border border-cine-line2 bg-gradient-to-b from-[#101014] to-cine-bg p-2.5 sm:p-4">
              <FlowDemo />
            </div>
          </section>

          {/* --------------------------------------------------- 3 pilares */}
          <section className="mt-16 border-t border-cine-line px-5 py-16 sm:mt-24 sm:px-14 sm:py-20">
            <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 lg:flex-row lg:items-end">
              <h2 className="max-w-[620px] font-display text-[32px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[52px]">
                Poder de estúdio,
                <br />
                leveza de navegador.
              </h2>
              <p className="max-w-[360px] text-pretty text-[17px] leading-[1.6] text-cine-mute">
                Corte, ajuste e legende em tempo real. O que antes exigia 4 GB de instalação agora
                abre em um clique.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {PILLARS.map((p) => (
                <div
                  key={p.n}
                  className="flex min-h-[250px] flex-col gap-3 rounded-2xl border border-cine-line2 bg-cine-panel p-8"
                >
                  <span className="font-mono text-[12px] tracking-[0.08em] text-cine-accent">{p.n}</span>
                  <h3 className="mt-1.5 font-display text-[25px] font-semibold tracking-[-0.02em]">{p.title}</h3>
                  <p className="text-[16px] leading-[1.6] text-cine-mute">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------- antes/depois */}
          <section className="border-t border-cine-line px-5 py-16 sm:px-14 sm:py-20">
            <h2 className="mb-11 max-w-[700px] font-display text-[32px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[52px]">
              Do arquivo bruto ao vídeo pronto, em uma aba.
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-cine-line2 p-9 opacity-60">
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-cine-mute">Antes</p>
                <h3 className="mb-5 mt-3.5 font-display text-[28px] font-semibold tracking-[-0.025em]">
                  Instalar 4 GB e esperar renderizar
                </h3>
                <ul className="flex flex-col gap-3 text-[16px] text-cine-mute">
                  {[
                    "Programa pago e pesado para tarefas simples",
                    "Legenda feita na mão, uma linha por vez",
                    "Capa e fotos em outro aplicativo",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="text-cine-dim">—</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-cine-accent bg-[#0F0B09] p-9">
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-cine-accent">Depois</p>
                <h3 className="mb-5 mt-3.5 font-display text-[28px] font-semibold tracking-[-0.025em]">
                  Abrir a aba e exportar
                </h3>
                <ul className="flex flex-col gap-3 text-[16px] text-[#CFCBC2]">
                  {[
                    "Timeline multi-trilha com atalhos de teclado",
                    "Oito estilos de legenda aplicados em 1 clique",
                    "Editor de fotos e estúdio de capa integrados",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="text-cine-accent">+</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------- como funciona */}
          <section id="como-funciona" className="border-t border-cine-line px-5 py-16 sm:px-14 sm:py-20">
            <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="font-display text-[32px] font-bold tracking-[-0.035em] sm:text-[52px]">
                Como funciona
              </h2>
              <p className="max-w-[340px] text-[17px] text-cine-mute">
                Três passos entre o arquivo bruto e o vídeo publicado.
              </p>
            </div>
            <ol className="grid border-t border-cine-rule md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`border-t border-cine-rule pt-8 md:border-t-0 ${
                    i < 2 ? "md:border-r md:pr-8" : "md:pl-8"
                  } ${i === 1 ? "md:px-8" : ""}`}
                >
                  <span
                    className={`font-display text-[72px] font-extrabold leading-none tracking-[-0.04em] ${
                      i === 2 ? "text-cine-accent" : "text-cine-ghost"
                    }`}
                  >
                    {s.n}
                  </span>
                  <h3 className="mb-2.5 mt-4 font-display text-[24px] font-semibold tracking-[-0.02em]">
                    {s.title}
                  </h3>
                  <p className="pb-8 text-[16px] leading-[1.6] text-cine-mute">{s.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* ----------------------------------------------------- recursos */}
          <section id="recursos" className="border-t border-cine-line px-5 py-16 sm:px-14 sm:py-20">
            <div className="mb-12 text-center">
              <h2 className="font-display text-[32px] font-bold tracking-[-0.035em] sm:text-[52px]">
                Tudo liberado, de graça
              </h2>
              <p className="mx-auto mt-3.5 max-w-[520px] text-[18px] text-cine-mute">
                Sem plano, sem cota de minutos, sem marca d&apos;água.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-cine-line2 bg-cine-line2 md:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-cine-cell p-8">
                  <h3 className="mb-2 font-display text-[20px] font-semibold">{f.title}</h3>
                  <p className="text-[15px] leading-[1.6] text-cine-mute">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------------- faq */}
          <section
            id="faq"
            className="grid gap-10 border-t border-cine-line px-5 py-16 sm:px-14 sm:py-20 lg:grid-cols-[340px_1fr] lg:gap-16"
          >
            <h2 className="font-display text-[32px] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[44px]">
              Perguntas frequentes
            </h2>
            <div className="flex flex-col">
              {FAQ_ITEMS.map((item, i) => (
                <details
                  key={item.question}
                  name="faq"
                  open={i === 0}
                  className={`faq-item border-t border-cine-rule py-5 ${
                    i === FAQ_ITEMS.length - 1 ? "border-b" : ""
                  }`}
                >
                  <summary className="flex cursor-pointer list-none justify-between gap-5 text-[19px] font-semibold">
                    {item.question}
                    <span aria-hidden className="faq-sign shrink-0 text-cine-dim" />
                  </summary>
                  <p className="mt-3.5 max-w-[620px] text-[16px] leading-[1.65] text-cine-mute">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------------- cta */}
          <section className="bg-cine-accent px-5 py-20 text-center text-cine-bg sm:px-14 sm:py-28">
            <h2 className="text-balance font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-[76px]">
              Seu próximo vídeo
              <br />
              já está gravado.
            </h2>
            <p className="mt-5 text-[20px] opacity-75">Só falta cortar, legendar e exportar.</p>
            <Link
              href="/app"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-cine-bg px-9 py-[18px] text-[17px] font-semibold text-cine-accent transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-bg"
            >
              Abrir o editor agora <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </main>

        {/* ------------------------------------------------------- footer */}
        <footer className="border-t border-cine-line px-5 sm:px-14">
          <div className="flex flex-col justify-between gap-8 py-12 sm:flex-row">
            <div className="max-w-[340px]">
              <CineLogo size={18} />
              <p className="mt-3 text-[14px] leading-[1.6] text-cine-dim">
                Editor de vídeo no navegador. Feito no Brasil para criadores do mundo todo.
              </p>
            </div>
            <nav className="flex flex-wrap gap-8 text-[14px] text-cine-mute" aria-label="Links do rodapé">
              <a href="#como-funciona" className="transition-opacity hover:opacity-70">Como funciona</a>
              <a href="#recursos" className="transition-opacity hover:opacity-70">Recursos</a>
              <Link href="/app" className="transition-opacity hover:opacity-70">Abrir o editor</Link>
            </nav>
          </div>
          <p className="pb-10 font-mono text-[11px] tracking-[0.04em] text-cine-faint">
            © 2026 CortaAí Tecnologia Ltda.
          </p>
        </footer>
      </div>
    </div>
  );
}

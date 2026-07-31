"use client";

import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  className?: string;
  /** Preenche a partir do centro (zero) em vez da esquerda — para controles com
   *  sinal, ex.: comprimir (negativo) ⟷ expandir (positivo). */
  bipolar?: boolean;
  "aria-label"?: string;
}

export function Slider({ value, min, max, step = 1, onChange, label, className, bipolar, ...aria }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  // No modo bipolar, o preenchimento vai do zero até o valor (para qualquer lado).
  const zeroPct = ((0 - min) / (max - min)) * 100;
  const lo = Math.min(zeroPct, pct);
  const hi = Math.max(zeroPct, pct);
  const background = bipolar
    ? `linear-gradient(to right, #1e1e2a ${lo}%, #8b5cf6 ${lo}%, #8b5cf6 ${hi}%, #1e1e2a ${hi}%)`
    : `linear-gradient(to right, #8b5cf6 ${pct}%, #1e1e2a ${pct}%)`;
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-400">
          <span>{label}</span>
          <span className="font-mono text-zinc-300">{bipolar && value > 0 ? `+${value}` : value}</span>
        </div>
      )}
      <div className="relative">
        {bipolar && (
          // Marca central (zero) para orientar o usuário.
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 z-10 h-3.5 w-px -translate-y-1/2 bg-zinc-500"
            style={{ left: `${zeroPct}%` }}
          />
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={aria["aria-label"] ?? label ?? "Controle deslizante"}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          style={{ background }}
        />
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

/**
 * Grafik renkleri TEMA TOKENLARINDAN okunur — grafik kendi rengini getirmez
 * (CLAUDE.md → "Grafikler tema tokenlarını kullansın").
 *
 * getComputedStyle ile :root'tan çözülür; prefers-color-scheme değişimi izlenir.
 * SSR / ilk boyada `chartFallback` (tokens.css koyu tema değerleri) kullanılır.
 */
export type ChartColors = {
  accent: string;
  accentGlow: string;
  signal: string;
  positive: string;
  text: string;
  textSecondary: string;
  grid: string;
  surface: string;
};

export const chartFallback: ChartColors = {
  accent: '#4d7cff',
  accentGlow: '#7b6bff',
  signal: '#ff6b4a',
  positive: '#3ddc97',
  text: '#eaf0f7',
  textSecondary: '#9aa9bc',
  grid: '#1c2530',
  surface: '#141b24',
};

const VARS: Record<keyof ChartColors, string> = {
  accent: '--color-accent',
  accentGlow: '--color-accent-glow',
  signal: '--color-signal',
  positive: '--color-positive',
  text: '--color-text',
  textSecondary: '--color-text-secondary',
  grid: '--color-rule',
  surface: '--color-surface-lift',
};

function readColors(): ChartColors {
  const cs = getComputedStyle(document.documentElement);
  const next = { ...chartFallback };
  for (const key of Object.keys(VARS) as (keyof ChartColors)[]) {
    const value = cs.getPropertyValue(VARS[key]).trim();
    if (value) next[key] = value;
  }
  return next;
}

export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(chartFallback);

  useEffect(() => {
    setColors(readColors());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setColors(readColors());
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return colors;
}

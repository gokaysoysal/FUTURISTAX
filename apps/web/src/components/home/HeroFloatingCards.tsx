'use client';

import { formatDaysRemaining, formatIsoDate } from '@/lib/format';
import { distance } from '@/lib/motion';
import type { ExchangeRateTable } from '@futuristax/tax-engine';
import { useEffect, useRef, useState } from 'react';

/**
 * Hero'nun önündeki dört yüzen kart — WebGL sahnesinin üstünde.
 *
 * - İmleçle parallax (her kart farklı derinlik katsayısı) + sürekli yavaş
 *   sürüklenme (CSS `@keyframes hero-drift`, art.css).
 * - `prefers-reduced-motion` veya kaba işaretçi → sabit, sürüklenme yok.
 * - Kartlarda GERÇEK veri: sıradaki yükümlülük, güncel kur (istemci fetch;
 *   erişilemezse "—", uydurma kur YOK), örnek vergi yükü, 30 günlük yoğunluk.
 * - Masaüstünde absolute konumlu; `<lg` ekranda normal ızgara (aşağıda).
 */

type Deadline = { title: string; date: string; daysRemaining: number };

export function HeroFloatingCards({
  nextDeadline,
  deadlineCount,
  burdenTotalLabel,
}: {
  nextDeadline: Deadline | null;
  deadlineCount: number;
  burdenTotalLabel: string;
}) {
  const layerRef = useRef<HTMLUListElement>(null);
  const [fx, setFx] = useState<
    { status: 'loading' } | { status: 'error' } | { status: 'ready'; rate: number; asOf: string }
  >({ status: 'loading' });

  // Güncel kur — TCMB (server route). Erişilemezse "—", uydurma değer yok.
  useEffect(() => {
    let alive = true;
    fetch('/api/rates')
      .then((r) => r.json())
      .then((body) => {
        if (!alive) return;
        const table = body?.ok ? (body.data as ExchangeRateTable) : null;
        const rate = table?.tryPerUnit?.USD;
        if (rate && Number.isFinite(rate)) {
          setFx({ status: 'ready', rate, asOf: table.asOf });
        } else {
          setFx({ status: 'error' });
        }
      })
      .catch(() => alive && setFx({ status: 'error' }));
    return () => {
      alive = false;
    };
  }, []);

  // İmleç parallax — yalnızca ince işaretçi + reduced-motion yoksa.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        for (const el of Array.from(layer.children)) {
          const depth = Number((el as HTMLElement).dataset.depth ?? '1');
          (el as HTMLElement).style.setProperty(
            '--px',
            `${nx * distance.parallax * 0.12 * depth}px`,
          );
          (el as HTMLElement).style.setProperty(
            '--py',
            `${ny * distance.parallax * 0.12 * depth}px`,
          );
        }
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cards: { key: string; depth: number; label: string; value: string; sub: string }[] = [
    {
      key: 'deadline',
      depth: 1.6,
      label: 'Sıradaki yükümlülük',
      value: nextDeadline ? nextDeadline.title : 'Tanımlı son tarih yok',
      sub: nextDeadline
        ? `${formatIsoDate(nextDeadline.date)} · ${formatDaysRemaining(nextDeadline.daysRemaining)}`
        : 'Önümüzdeki dönem',
    },
    {
      key: 'fx',
      depth: 2.4,
      label: 'USD/TRY (TCMB)',
      value:
        fx.status === 'ready'
          ? `₺${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(fx.rate)}`
          : fx.status === 'loading'
            ? '…'
            : '—',
      sub:
        fx.status === 'ready'
          ? `1 USD · ${formatIsoDate(fx.asOf)}`
          : fx.status === 'loading'
            ? 'yükleniyor'
            : 'kur şu an güncellenemiyor',
    },
    {
      key: 'burden',
      depth: 1.2,
      label: 'Örnek yıllık vergi yükü',
      value: burdenTotalLabel,
      sub: 'örnek girdilerle · araçlarda hesaplayın',
    },
    {
      key: 'density',
      depth: 2,
      label: 'Önümüzdeki 30 gün',
      value: `${deadlineCount} yükümlülük`,
      sub: 'beyan + bildirim',
    },
  ];

  return (
    <ul
      ref={layerRef}
      aria-label="Özet veriler"
      className="hero-cards pointer-events-none mt-12 grid grid-cols-2 gap-3 lg:mt-0 lg:block"
    >
      {cards.map((c, i) => (
        <li
          key={c.key}
          data-depth={c.depth}
          className={`hero-card glass rounded-xl border border-[var(--color-rule)] p-4 lg:absolute lg:w-52 hero-card-${i + 1}`}
        >
          <p className="text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
            {c.label}
          </p>
          <p
            data-numeric
            className="mt-1 text-[length:var(--text-base)] font-medium text-[var(--color-text)]"
          >
            {c.value}
          </p>
          <p className="mt-1 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
            {c.sub}
          </p>
        </li>
      ))}
    </ul>
  );
}

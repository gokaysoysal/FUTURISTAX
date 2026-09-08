'use client';

import { formatDaysRemaining, formatIsoDate } from '@/lib/format';
import { loadGsap } from '@/lib/motion/gsap-lazy';
import { prefersReducedMotion } from '@/lib/motion/scroll';
import type { ExchangeRateTable } from '@futuristax/tax-engine';
import { useEffect, useRef, useState } from 'react';

/**
 * Hero'nun önündeki dört yüzen kart — kalıcı arka plan sahnesinin üstünde.
 *
 * - SCROLL'A BAĞLI hareket (V5 Bölüm 2): hero kaydırıldıkça her kart derinlik
 *   katsayısına göre farklı hızda yukarı süzülür, hafifçe döner/ölçeklenir ve
 *   sağa/sola dağılarak solar (GSAP ScrollTrigger, scrub). Ani kaybolma yok.
 * - `prefers-reduced-motion` → hiç hareket yok; kartlar yerinde durur.
 * - Hareket YALNIZCA `xl`+ (kartlar absolute konumluyken); `<xl` ızgara akışında
 *   dokunulmaz.
 * - Kartlarda GERÇEK veri: sıradaki yükümlülük, güncel kur (istemci fetch;
 *   erişilemezse "—", uydurma kur YOK), örnek vergi yükü, 30 günlük yoğunluk.
 * - `xl`+ ekranda absolute konumlu (sol/sağ raylar, başlık sütununun dışında);
 *   `<xl` ekranda CTA'ların altında normal ızgara — başlığa binmez (V5 Bölüm 1).
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

  // Scroll'a bağlı hareket — hero kaydırıldıkça kartlar dağılarak süzülür.
  // Yalnızca xl+ (absolute konum) ve reduced-motion kapalıyken. GSAP tembel.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(min-width: 1280px)').matches) return;
    const section = layer.closest('section');
    if (!section) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;
      const items = Array.from(layer.children) as HTMLElement[];
      const tweens = items.map((el, i) => {
        const depth = Number(el.dataset.depth ?? '1');
        const dir = i % 2 === 0 ? -1 : 1;
        return gsap.to(el, {
          yPercent: -(8 + depth * 12),
          xPercent: dir * (10 + depth * 5),
          rotate: dir * depth * 1.6,
          scale: 1 + depth * 0.02,
          autoAlpha: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      });
      cleanup = () => {
        for (const t of tweens) {
          t.scrollTrigger?.kill();
          t.kill();
        }
        gsap.set(items, { clearProps: 'all' });
        ScrollTrigger.refresh();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
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
      className="hero-cards pointer-events-none mt-12 grid grid-cols-2 gap-3 xl:mt-0 xl:block"
    >
      {cards.map((c, i) => (
        <li
          key={c.key}
          data-depth={c.depth}
          className={`hero-card glass rounded-xl border border-[var(--color-rule)] p-4 xl:absolute xl:w-[12rem] hero-card-${i + 1}`}
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

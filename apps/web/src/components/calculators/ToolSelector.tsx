'use client';

import type { ToolMeta } from '@/lib/tools';
import { useRef } from 'react';

/**
 * Araç seçici — APG "Tabs with automatic activation" deseni.
 *
 * - `role="tablist"` + `role="tab"`; seçili sekme `tabIndex=0`, diğerleri `-1`
 *   (roving tabindex). ArrowLeft/Right/Home/End ile gezinir ve seçer.
 * - Dar ekranda yatay kaydırılır; kaydırma klavye kullanıcısını hapsetmez.
 * - Seçim URL'i de değiştirir (ToolWorkspace) — derin link + paylaşım çalışır.
 */
export function ToolSelector({
  tools,
  active,
  onSelect,
}: {
  tools: readonly ToolMeta[];
  active: string;
  onSelect: (slug: string) => void;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (dir: -1 | 1 | 'home' | 'end') => {
    const i = tools.findIndex((t) => t.slug === active);
    const next =
      dir === 'home'
        ? 0
        : dir === 'end'
          ? tools.length - 1
          : (i + dir + tools.length) % tools.length;
    const slug = tools[next]?.slug;
    if (!slug) return;
    onSelect(slug);
    refs.current[slug]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Hesaplama aracı"
      aria-orientation="horizontal"
      className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]"
      onKeyDown={(event) => {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            move(-1);
            break;
          case 'ArrowRight':
            event.preventDefault();
            move(1);
            break;
          case 'Home':
            event.preventDefault();
            move('home');
            break;
          case 'End':
            event.preventDefault();
            move('end');
            break;
          default:
            break;
        }
      }}
    >
      {tools.map((tool) => {
        const selected = tool.slug === active;
        return (
          <button
            key={tool.slug}
            ref={(el) => {
              refs.current[tool.slug] = el;
            }}
            type="button"
            role="tab"
            id={`tool-tab-${tool.slug}`}
            aria-selected={selected}
            aria-controls="tool-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(tool.slug)}
            className={`shrink-0 whitespace-nowrap border px-3.5 py-2 text-[length:var(--text-xs)] transition-colors ${
              selected
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-on-accent)]'
                : 'border-[var(--color-rule)] text-[var(--color-text-secondary)] hover:border-[var(--color-rule-strong)] hover:text-[var(--color-text)]'
            }`}
          >
            {tool.short}
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { type SearchEntry, buildSearchIndex } from '@/lib/search';
import { normalizeTr } from '@/lib/search/normalize';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Custom event ile herhangi bir yerden açılır (ör. header "Ara" düğmesi). */
export const CMDK_OPEN_EVENT = 'cmdk:open';

const MAX_RESULTS = 8;

export function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const index = useMemo(() => buildSearchIndex(), []);
  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: 'nTitle', weight: 0.7 },
          { name: 'nBody', weight: 0.3 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [index],
  );

  const results: SearchEntry[] = useMemo(() => {
    const q = normalizeTr(query);
    if (!q) {
      // Boş sorgu: her gruptan ilk birkaç giriş — keşif için.
      return index.filter((e) => e.group === 'Hesaplayıcı' || e.group === 'Hizmet').slice(0, MAX_RESULTS);
    }
    return fuse.search(q, { limit: MAX_RESULTS }).map((r) => r.item);
  }, [query, fuse, index]);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const openPalette = useCallback(() => {
    if (dialogRef.current?.open) return;
    restoreFocusRef.current = document.activeElement;
    setQuery('');
    setActive(0);
    dialogRef.current?.showModal();
    setOpen(true);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // Global kısayol: Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else openPalette();
      }
    };
    const onOpenEvent = () => openPalette();
    window.addEventListener('keydown', onKey);
    window.addEventListener(CMDK_OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(CMDK_OPEN_EVENT, onOpenEvent);
    };
  }, [openPalette, close]);

  // <dialog> kapanışı (Esc dâhil): durumu eşitle, odağı geri ver.
  const onDialogClose = useCallback(() => {
    setOpen(false);
    document.documentElement.style.overflow = '';
    const el = restoreFocusRef.current;
    if (el instanceof HTMLElement) el.focus();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Bileşen açıkken sökülürse scroll kilidini bırak.
  useEffect(() => () => {
    document.documentElement.style.overflow = '';
  }, []);

  const go = useCallback(
    (entry: SearchEntry | undefined) => {
      if (!entry) return;
      close();
      router.push(entry.href);
    },
    [router, close],
  );

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(results.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="cmdk"
      aria-label="Site içi arama"
      onClose={onDialogClose}
      onClick={(e) => {
        // backdrop tıklaması dialog'un kendisine hedeflenir
        if (e.target === dialogRef.current) close();
      }}
    >
      {open ? (
        <div className="flex max-h-[70vh] flex-col">
          <div className="flex items-center gap-3 border-b border-[var(--color-rule)] px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Hizmet, sektör, makale, hesaplayıcı, SSS ara…"
              role="combobox"
              aria-expanded="true"
              aria-controls="cmdk-listbox"
              aria-activedescendant={results[active] ? `cmdk-opt-${active}` : undefined}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent text-[length:var(--text-base)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            />
            <kbd className="basis-ref rounded border border-[var(--color-rule)] px-1.5 py-0.5">Esc</kbd>
          </div>

          <ul id="cmdk-listbox" role="listbox" aria-label="Arama sonuçları" className="overflow-y-auto py-2">
            {results.length === 0 ? (
              <li className="px-4 py-6 text-center text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                “{query}” için sonuç yok. Farklı bir terim deneyin.
              </li>
            ) : (
              results.map((entry, i) => (
                <li
                  key={entry.id}
                  id={`cmdk-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => go(entry)}
                    onMouseMove={() => setActive(i)}
                    className={`flex w-full items-baseline gap-3 px-4 py-2 text-left ${
                      i === active ? 'bg-[var(--color-accent-soft)]' : ''
                    }`}
                  >
                    <span className="text-[length:var(--text-sm)] text-[var(--color-text)]">
                      {entry.title}
                    </span>
                    <span className="basis-ref shrink-0">{entry.group}</span>
                    <span className="ml-auto hidden truncate text-[length:var(--text-xs)] text-[var(--color-text-muted)] sm:block sm:max-w-[46%]">
                      {entry.description}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </dialog>
  );
}

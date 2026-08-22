'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Çerez onay bandı.
 *
 * Onay verilmeden analitik yüklenmez (Consent Mode v2). Reddetme seçeneği
 * kabul etmek kadar kolay olmalıdır — "sadece kabul et" düğmesi koymuyoruz.
 *
 * Tercih localStorage'da değil, birinci taraf çerezde tutulur: sunucu
 * tarafında da okunabilmesi gerekiyor.
 */
const COOKIE_NAME = 'ftx-consent';
const MAX_AGE = 60 * 60 * 24 * 180; // 180 gün

type Choice = 'granted' | 'denied';

function readConsent(): Choice | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=(granted|denied)`));
  return (match?.[1] as Choice | undefined) ?? null;
}

function writeConsent(choice: Choice) {
  document.cookie = `${COOKIE_NAME}=${choice}; path=/; max-age=${MAX_AGE}; SameSite=Lax; Secure`;
  window.dispatchEvent(new CustomEvent('ftx:consent', { detail: choice }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  function decide(choice: Choice) {
    writeConsent(choice);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="consent-heading"
      aria-describedby="consent-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-rule)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="consent-heading"
            className="text-[length:var(--text-sm)] font-medium text-[var(--color-text)]"
          >
            Çerez tercihiniz
          </h2>
          <p
            id="consent-description"
            className="mt-1 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
          >
            Sitenin çalışması için gerekli çerezler her durumda kullanılır. Ziyaret
            istatistiklerini ölçmek için ek çerezleri yalnızca onayınızla kullanırız.{' '}
            <Link href="/cerez-politikasi" className="text-[var(--color-ink)] underline underline-offset-2">
              Çerez politikası
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="border border-[var(--color-rule-strong)] px-5 py-2.5 text-[length:var(--text-xs)] text-[var(--color-text)] hover:border-[var(--color-ink)]"
          >
            Yalnızca gerekli
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="bg-[var(--color-ink)] px-5 py-2.5 text-[length:var(--text-xs)] font-medium text-white hover:bg-[var(--color-ink-strong)]"
          >
            Tümünü kabul et
          </button>
        </div>
      </div>
    </div>
  );
}

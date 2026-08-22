'use client';

import { site } from '@futuristax/config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Ana navigasyon.
 *
 * Eski sitede navigasyon `<button onclick="switchTab(...)">` ile yapılıyordu:
 * derin link yoktu, geri tuşu çalışmıyordu, bağlantı paylaşılamıyordu.
 * Artık gerçek <Link> — her sayfa kendi URL'sinde.
 */
const NAV = [
  { href: '/kurumsal', label: 'Kurumsal' },
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/sektorler', label: 'Sektörler' },
  { href: '/araclar', label: 'Araçlar' },
  { href: '/mevzuat', label: 'Mevzuat' },
  { href: '/sss', label: 'SSS' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-canvas)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-[length:var(--text-lg)] text-[var(--color-text)]"
        >
          {site.brand.shortName}
        </Link>

        <nav aria-label="Ana menü" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`text-[length:var(--text-sm)] transition-colors ${
                      active
                        ? 'text-[var(--color-text)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/iletisim"
            className="hidden bg-[var(--color-ink)] px-4 py-2 text-[length:var(--text-xs)] font-medium text-white hover:bg-[var(--color-ink-strong)] sm:block"
          >
            Görüşme talep et
          </Link>

          <button
            type="button"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Menüyü kapat' : 'Menüyü aç'}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobil menü"
          className="border-t border-[var(--color-rule)] md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-2">
            {NAV.map((item) => (
              <li key={item.href} className="ledger-rule last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

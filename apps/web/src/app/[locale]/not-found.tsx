import Link from 'next/link';

/**
 * Boş durum bir yön göstergesidir, mood değil.
 * Ne olduğunu söyler ve nereye gidileceğini gösterir.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <p className="basis-ref uppercase">404</p>
      <h1 className="mt-3 text-[length:var(--text-3xl)]">Bu sayfa bulunamadı</h1>
      <p className="mt-4 text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
        Adres değişmiş ya da bağlantı hatalı olabilir. Aradığınız şey büyük ihtimalle
        aşağıdakilerden biri.
      </p>
      <ul className="mt-8 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
        {[
          { href: '/hizmetler', label: 'Hizmetler' },
          { href: '/araclar', label: 'Hesaplama araçları' },
          { href: '/mevzuat', label: 'Mevzuat ve duyurular' },
          { href: '/iletisim', label: 'İletişim' },
        ].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block py-3 text-[length:var(--text-sm)] text-[var(--color-ink)] hover:text-[var(--color-ink-strong)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

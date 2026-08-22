import { site } from '@futuristax/config';
import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Kurumsal',
    links: [
      { href: '/kurumsal', label: 'Hakkımızda' },
      { href: '/kariyer', label: 'Kariyer' },
      { href: '/referanslar', label: 'Referanslar' },
    ],
  },
  {
    title: 'Hizmetler',
    links: [
      { href: '/hizmetler', label: 'Tüm hizmetler' },
      { href: '/sektorler', label: 'Sektörler' },
      { href: '/araclar', label: 'Hesaplama araçları' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { href: '/kvkk', label: 'KVKK aydınlatma metni' },
      { href: '/gizlilik', label: 'Gizlilik politikası' },
      { href: '/cerez-politikasi', label: 'Çerez politikası' },
    ],
  },
];

export function SiteFooter() {
  const { address } = site.contact;

  return (
    <footer className="mt-[var(--spacing-section)] border-t border-[var(--color-rule)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-[length:var(--text-lg)] text-[var(--color-text)]">
            {site.brand.name}
          </p>
          <address className="mt-3 not-italic text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
            {address.street}
            <br />
            {address.district} / {address.city}
            <br />
            <a href={`tel:${site.contact.phoneE164}`} className="hover:text-[var(--color-text)]">
              {site.contact.phoneDisplay}
            </a>
            <br />
            <a href={`mailto:${site.contact.email}`} className="hover:text-[var(--color-text)]">
              {site.contact.email}
            </a>
          </address>
          <p className="mt-3 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
            {site.contact.officeHours.tr}
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-text-muted)]">
              {column.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-[var(--color-rule)]">
        <p className="mx-auto max-w-6xl px-5 py-5 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          © {site.brand.foundedYear}–{new Date().getFullYear()} {site.brand.name}. Sitedeki bilgiler
          genel bilgilendirme amaçlıdır ve mali müşavirlik hizmeti yerine geçmez.
        </p>
      </div>
    </footer>
  );
}

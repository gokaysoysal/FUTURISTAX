import { ContactForm } from '@/components/sections/ContactForm';
import { clientEnv, site } from '@futuristax/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Danışmanlık talebi oluşturun. İlk görüşme ücretsizdir.',
};

export default function ContactPage() {
  const { address } = site.contact;
  const turnstileSiteKey = clientEnv().NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="ledger-rule pb-4">
        <p className="basis-ref uppercase">İletişim</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Danışmanlık talebi</h1>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          <p className="text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
            Formu doldurun, en geç bir iş günü içinde dönüş yapalım. Acil konularda doğrudan
            arayabilirsiniz.
          </p>

          <dl className="space-y-4 border-t border-[var(--color-rule)] pt-6">
            <div>
              <dt className="text-[length:var(--text-xs)] uppercase text-[var(--color-text-muted)]">
                Adres
              </dt>
              <dd className="mt-1 text-[length:var(--text-sm)] text-[var(--color-text)]">
                {address.street}, {address.district} / {address.city}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-xs)] uppercase text-[var(--color-text-muted)]">
                Telefon
              </dt>
              <dd className="mt-1">
                <a
                  href={`tel:${site.contact.phoneE164}`}
                  className="text-[length:var(--text-sm)] text-[var(--color-ink)]"
                >
                  {site.contact.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-xs)] uppercase text-[var(--color-text-muted)]">
                E-posta
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-[length:var(--text-sm)] text-[var(--color-ink)]"
                >
                  {site.contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 sm:p-8">
          <ContactForm turnstileSiteKey={turnstileSiteKey} />
        </div>
      </div>
    </div>
  );
}

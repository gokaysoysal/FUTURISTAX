import { PageHero } from '@/components/content/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { ContactForm } from '@/components/sections/ContactForm';
import { clientEnv, site } from '@futuristax/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Danışmanlık talebi oluşturun. İlk görüşme ücretsizdir.',
};

/*
 * İLETİŞİM — dönüşümün olduğu sayfa; site içindeki en güçlü sahne.
 *
 * Sol sütun: neden yazılacağını netleştiren kısa güvence listesi + iletişim
 * bilgileri. Sağ sütun: kenar parıltılı kart içinde form. Ana sayfayla aynı
 * ritim (PageHero + Reveal).
 */

const ASSURANCES = [
  ['İlk görüşme ücretsiz', 'Yüz yüze ya da çevrim içi; bağlayıcı değil.'],
  ['Bir iş günü içinde dönüş', 'Acil konularda doğrudan telefonla ulaşın.'],
  [
    'Talebiniz KVKK kapsamında işlenir',
    'Yalnızca size dönüş yapmak için; üçüncü tarafla paylaşılmaz.',
  ],
] as const;

export default function ContactPage() {
  const { address } = site.contact;
  const turnstileSiteKey = clientEnv().NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHero
        eyebrow="İletişim"
        title="Danışmanlık talebi"
        backdrop="light-field"
        lead="Şirketinizin vergi ve mali yapısını konuşalım. Formu doldurun; en geç bir iş günü içinde dönüş yapalım."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
        <Reveal className="space-y-8">
          <ul className="space-y-5">
            {ASSURANCES.map(([title, body]) => (
              <li key={title} className="grid grid-cols-[auto_1fr] gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--color-accent)]"
                />
                <span>
                  <span className="block text-[length:var(--text-sm)] text-[var(--color-text)]">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ul>

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
                  className="link-underline text-[length:var(--text-sm)] text-[var(--color-accent)]"
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
                  className="link-underline text-[length:var(--text-sm)] text-[var(--color-accent)]"
                >
                  {site.contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.08} className="card surface-glow p-6 sm:p-8">
          <ContactForm turnstileSiteKey={turnstileSiteKey} />
        </Reveal>
      </div>
    </div>
  );
}

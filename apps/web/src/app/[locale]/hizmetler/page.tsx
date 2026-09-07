import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PageHero } from '@/components/content/PageHero';
import { RequestCta } from '@/components/content/RequestCta';
import { Reveal } from '@/components/motion/Reveal';
import { SERVICES } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hizmetler',
  description:
    'Vergi danışmanlığı, vergi denetimi ve risk analizi, finansal danışmanlık, mevzuat uyumu, ' +
    'kurumsal raporlama, uluslararası vergilendirme, kurumsal yapılandırma, yatırım teşvik ' +
    'yönetimi ve bağımsız denetim desteği.',
  alternates: { canonical: '/hizmetler' },
  openGraph: { title: 'Hizmetler', url: '/hizmetler', type: 'website' },
};

export default function ServicesHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHero
        eyebrow="Hizmetler"
        title="Çalışma alanlarımız"
        backdrop="geometric-shadow"
        breadcrumbs={<Breadcrumbs trail={[{ name: 'Hizmetler', path: '/hizmetler' }]} />}
        lead="Danışmanlığı dönemsel bir hizmet değil, sürekli bir çalışma ilişkisi olarak kuruyoruz. Aşağıdaki alanlar birlikte yürür; çoğu şirket bunlardan birkaçına aynı anda ihtiyaç duyar."
      />

      <Reveal className="mt-12">
        <ul className="grid gap-px bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.slug} className="bg-[var(--color-canvas)]">
              <Link
                href={`/hizmetler/${service.slug}`}
                className="block h-full p-6 transition-colors hover:bg-[var(--color-surface)]"
              >
                <h2 className="text-[length:var(--text-lg)] text-[var(--color-text)]">
                  {service.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {service.summary}
                </p>
                <span className="basis-ref mt-3 inline-block">Ayrıntı →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-12">
        <RequestCta />
      </div>
    </div>
  );
}

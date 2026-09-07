import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PageHero } from '@/components/content/PageHero';
import { RequestCta } from '@/components/content/RequestCta';
import { Reveal } from '@/components/motion/Reveal';
import { SECTORS } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sektörler',
  description:
    'İmalat, inşaat ve gayrimenkul, bilişim ve yazılım, sağlık, perakende ve e-ticaret, ' +
    'lojistik, hizmet ve danışmanlık sektörlerine özel vergi ve mali danışmanlık.',
  alternates: { canonical: '/sektorler' },
  openGraph: { title: 'Sektörler', url: '/sektorler', type: 'website' },
};

export default function SectorsHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHero
        eyebrow="Sektörler"
        title="Sektörel yaklaşım"
        backdrop="geometric-shadow"
        breadcrumbs={<Breadcrumbs trail={[{ name: 'Sektörler', path: '/sektorler' }]} />}
        lead="Aynı vergi kuralı, her sektörde farklı bir operasyonel gerçeğe oturur. Aşağıdaki alanlarda, sektörün kendi diliyle çalışıyoruz."
      />

      <Reveal className="mt-12">
        <ul className="grid gap-px bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector) => (
            <li key={sector.slug} className="bg-[var(--color-canvas)]">
              <Link
                href={`/sektorler/${sector.slug}`}
                className="block h-full p-6 transition-colors hover:bg-[var(--color-surface)]"
              >
                <h2 className="text-[length:var(--text-lg)] text-[var(--color-text)]">
                  {sector.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {sector.summary}
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

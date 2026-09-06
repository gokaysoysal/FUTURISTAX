import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { RequestCta } from '@/components/content/RequestCta';
import { Reveal } from '@/components/motion/Reveal';
import { TOOLS } from '@/lib/tools';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hesaplama araçları',
  description:
    'KDV, gelir vergisi, kurumlar vergisi, binek araç gider ve kira kısıtı, SGK işveren maliyeti, ' +
    'kıdem tazminatı, TÜFE güncelleme ve kur çevirici. Yıl bazlı oranlar, adım adım döküm.',
  alternates: { canonical: '/araclar' },
  openGraph: { title: 'Hesaplama araçları', url: '/araclar', type: 'website' },
};

export default function ToolsHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Breadcrumbs trail={[{ name: 'Araçlar', path: '/araclar' }]} />

      <header className="ledger-rule mt-6 pb-4">
        <p className="basis-ref uppercase">Araçlar</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Hesaplama araçları</h1>
      </header>

      <p className="mt-6 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
        Her araç yalnızca sonucu değil, hesabın nasıl çıktığını da gösterir. Kalemlerin dayandığı
        kanun maddeleri satır satır belirtilir; oranlar seçtiğiniz vergi yılına göre gelir.
      </p>

      <Reveal className="mt-10">
        <ul className="grid gap-px bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <li key={tool.slug} className="bg-[var(--color-canvas)]">
              <Link
                href={`/araclar/${tool.slug}`}
                className="block h-full p-6 transition-colors hover:bg-[var(--color-surface)]"
              >
                <h2 className="text-[length:var(--text-lg)] text-[var(--color-text)]">
                  {tool.short}
                </h2>
                <p className="mt-2 line-clamp-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {tool.description}
                </p>
                <span className="basis-ref mt-3 inline-block">{tool.basis}</span>
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

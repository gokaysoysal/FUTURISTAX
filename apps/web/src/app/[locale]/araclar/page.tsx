import { ToolWorkspace } from '@/components/calculators/ToolWorkspace';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { RequestCta } from '@/components/content/RequestCta';
import { YearComparisonPanel } from '@/components/dashboards/YearComparisonPanel';
import { Reveal } from '@/components/motion/Reveal';
import { TOOLS } from '@/lib/tools';
import type { Metadata } from 'next';

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
        Dokuz araç tek çalışma alanında. Araç değiştirdikçe form ve sonuç yerinde geçiş yapar; her
        araç kendi girdisini, adım adım dökümünü ve kendi sonucunu gösteren grafiğini taşır. Oranlar
        seçtiğiniz vergi yılına göre gelir.
      </p>

      <Reveal className="mt-10">
        <YearComparisonPanel />
      </Reveal>

      <div className="mt-12">
        <ToolWorkspace initialSlug={TOOLS[0]?.slug ?? 'kdv'} />
      </div>

      <div className="mt-14">
        <RequestCta />
      </div>
    </div>
  );
}

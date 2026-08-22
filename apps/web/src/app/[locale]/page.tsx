import { site } from '@futuristax/config';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TaxCalendarPanel } from '@/components/tax-calendar/TaxCalendarPanel';

export const metadata: Metadata = {
  description:
    'Ankara merkezli vergi ve mali danışmanlık. Beyanname takvimi, hesaplama araçları ve ' +
    'kurumsal vergi planlaması.',
};

/*
 * ANA SAYFA
 *
 * Tasarım tezi: hero'da soyut bir slogan yerine, ziyaretçinin gerçekten
 * ihtiyacı olan şey duruyor — bir sonraki beyanname ne zaman. Vergi Takvimi
 * ekranın üst yarısında; marka anlatısı onun etrafında sakin duruyor.
 *
 * Bu, "büyük rakam + küçük etiket + gradient" şablon hero'sunun bilinçli reddi.
 */

const SERVICES = [
  { slug: 'vergi-danismanligi', title: 'Vergi danışmanlığı', summary: 'Kurumlar vergisi, gelir vergisi ve KDV planlaması.' },
  { slug: 'vergi-denetimi', title: 'Vergi denetimi ve risk analizi', summary: 'İnceleme hazırlığı ve itiraz süreçlerinin yönetimi.' },
  { slug: 'finansal-danismanlik', title: 'Finansal danışmanlık', summary: 'Nakit akışı, bütçe ve karar destek analitiği.' },
  { slug: 'mevzuat-uyumu', title: 'Mali mevzuat uyumu', summary: 'Değişen regülasyonlara uyum ve cezai risk azaltımı.' },
  { slug: 'kurumsal-raporlama', title: 'Kurumsal raporlama', summary: 'TFRS/IFRS uyumlu finansal raporlama.' },
  { slug: 'uluslararasi-vergilendirme', title: 'Uluslararası vergilendirme', summary: 'ÇVÖA, transfer fiyatlandırması, KYK analizi.' },
];

export default function HomePage() {
  // Referans tarih sunucuda üretilir; takvim bileşeni saat okumaz.
  const referenceDate = new Date().toISOString().slice(0, 10);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-[var(--spacing-section-sm)]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="lg:pt-8">
            <p className="basis-ref uppercase">Ankara · {site.brand.foundedYear}'ten beri</p>
            <h1 className="mt-4 text-[length:var(--text-4xl)] text-[var(--color-text)]">
              Vergi, yönetilebilir bir kalem hâline gelir.
            </h1>
            <p className="mt-5 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
              {site.brand.name}, şirketlere vergi, finans ve uyum süreçlerinde danışmanlık
              verir. Yükümlülüklerinizi takip etmekle başlarız; yapıyı kurmakla sürdürürüz.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/iletisim"
                className="bg-[var(--color-ink)] px-6 py-3 text-[length:var(--text-sm)] font-medium text-white hover:bg-[var(--color-ink-strong)]"
              >
                Görüşme talep et
              </Link>
              <Link
                href="/araclar"
                className="border border-[var(--color-rule-strong)] px-6 py-3 text-[length:var(--text-sm)] text-[var(--color-text)] hover:border-[var(--color-ink)]"
              >
                Hesaplama araçları
              </Link>
            </div>
          </div>

          {/* İmza bileşeni */}
          <TaxCalendarPanel referenceDate={referenceDate} horizonDays={60} limit={6} />
        </div>
      </section>

      <section
        aria-labelledby="services-heading"
        className="mx-auto max-w-6xl px-5 py-[var(--spacing-section-sm)]"
      >
        <div className="ledger-rule pb-4">
          <p className="basis-ref uppercase">Hizmetler</p>
          <h2 id="services-heading" className="mt-1 text-[length:var(--text-2xl)]">
            Çalışma alanlarımız
          </h2>
        </div>

        <ul className="mt-8 grid gap-px bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.slug} className="bg-[var(--color-canvas)]">
              <Link
                href={`/hizmetler/${service.slug}`}
                className="block h-full p-6 transition-colors hover:bg-[var(--color-surface)]"
              >
                <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {service.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-[var(--spacing-section-sm)]">
        <div className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 sm:p-12">
          <h2 className="text-[length:var(--text-2xl)]">İlk görüşme ücretsizdir</h2>
          <p className="mt-3 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
            Mevcut vergi yapınızı, risk alanlarınızı ve optimizasyon fırsatlarınızı birlikte
            değerlendirelim. Görüşme yüz yüze ya da çevrim içi yapılabilir.
          </p>
          <Link
            href="/iletisim"
            className="mt-6 inline-block bg-[var(--color-ink)] px-6 py-3 text-[length:var(--text-sm)] font-medium text-white hover:bg-[var(--color-ink-strong)]"
          >
            Görüşme talep et
          </Link>
        </div>
      </section>
    </>
  );
}

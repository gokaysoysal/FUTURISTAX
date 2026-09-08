import { BRAND_MARK_COUNT, BrandMark } from '@/components/home/BrandMarks';

/**
 * LOGO ŞERİDİ (V4-AKIS Bölüm 2 — referans sırası #3)
 *
 * Sonsuz yatay kayan şerit. GERÇEK şirket logosu YOK — soyut geometrik SVG
 * marka işaretleri. reduced-motion altında `home.css` kaymayı durdurur;
 * şerit yine iki kopya olduğu için görsel olarak dolu kalır.
 */
const items = Array.from({ length: BRAND_MARK_COUNT }, (_, i) => i);

/** Tek kayan sıra — iki özdeş şerit, `marquee-slide` %50 kayma ile kusursuz. */
function Row({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  return (
    <div className={`marquee ${reverse ? 'marquee-reverse marquee-slow' : ''}`} aria-hidden="true">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0">
          {items.map((i) => (
            <span
              key={`${copy}-${i}`}
              className="flex w-40 shrink-0 items-center justify-center px-4 text-[var(--color-text-muted)]"
            >
              <BrandMark index={(i + offset) % BRAND_MARK_COUNT} className="h-9 w-9" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * LOGO ŞERİDİ (V4-AKIS Bölüm 2 — referans sırası #3 · V6 çift sıra)
 *
 * İki sıra: üst sıra sola, alt sıra ters yöne ve biraz yavaş kayar (parallax
 * hissi). GERÇEK şirket logosu YOK — soyut geometrik SVG marka işaretleri.
 * reduced-motion altında `home.css` kaymayı durdurur; sıralar iki kopya
 * olduğu için görsel olarak dolu kalır.
 */
export function LogoMarquee() {
  return (
    <section
      aria-label="Çalıştığımız sektörler"
      className="overflow-hidden py-[var(--spacing-section-sm)]"
    >
      <p className="basis-ref mb-8 px-5 text-center uppercase">Çalıştığımız sektörler</p>
      <div className="relative flex flex-col gap-4">
        <Row />
        <Row reverse offset={3} />
        {/* kenar solması */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--color-canvas)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--color-canvas)] to-transparent" />
      </div>
    </section>
  );
}

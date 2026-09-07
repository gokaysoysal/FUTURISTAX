import { HeroCanvas } from '@/components/hero/HeroCanvas';
import { ProcessScene, TrustBand } from '@/components/home/ProcessScene';
import { SceneSection } from '@/components/home/SceneSection';
import { SectorsGrid } from '@/components/home/SectorsGrid';
import { ServicesRail } from '@/components/home/ServicesRail';
import { ToolsShowcase } from '@/components/home/ToolsShowcase';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { TaxCalendarPanel } from '@/components/tax-calendar/TaxCalendarPanel';
import { site } from '@futuristax/config';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  description:
    'Ankara merkezli vergi ve mali danışmanlık. Beyanname takvimi, hesaplama araçları ve ' +
    'kurumsal vergi planlaması.',
};

/*
 * ANA SAYFA — sinematik akış (V3 sunum katmanı, BÖLÜM 4)
 *
 * Her bölüm bir "sahne": hero → güven bandı → vergi takvimi → hizmetler →
 * süreç → araçlar → sektörler → kapanış. Sahneler arasında görsel bir nefes
 * (`SceneSection` → `SceneBackdrop` + `scene-divider`). Gradyan her yüzeye
 * yayılmaz; backdrop seçici ve düşük opaklıkta.
 *
 * Altyapıya dokunulmadı: TaxCalendarPanel ve TaxBurdenPanel aynı motor +
 * saf hesap katmanını kullanıyor.
 */

export default function HomePage() {
  // Referans tarih sunucuda üretilir; takvim bileşeni saat okumaz.
  const referenceDate = new Date().toISOString().slice(0, 10);

  return (
    <>
      {/* 1 — HERO: WebGL sahne (progressive) + büyük tipografi + tek net CTA */}
      <section className="section-beam relative isolate flex min-h-[82vh] items-center overflow-hidden px-5 pt-16 pb-[var(--spacing-section)]">
        <HeroCanvas />
        <div className="relative z-10 mx-auto w-full max-w-4xl">
          <Reveal>
            <p className="basis-ref uppercase">Ankara · {site.brand.foundedYear}'ten beri</p>
          </Reveal>
          <SplitHeading
            as="h1"
            className="mt-4 text-[length:var(--text-4xl)] text-[var(--color-text)] sm:text-[length:var(--text-6xl)]"
          >
            Vergi, yönetilebilir bir kalem hâline gelir.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)] sm:text-[length:var(--text-lg)]">
              {site.brand.name}, şirketlere vergi, finans ve uyum süreçlerinde danışmanlık verir.
              Yükümlülüklerinizi takip etmekle başlarız; yapıyı kurmakla sürdürürüz.
            </p>
            <div className="mt-9">
              <MagneticButton>
                <Link
                  href="/iletisim"
                  className="btn btn-primary px-7 py-3.5 text-[length:var(--text-sm)]"
                >
                  Görüşme talep et
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — GÜVEN BANDI: doğrulanmamış istatistik yok, konumlandırma cümlesi */}
      <SceneSection id="konum" backdrop="light-field">
        <TrustBand foundedYear={site.brand.foundedYear} />
      </SceneSection>

      {/* 3 — VERGİ TAKVİMİ: sitenin imza bileşeni */}
      <SceneSection
        id="takvim"
        eyebrow="İmza bileşen"
        title="Bir sonraki yükümlülük ne zaman"
        lead="Yaklaşan beyanname ve bildirim tarihleri; hafta sonu ve resmî tatile denk gelenler VUK Md. 18 uyarınca ilk iş gününe uzatılır."
        backdrop="document-grid"
      >
        <Reveal className="surface-glow">
          <TaxCalendarPanel referenceDate={referenceDate} horizonDays={75} limit={8} />
        </Reveal>
      </SceneSection>

      {/* 4 — HİZMETLER: yatay akan kart dizisi */}
      <SceneSection
        id="hizmetler"
        eyebrow="Hizmetler"
        title="Çalışma alanlarımız"
        lead="Vergi, denetim, finans ve uyum tarafında birbirini tamamlayan dokuz başlık."
        backdrop="geometric-shadow"
      >
        <ServicesRail />
      </SceneSection>

      {/* 5 — SÜREÇ: scroll'a bağlı kademeli ilerleyen */}
      <SceneSection
        id="surec"
        eyebrow="Nasıl çalışıyoruz"
        title="Tanışmadan sürdürmeye"
        backdrop="concrete"
      >
        <ProcessScene />
      </SceneSection>

      {/* 6 — ARAÇLAR VİTRİNİ: canlı önizleme */}
      <SceneSection
        id="araclar"
        eyebrow="Hesaplama araçları"
        title="Sayıyı görmeden karar verme"
        lead="Her araç girdisini, sonuç dökümünü ve grafiğini kendi içinde tutar; hesap testli vergi motorundan gelir."
        backdrop="light-field"
      >
        <ToolsShowcase />
      </SceneSection>

      {/* 7 — SEKTÖRLER: ızgara, hover'da derinlik */}
      <SceneSection
        id="sektorler"
        eyebrow="Sektörler"
        title="Alışkın olduğumuz alanlar"
        lead="Her sektörün kendi vergi ve raporlama koşulları var; başladığımız nokta o farklar."
        backdrop="geometric-shadow"
      >
        <SectorsGrid />
      </SceneSection>

      {/* 8 — KAPANIŞ CTA */}
      <SceneSection id="iletisim-cta" backdrop="light-field" divider={false}>
        <Reveal className="card surface-glow px-6 py-12 sm:px-12 sm:py-16">
          <h2 className="text-[length:var(--text-3xl)] text-[var(--color-text)] sm:text-[length:var(--text-4xl)]">
            İlk görüşme ücretsizdir
          </h2>
          <p className="mt-4 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
            Mevcut vergi yapınızı, risk alanlarınızı ve fırsatlarınızı birlikte değerlendirelim.
            Görüşme yüz yüze ya da çevrim içi yapılabilir.
          </p>
          <MagneticButton className="mt-8">
            <Link
              href="/iletisim"
              className="btn btn-primary px-7 py-3.5 text-[length:var(--text-sm)]"
            >
              Görüşme talep et
            </Link>
          </MagneticButton>
        </Reveal>
      </SceneSection>
    </>
  );
}

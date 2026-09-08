import { SiteBackdrop } from '@/components/backdrop/SiteBackdrop';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { RouteTransition } from '@/components/motion/RouteTransition';
import { ScrollPercent } from '@/components/motion/ScrollPercent';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { CommandPalette } from '@/components/search/CommandPalette';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { site } from '@futuristax/config';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Familjen_Grotesk, IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import 'lenis/dist/lenis.css';
import '@/styles/tokens.css';
import '@/styles/depth.css';
import '@/styles/art.css';
import '@/styles/home.css';

/*
 * Fontlar self-host edilir (next/font/google → .woff2 derlemede indirilir ve
 * uygulama ile paketlenir, dış istek yok). display: swap.
 *
 * Roller (Bölüm 3):
 *  - Display: Space Grotesk (değişken) — geniş, teknik grotesk; hero'da sıkı
 *    tracking'le çalışır. Inter/Newsreader jenerikliğinden çıkış.
 *  - Gövde:  Familjen Grotesk (değişken) — sakin, yüksek x-height, uzun Türkçe
 *    metin için okunaklı; display'den ayrışır.
 *  - Mono:   IBM Plex Mono (400/500) — kanun maddesi göndermeleri. Kalıyor.
 * Değişken fontlarda weight verilmez: tek dosya, tüm ağırlıklar.
 *
 * TÜRKÇE GLİF DOĞRULAMASI: üçünün de Google Fonts 'latin-ext' alt kümesi var.
 * Gerekli 12 glif — ı (U+0131, latin) · İ (U+0130) · ğ Ğ (U+011E–F) ·
 * ş Ş (U+015E–F) [latin-ext] · ç Ç ö Ö ü Ü (latin) — sunulan unicode-range
 * içinde. next/font, ailede olmayan alt küme istenirse derlemeyi kırar;
 * bu istek ('latin' + 'latin-ext') başlı başına derleme-zamanı kontrolüdür.
 */
const display = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-loaded',
  display: 'swap',
});
const sans = Familjen_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans-loaded',
  display: 'swap',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono-loaded',
  display: 'swap',
});

export const viewport: Viewport = {
  // maximum-scale ve user-scalable KALDIRILDI — eski sitede zoom engelliydi
  // ve bu bir WCAG 1.4.4 ihlaliydi.
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d1013' },
    { media: '(prefers-color-scheme: light)', color: '#f5f7f8' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site.urls.production),
  title: {
    default: `${site.brand.name} — ${site.brand.tagline.tr}`,
    template: `%s · ${site.brand.shortName}`,
  },
  description:
    'Ankara merkezli vergi ve mali danışmanlık. Kurumlar vergisi planlaması, mevzuat ' +
    'uyumu, yatırım teşvikleri ve uluslararası vergilendirme.',
  alternates: { canonical: '/', languages: { tr: '/', en: '/en' } },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: site.brand.name,
    title: `${site.brand.name} — ${site.brand.tagline.tr}`,
    description: 'Vergi, mevzuat uyumu ve finansal danışmanlıkta stratejik çözümler.',
  },
  robots: { index: true, follow: true },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <SiteBackdrop />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-accent-strong)] focus:px-4 focus:py-2 focus:text-white"
        >
          İçeriğe geç
        </a>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <ScrollProgress />
          <ScrollPercent />
          <RouteTransition />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CookieConsent />
          <CommandPalette />
        </NextIntlClientProvider>
        <OrganizationJsonLd />
      </body>
    </html>
  );
}

import { site } from '@futuristax/config';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Inter, Newsreader } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import '@/styles/tokens.css';

/*
 * Fontlar self-host edilir (next/font). Üç rolün de tam Türkçe glif desteği
 * vardır — eski sitedeki "AKTIF MUSTERI" tipi karakter düşürmelerinin sebebi
 * Cinzel'in yetersiz glif kapsamıydı.
 */
const display = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-loaded',
  display: 'swap',
});
const sans = Inter({
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-white"
        >
          İçeriğe geç
        </a>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CookieConsent />
        </NextIntlClientProvider>
        <OrganizationJsonLd />
      </body>
    </html>
  );
}

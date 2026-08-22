import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

/**
 * Dil yönlendirmesi.
 *
 * ⚠️ CSP BURADAN KALDIRILDI — bkz. docs/decisions/0004-csp-nonce.md
 *
 * Önceki sürüm nonce tabanlı bir Content-Security-Policy üretiyordu, ancak
 * nonce'u Next.js'in script etiketlerine ulaştıramıyordu: `next-intl` kendi
 * yanıt nesnesini oluşturduğu için `NextResponse.next({ request: { headers } })`
 * zinciri kopuyordu. Sonuç, tarayıcının uygulamanın kendi script'lerini
 * engellemesi ve hydration'ın hiç gerçekleşmemesiydi — sayfalar görünüyor ama
 * hiçbir etkileşim çalışmıyordu.
 *
 * Diğer güvenlik başlıkları (X-Frame-Options, HSTS, Referrer-Policy,
 * Permissions-Policy, X-Content-Type-Options) `next.config.ts` ve
 * `netlify.toml` üzerinden uygulanmaya devam ediyor.
 */
export default createIntlMiddleware({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|webp|avif|ico)$).*)'],
};

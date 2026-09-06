import { buildCsp } from '@/lib/security/csp';
import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Dil yönlendirmesi + Content-Security-Policy (nonce, Report-Only).
 *
 * ADR 0004: Önceki CSP denemesi başarısızdı çünkü nonce'u taşıyan istek
 * başlıkları `next-intl`'in ürettiği yanıta aktarılmıyordu; Next.js nonce'u
 * kendi script etiketlerine ekleyemiyor, tarayıcı da onları engelliyordu.
 *
 * Bu sürüm doğru zinciri kurar:
 *   1. Nonce üret, `x-nonce` ve `content-security-policy` İSTEK başlıklarına yaz
 *      (Next.js nonce'u bu istek başlığından okur).
 *   2. next-intl middleware'ini çalıştır, kararını (rewrite / redirect / next) al.
 *   3. Yanıtı, DEĞİŞTİRİLMİŞ istek başlıklarını taşıyacak biçimde yeniden kur;
 *      next-intl'in çerezlerini ve rewrite'ını aktar.
 *   4. Yanıta CSP'yi Report-Only olarak ekle.
 *
 * Report-Only olduğu için hiçbir şey engellenmez — güvenli. Zorlayıcı moda
 * geçiş, rapor toplandıktan sonra ayrı bir adımdır (bkz. ADR 0004).
 */
const intlMiddleware = createIntlMiddleware({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
});

const HOP_BY_HOP = new Set(['x-middleware-rewrite', 'x-middleware-next', 'location']);

export default function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce, process.env.NODE_ENV === 'development');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  // Next.js nonce'u İSTEK başlığındaki CSP'den okuyup script'lerine ekler.
  requestHeaders.set('content-security-policy', csp);

  const intlResponse = intlMiddleware(request);

  const rewriteUrl = intlResponse.headers.get('x-middleware-rewrite');
  const redirectLocation = intlResponse.headers.get('location');

  let response: NextResponse;
  if (redirectLocation) {
    // Yerel önek eklemek/çıkarmak için yönlendirme — olduğu gibi geçir.
    response = intlResponse;
  } else if (rewriteUrl) {
    response = NextResponse.rewrite(new URL(rewriteUrl), {
      request: { headers: requestHeaders },
    });
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  // next-intl'in ayarladığı çerezleri (yerel tercihi) ve diğer başlıkları aktar.
  for (const cookie of intlResponse.cookies.getAll()) response.cookies.set(cookie);
  intlResponse.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key) && key !== 'set-cookie') response.headers.set(key, value);
  });

  response.headers.set('content-security-policy-report-only', csp);
  response.headers.set('x-nonce', nonce);
  return response;
}

export const config = {
  // Nokta içeren her yol (robots.txt, sitemap.xml, favicon.ico, görseller,
  // manifest…) middleware'i tamamen atlar — bunlar metadata/statik dosyalardır,
  // dil yönlendirmesi ve CSP nonce'una ihtiyaç duymazlar. `api` ve Next iç
  // yolları da hariç. Kalan her şey (nokta içermeyen sayfa yolları) işlenir.
  matcher: ['/((?!api|_next/static|_next/image|_next/data|.*\\..*).*)'],
};

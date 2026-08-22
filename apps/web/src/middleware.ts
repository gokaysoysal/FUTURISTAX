import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
});

/**
 * Nonce tabanlı Content-Security-Policy.
 *
 * Eski sitede her yerde inline onclick/onmouseover vardı; bu, CSP kurulmasını
 * imkânsız kılıyordu. Yeni kod tabanında inline handler yasak olduğu için
 * katı bir politika uygulanabiliyor.
 */
function buildCsp(nonce: string, isDev: boolean): string {
  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'unsafe-eval'` // Next.js dev HMR
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Tailwind runtime stilleri için nonce; inline style attribute'ları kullanılmaz
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob: https://cdn.sanity.io",
    "font-src 'self' data:",
    // TCMB kur beslemesi ve Turnstile doğrulaması sunucudan yapılır;
    // istemciden yalnızca kendi API'mize ve analitiğe bağlanılır.
    "connect-src 'self' https://www.google-analytics.com",
    "frame-src https://challenges.cloudflare.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = intlMiddleware(request);
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', buildCsp(nonce, isDev));

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|webp|avif|ico)$).*)'],
};

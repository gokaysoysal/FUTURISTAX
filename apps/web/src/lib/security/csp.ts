/**
 * Content-Security-Policy üretimi.
 *
 * Nonce her istekte middleware'de üretilir. Politika ÖNCE Report-Only olarak
 * yayınlanır (bkz. docs/decisions/0004-csp-nonce.md): rapor toplanır, ihlal
 * kalmadığına emin olunduktan sonra zorlayıcı moda geçilir. Report-Only hiçbir
 * şeyi engellemediği için hydration'ı bozamaz — geçmişte bu kırılmıştı.
 *
 * ⚠️ ENFORCE'A GEÇMEDEN ÖNCE — fx yığını (three / @react-three/fiber) kontrolü:
 *   fiber bazı yollarda WebGL shader derlemesi / `new Function` nedeniyle
 *   `script-src 'unsafe-eval'` isteyebilir. CSP şu an devrede DEĞİL (ADR-0004),
 *   bu yüzden şimdilik sorun değil. Zorlayıcı moda geçerken: fiber'lı bir
 *   sayfada Report-Only ihlallerini tara; gerekiyorsa 'unsafe-eval' yerine
 *   'wasm-unsafe-eval' yeterli mi bak, yalnızca ilgili route'a daralt.
 */

export function buildCsp(nonce: string, isDev: boolean): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    // Next.js kendi parça yükleyicisini nonce + strict-dynamic ile yükler.
    "'strict-dynamic'",
    // Turnstile betiği.
    'https://challenges.cloudflare.com',
    // Geliştirmede react-refresh / eval gerekiyor.
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(' ');

  const connectSrc = [
    "'self'",
    'https://challenges.cloudflare.com',
    // TCMB kur beslemesi sunucuda çekilir; yine de dev HMR için ws.
    ...(isDev ? ['ws:', 'http://localhost:*'] : []),
  ].join(' ');

  const directives: string[] = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Tailwind v4 ve Next kritik CSS'i inline enjekte eder; stil enjeksiyonu
    // script'e göre çok düşük riskli olduğu için 'unsafe-inline' kabul edilir.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connectSrc}`,
    'frame-src https://challenges.cloudflare.com',
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "manifest-src 'self'",
  ];

  if (!isDev) directives.push('upgrade-insecure-requests');

  return directives.join('; ');
}

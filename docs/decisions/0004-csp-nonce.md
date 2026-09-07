# ADR 0004 — CSP nonce + Report-Only (KISMEN KAPANDI)

**Durum:** Kısmen kapandı — Report-Only yayında, zorlayıcı moda geçiş bekliyor
**Tarih:** 2026-08-22 · **Güncelleme:** 2026-09-06

## Bağlam

`middleware.ts` içinde nonce tabanlı bir Content-Security-Policy kurulmuştu.
Amaç doğruydu: eski sitede her yerde inline `onclick` olduğu için CSP
kurulamıyordu; yeni kod tabanında inline handler yasak olduğundan katı bir
politika mümkün görünüyordu.

Ancak uygulama hatalıydı. Next.js, nonce değerini **istek başlıklarındaki**
CSP'den okur ve script etiketlerine kendisi ekler. Bu da middleware'in
`NextResponse.next({ request: { headers: requestHeaders } })` biçiminde yanıt
döndürmesini gerektirir. Bizim middleware'imiz `next-intl`'in ürettiği yanıtı
kullanıyordu; bu yanıt değiştirilmiş istek başlıklarını taşımıyordu.

Sonuç: sayfalar sunucu tarafında render ediliyor ve görünüyor, ancak tarayıcı
uygulamanın kendi script'lerini nonce'suz bulup engelliyordu. Hydration hiç
gerçekleşmiyor, hiçbir etkileşimli bileşen çalışmıyordu.

İlk canlı önizlemede fark edildi: hesaplayıcıya girilen değer sonuca
yansımıyordu.

## Karar

CSP middleware'den kaldırıldı. Bozuk ama katı bir politika, politikasızlıktan
daha kötüdür: siteyi kullanılamaz hâle getirir ve güvenlik iddiasını da
karşılamaz.

Diğer güvenlik başlıkları yerinde kalıyor.

## Yapıldı (2026-09-06)

1. ✅ `src/middleware.ts` doğru zinciri kuruyor: nonce üretilir, `x-nonce` ve
   `content-security-policy` İSTEK başlıklarına yazılır (Next.js nonce'u buradan
   okur), next-intl middleware'i çalıştırılır, yanıt değiştirilmiş istek
   başlıklarını taşıyacak biçimde `NextResponse.rewrite/next({ request })` ile
   yeniden kurulur; next-intl'in çerezleri ve rewrite'ı aktarılır.
2. ✅ `src/lib/security/csp.ts`: Turnstile (`challenges.cloudflare.com`) script/
   frame/connect kaynakları; `strict-dynamic` + nonce; stiller için
   `'unsafe-inline'` (bilinçli, düşük risk); dev'de `unsafe-eval` + `ws:`.
3. ✅ **Report-Only** olarak yayında (`Content-Security-Policy-Report-Only`).
   Hiçbir şeyi engellemez — hydration'ı bozamaz.
4. ✅ `src/components/seo/JsonLd.tsx` inline JSON-LD script'leri nonce alıyor.
5. ✅ `e2e/hydration.spec.ts`: hesaplayıcı girdisi sonuca yansıyor mu, mobil
   menü açılıyor mu, CSP-RO başlığı nonce ile geliyor mu, zorlayıcı ihlal var
   mı — kontrol eder.

## Kalan — zorlayıcı moda geçiş

- Report-Only raporları toplanacak (bir `report-uri`/`report-to` uç noktası
  gerekebilir).
- İhlal kalmadığına emin olununca `content-security-policy-report-only`
  başlığı `content-security-policy` ile değiştirilecek.
- `style-src 'unsafe-inline'` daha sonra hash/nonce ile sıkılaştırılabilir.

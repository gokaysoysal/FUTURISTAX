# ADR 0004 — CSP geçici olarak devre dışı (AÇIK)

**Durum:** Açık — Aşama 12'de çözülecek
**Tarih:** 2026-08-22

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

## Yapılması gereken (Aşama 12)

1. `next-intl` middleware'i ile Next.js nonce mekanizmasını birleştir:
   `intlMiddleware` çağrısını, değiştirilmiş istek başlıklarını taşıyan bir
   `NextRequest` ile yap ve dönen yanıta CSP başlığını ekle.
2. Turnstile (`challenges.cloudflare.com`) ve analitik için gereken kaynakları
   politikaya dahil et.
3. Önce `Content-Security-Policy-Report-Only` ile yayına al, rapor topla,
   ihlal kalmadığına emin olduktan sonra zorlayıcı moda geç.
4. Playwright'a bir test ekle: hesaplayıcıya değer gir, sonucun değiştiğini
   doğrula. Hydration kırılırsa CI yakalasın.

Bu adım tamamlanmadan CSP "hazır" sayılmaz.

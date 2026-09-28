# ADR 0001 — Vergi mantığı ayrı bir pakette tutulur

**Durum:** Kabul edildi
**Tarih:** 2026-08-21

## Bağlam

Eski sitede vergi hesaplama mantığı `index.html` içindeki `calcKdv()`,
`calcBinek()`, `calcKira()` gibi fonksiyonlara gömülüydü. Oranlar ve limitler
(%20 KDV, 55.000 TL kira limiti) doğrudan koda yazılmıştı. Sonuç:

- Oran değiştiğinde birden fazla yerde arama yapmak gerekiyordu
- Yıl bazlı hesap yapmak imkânsızdı
- Hiçbir test yazılamıyordu (DOM'a bağımlıydı)
- Hesabın doğruluğu hiçbir zaman kanıtlanamıyordu

## Karar

Vergi mantığı `packages/tax-engine` adlı bağımsız bir pakete taşınır. Paket:

- Saf TypeScript'tir; React, DOM veya Next.js bağımlılığı yoktur
- Ağ erişimi yapmaz, `Date.now()` okumaz, rastgelelik içermez
- Her hesaplayıcı `(input, rates) => Result` imzasındadır
- Oranlar `rates/{yıl}.ts` altında, kaynak bilgisiyle birlikte tutulur

## Sonuçlar

**Olumlu:** %100 satır kapsamıyla test edilebilir hale geldi (48 test).
Oran güncellemesi tek dosya düzenlemesi. Motor ileride bir müşteri portalında
veya mobil uygulamada yeniden kullanılabilir.

**Ödünler:** Kur tablosu gibi dış veriler pakete dışarıdan geçirilmek zorunda;
bu ek bir bağlantı katmanı gerektiriyor. Determinizm karşılığında kabul edildi.

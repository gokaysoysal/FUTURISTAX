# ADR 0003 — Resmî tatil kaydırması (KAPANDI)

**Durum:** Kapandı — uygulandı
**Tarih:** 2026-08-21 · **Kapanış:** 2026-09-06

## Bağlam

VUK Md. 18 uyarınca beyan veya ödeme süresinin son günü resmî tatile denk
gelirse, süre takip eden ilk iş gününün sonuna kadar uzar. Ayrıca 1–20 Temmuz
arası mali tatil uygulaması vardır (5604 sayılı Kanun).

Mevcut `tax-calendar.ts` bu kaydırmayı uygulamıyordu; ham kural tarihlerini
döndürüyordu. Canlı önizlemede "Ba-Bs formları: 30 Ağustos 2026" göründü — o gün
hem pazar hem Zafer Bayramı.

## Karar ve uygulama

`packages/tax-engine/src/calendar/holidays.ts` eklendi:

1. **Sabit resmî tatiller** — 2429 sayılı Kanun (1 Ocak, 23 Nisan, 1 Mayıs,
   19 Mayıs, 15 Temmuz, 30 Ağustos, 28 Ekim yarım gün, 29 Ekim).
2. **`shiftToNextBusinessDay(iso)`** — hafta sonu + resmî tatile denk gelen
   tarihi zincirleme atlayarak ilk iş gününe taşır; sebebini döndürür.
3. **`getUpcomingDeadlines`** artık her yükümlülükte `statutoryDate` (ham
   kanuni tarih) ve `date` (kaydırılmış etkin tarih) döndürür; `daysRemaining`
   ve `urgency` etkin tarihe göre hesaplanır.
4. **Testler** — `holiday-shift.test.ts`; 30 Ağustos 2026 senaryosu dahil.
   Mevcut takvim testlerinden kaydırma nedeniyle değişen 2 assertion, yeni
   sözleşmeye göre güncellendi (test gevşetilmedi, doğru davranışa çekildi).
5. `TaxCalendarPanel` altbilgisindeki "henüz uygulanmamaktadır" uyarısı
   kaldırıldı; yerine ne uygulanıp ne uygulanmadığını söyleyen doğru not kondu.

## Açık kalan — ayrı iş

- **Dinî bayram tatilleri** (`RELIGIOUS_HOLIDAYS_BY_YEAR`): 2024–2026 için
  tarih verisi GİRİLMEDİ (`null`). Bu proje uydurma resmî tarih üretmez;
  tarihler Resmî Gazete / Diyanet'ten doğrulanıp girilene kadar kaydırmaya
  katılmaz ve takvim bunu kullanıcıya bildirir. → PROJECT-STATUS "cevap
  bekleyen kararlar".
- **Mali tatil (5604) kesin +7 gün kuralı** modellenmedi. 1–20 Temmuz'a denk
  gelen son tarihler kaydırılmaz, yalnızca `fiscalBreakCaution` ile işaretlenir.

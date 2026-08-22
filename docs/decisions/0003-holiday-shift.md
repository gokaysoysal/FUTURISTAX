# ADR 0003 — Resmî tatil kaydırması (AÇIK)

**Durum:** Açık — uygulanmayı bekliyor
**Tarih:** 2026-08-21

## Bağlam

VUK Md. 18 uyarınca beyan veya ödeme süresinin son günü resmî tatile denk
gelirse, süre takip eden ilk iş gününün sonuna kadar uzar. Ayrıca 1–20 Temmuz
arası mali tatil uygulaması vardır (5604 sayılı Kanun).

Mevcut `tax-calendar.ts` bu kaydırmayı **uygulamıyor**; ham kural tarihlerini
döndürüyor. Bileşen altbilgisinde bu durum kullanıcıya açıkça bildiriliyor.

## Yapılması gereken

1. Türkiye resmî tatil tablosu (sabit + dinî bayramlar, yıl bazlı)
2. `shiftToNextBusinessDay(date)` yardımcısı
3. Mali tatil kuralı
4. Kaydırılan tarihler için testler
5. Altbilgideki geçici uyarının kaldırılması

Bu tamamlanmadan takvim "tamamlanmış" sayılmamalıdır.

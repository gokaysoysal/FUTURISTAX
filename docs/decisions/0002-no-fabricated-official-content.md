# ADR 0002 — Resmî içerik asla üretilmez

**Durum:** Kabul edildi
**Tarih:** 2026-08-21

## Bağlam

Eski sitedeki `loadGibNews()` fonksiyonu bir dil modeline şu talimatı veriyordu:
"GİB web sitesinde son 30 günde yayımlanmış veya yayımlanması muhtemel 5 adet
güncel duyuru başlığı üret." Çıkan başlıklar gerçek GİB duyurusuymuş gibi
listeleniyordu.

Bir vergi danışmanlığı firmasının sitesinde var olmayan resmî tebliğ ve sirküler
başlıkları yayınlamak; itibar riski olmanın ötesinde mesleki sorumluluk açısından
savunulamaz.

## Karar

Mevzuat, tebliğ, sirküler, duyuru, oran ve tarih niteliğindeki her içerik ya
gerçek bir kaynaktan gelir ya da hiç gösterilmez. Üç düzeyde uygulanır:

1. **Tip düzeyi:** Her `RateSet` bir `provenance` alanı taşır (`verified`,
   `source`, `checkedAt`).
2. **UI düzeyi:** `UnverifiedRatesNotice` doğrulanmamış yıllarda uyarı gösterir.
3. **API düzeyi:** `/api/rates` kaynağa ulaşamazsa 503 döner; yedek uydurma
   değer üretmez.

## Sonuçlar

**Olumlu:** Site hiçbir zaman uydurma resmî bilgi göstermez.
**Ödünler:** Bazı ekranlarda "veri yok" durumu görünür. Yanlış bilgi
göstermeye tercih edilir.

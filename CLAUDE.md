# FuturistaX Advisory — proje talimatları

Bu dosya her oturumda otomatik okunur. Kod yazmadan önce
`docs/PROJECT-STATUS.md` dosyasını da oku — nerede kalındığı orada.

---

## Proje nedir

futuristax.com'un tek dosyalık `index.html` prototipinin yerini alacak kurumsal
web platformu. FuturistaX Advisory, Ankara merkezli bir vergi ve mali danışmanlık
firması. Kurucu: Gökay Soysal, SMMM.

**Platformun tek işi:** nitelikli danışmanlık talebi üretmek. Bir özellik buna
hizmet etmiyorsa, eklemeden önce gerekçesini yaz.

---

## Tartışmasız kurallar

1. **Uydurma resmî içerik üretilmez.** Mevzuat, tebliğ, sirküler, duyuru, vergi
   oranı, son tarih — ya gerçek kaynaktan gelir ya hiç gösterilmez. Dış kaynak
   erişilemezse "şu an güncellenemiyor" durumu gösterilir; yedek uydurma değer
   ASLA üretilmez. Bu proje bu hatadan doğdu: eski sitede GİB duyuruları bir dil
   modeline ürettiriliyor ve gerçekmiş gibi yayınlanıyordu.

2. **API anahtarları asla istemciye gitmez.** Tüm AI ve ücretli servis çağrıları
   server route üzerinden. `NEXT_PUBLIC_` öneki yalnızca gerçekten herkese açık
   değerlerde.

3. **WCAG 2.2 AA taban seviyedir**, hedef değil. Zoom engellenmez, imleç
   gizlenmez, gövde metni kontrastı 4.5:1 altına düşmez, her etkileşimli öğe
   klavyeyle erişilebilir.

4. **Türkçe karakterler hiçbir metinde düşürülmez.** "MÜŞTERİ", "BAŞARI",
   "EKİBİMİZ" — doğru yazımla. Font seçerken Türkçe glif kapsamı kontrol edilir.

5. **Vergi mantığı UI'dan ayrıdır.** Tüm hesaplama `packages/tax-engine` içinde,
   saf fonksiyon olarak, testli. Hiçbir oran veya limit bu paketin dışında
   yazılmaz.

6. **Tek dosyalık çıktı üretilmez.** Hiçbir dosya 300 satırı geçmez; aşarsa alt
   bileşenlere bölünür. Inline `<style>` bloğu ve inline `onclick` yasak.

7. **Her hesaplayıcı ve AI çıktısı sorumluluk reddi içerir.**

8. **Doğrulanmamış veri UI'da işaretlenir.** `RateSet.provenance.verified`
   false ise `UnverifiedRatesNotice` gösterilir. Bu bileşen kaldırılmaz.

---

## Mimari

```
apps/web/              Next.js 15 App Router
packages/config/       Firma bilgileri + env şeması — TEK doğruluk kaynağı
packages/tax-engine/   Saf TS hesaplama motoru — testli
docs/decisions/        ADR'ler
```

**`packages/config/src/site.ts`** firma bilgilerinin tek kaynağı. Telefon, adres,
e-posta hiçbir yerde hard-code edilmez.

**`packages/tax-engine` sözleşmesi:** her hesaplayıcı `(input, rates) => Result`
imzasında saf fonksiyon. Ağ erişimi yok, `Date.now()` yok, rastgelelik yok.
Referans tarih ve kur tablosu dışarıdan geçirilir. Her sonuç ara adımları da
döndürür — kullanıcıya sonucu değil, hesabın nasıl çıktığını gösteriyoruz.

**Env doğrulaması TEMBEL olmalı.** Modül yüklenirken doğrulama yapılırsa, o
değişkene ihtiyaç duymayan sayfalar bile çöker. Henüz kullanılmayan değişkenler
`.optional()` kalır.

---

## Tasarım yönü — kararlaştırıldı, değiştirilmez

Siyah + altın + Cinzel lüks estetiği **reddedildi**. Yerine **mali belge
estetiği**: resmî belge dili, defter çizgileri, tasdik mührü.

- **Zemin** `#0d1013` mürekkep-grafit (saf siyah değil)
- **Aksan** `#4b7fd6` tasdik mavisi
- **Damga** `#d9705c` — YALNIZCA son tarih ve KKEG gibi olumsuz kalemlerde
- **Onay** `#5fb894` olumlu kalemlerde
- **Tipografi** Newsreader (başlık) + Inter (gövde) + IBM Plex Mono (veri ve
  kanun maddesi göndermeleri). Üçü de tam Türkçe glif desteğine sahip.
- **Rakamlar** her yerde `tabular-nums`
- **Defter çizgileri** yalnızca veri bağlamlarında; dekoratif kullanılmaz
- **İmza öğesi** ana sayfadaki Vergi Takvimi

Renk değişikliği tasarım kararıdır; uygulamadan önce öner.

---

## Çalışma şekli

- Değişiklikler küçük, açıklanabilir commit'lerle.
- Önemli teknik kararlar `docs/decisions/` altına ADR olarak yazılır.
- İş bitince `docs/PROJECT-STATUS.md` güncellenir.
- Doğrulama: `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`.
- **`main` dalına dokunma.** Canlı site oradan yayınlanıyor. İş `v2` dalında.
- Test kırmızıysa testi gevşetme, kodu düzelt.

---

## Bilinmeyeni uydurma

Emin olmadığın iş kararlarını (istatistik iddiaları, TÜRMOB uyumu, fiyatlandırma,
vergi oranı, dinî bayram tarihleri) tahmin etme — `docs/PROJECT-STATUS.md`
içindeki "cevap bekleyen kararlar" bölümüne yaz.

Vergi oranları: 2024 ve 2025 tabloları yer tutucudur, 2026 hiç girilmemiştir.
Bunları değiştirme veya "doğrulanmış" işaretleme — firma sonradan revize edecek.

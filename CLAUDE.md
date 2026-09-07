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

## Tasarım yönü — modern fintech: koyu taban, ışıklı aksan

> **Bu bölüm yeniden yazıldı.** Önceki "mali belge estetiği — değiştirilmez"
> yönü **geçersiz**. "Siyah + altın + Cinzel lüks" yönü de reddedilmiş
> durumda. Yeni yön Cirform (AI Finance) referansından türetildi:
> parlak yüzeyler, derinlik, akışkan hareket, veri görselleştirme. Sakin/resmî
> "mali belge" dilinden **uzaklaşıldı**. Uygulama `apps/web/src/styles/tokens.css`.

### Palet — koyu taban, ışıklı aksan

Oranlar `--canvas` (`#07090D`) üzerinde, WCAG 2.2 hesaplı; hepsi `tokens.css`
içinde yorum olarak. Gövde metni hiçbir yüzeyde **4.5:1** altına düşmez.
Yeni renk eklerken oranı hesapla ve yaz.

| Token | Değer | Kullanım | Kontrast |
|---|---|---|---|
| `--canvas` | `#07090D` | en derin zemin | — |
| `--surface` | `#0D1117` | yüzey | — |
| `--surface-lift` | `#141B24` | yükseltilmiş kart | — |
| `--accent` | `#4D7CFF` | azur — birincil eylem, bağlantı, ikon | 5.35:1 |
| `--accent-glow` | `#7B6BFF` | menekşe — **YALNIZCA** gradyan/parıltı, metin değil | 5.11:1 |
| `--signal` | `#FF6B4A` | son tarih + KKEG uyarıları (marka rengi değil) | 7.07:1 |
| `--positive` | `#3DDC97` | olumlu / doğrulanmış kalem | 11.3:1 |
| `--text` | `#EAF0F7` | gövde | 17.4:1 |
| `--text-secondary` | `#9AA9BC` | ikincil | 8.3:1 |
| `--text-muted` | `#808E9C` | mono künye, kanun maddesi göndermesi | 5.9:1 |

Parlak azur bir buton **zemini** olarak kullanılırsa üstüne koyu metin gelir
(`--color-on-accent`), beyaz değil. Açık tema `tokens.css`'te korundu
(azur `#2C5BE0`), tüm oranları orada doğrulandı.

### Derinlik — ışık kaynağı gibi, dekorasyon değil

- **Gradyanlar** kartın bir kenarından gelen yumuşak parıltı gibi; her yüzeye
  değil, seçici. Işık kaynağı mantığı — süsleme değil.
- **Cam efekti** (`backdrop-blur` + ince kenarlık) yalnızca üst üste binen
  katmanlarda: sticky header, açılır paneller, veri kartları.
- **Gren/noise dokusu** (SVG `feTurbulence`, düşük opaklık) düz koyu
  yüzeylerde bantlaşmayı kırar.
- **Bölüm geçişlerinde** yumuşak ışık huzmeleri.

### Korunan iki detay (siteyi jenerik fintech'ten ayırır)

- Rakamlarda `tabular-nums`, **her yerde**.
- Kanun maddesi göndermeleri **mono** (`IBM Plex Mono`), küçük ve sakin.

### Tipografi

- **Display + gövde:** standart fontlardan çıkıldı. Adaylar: Clash Display /
  Cabinet Grotesk / Satoshi / General Sans (fontshare) veya Türkçe-güvenli
  Google alternatifleri (Space Grotesk, Bricolage Grotesque, Familjen Grotesk).
  **Kesin seçim Bölüm 3'te**, Türkçe glif kontrolü (ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü)
  sonrası; sonuç buraya ve `PROJECT-STATUS.md`'ye yazılır.
- **Mono:** IBM Plex Mono — kalıyor.
- `next/font` ile self-host, `display: swap`, yalnızca kullanılan ağırlıklar,
  değişken font tercih. Display ölçeği büyür (hero 4–5rem), sıkı
  letter-spacing (`-0.03em`), yakın satır aralığı; gövde okunaklı kalır.

### Hareket

- Merkezî yapılandırma: `apps/web/src/lib/motion/` — easing eğrileri, süreler,
  varyantlar tek yerde.
- Scroll-driven reveal (stagger), parallax, scroll-zoom, sayaç animasyonu
  (`tabular-nums` korunur, layout kaymaz), manyetik hover, kart hover parıltısı,
  iskelet (skeleton) yükleme.
- `prefers-reduced-motion: reduce` altında **tüm** animasyon kapanır, içerik
  anında son hâliyle görünür — seçenek değil. Hiçbir animasyon içeriğe erişimi
  geciktirmez. Yalnızca `transform`/`opacity`; `will-change` seçici; ağır
  bölümler `dynamic import`.

### İmza öğeleri ve veri görselleştirme

- Ana sayfada **Vergi Yükü Panosu** (etkileşimli) + **Vergi Takvimi**.
- Grafikler (Recharts) **tema tokenlarını** kullanır, kendi rengini getirmez.
- Her grafiğin/panonun `sr-only` tablo karşılığı ve klavye erişimi var.

### Kalite eşiği

Görsel iddia için gevşetildi (bkz. `lighthouserc.json`): Lighthouse perf ≥ 85,
LCP ≤ 2.5s, ilk yük JS ≤ 220KB, sayfa ≤ 900KB. **ESNEMEZ:** WCAG 2.2 AA,
axe sıfır ihlal, tam `prefers-reduced-motion`, klavyeyle tüm akışlar (komut
paleti, filtreler, grafikler dâhil), grafik/pano ekran okuyucu karşılığı,
Türkçe karakterler hiçbir metinde düşürülmez, kontrast gövde 4.5:1 / büyük 3:1.

Renk veya tipografi değişikliği tasarım kararıdır; uygulamadan önce öner.

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

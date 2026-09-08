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

- **Display:** **Syne** (değişken, 400–800) — geniş, geometrik, çağdaş; hero'da
  büyük ve iddialı (`--text-hero` = `clamp(2.75rem, 7vw, 6rem)`), sıkı tracking
  (`-0.03em`), yakın satır aralığı (başlık 1.05 / hero 0.95). Başlık ağırlığı
  600. **V5 Bölüm 3'te Space Grotesk'in yerini aldı** (kullanıcı onayı
  2026-09-08); Space Grotesk "sıradan" bulundu.
- **Gövde:** **Familjen Grotesk** (değişken) — sakin, yüksek x-height, uzun
  Türkçe metinde okunaklı; display'den net ayrışır. **DEĞİŞMEDİ.**
- **Mono:** IBM Plex Mono — kanun maddesi göndermeleri. **DEĞİŞMEDİ.**
- Türkçe glif doğrulaması (ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü): Syne'nin Google Fonts
  CSS2 `unicode-range`'i incelendi — `latin` alt kümesi ı + ç/Ç/ö/Ö/ü/Ü'yü,
  `latin-ext` (U+0100–02BA) İ + Ğ/ğ + Ş/ş'yi kapsıyor. 12 glifin tamamı var.
  `next/font`, ailede olmayan alt küme istenirse derlemeyi kırar —
  `['latin','latin-ext']` isteği başlı başına derleme-zamanı kontrolü.
  Fontshare adayları (Clash/Satoshi vb.) yine seçilmedi: bu ortamda ikili glif
  tablosu programatik doğrulanamıyor; Google CSS2 `unicode-range` garantili yol.
  Ayrıntı: `apps/web/src/app/[locale]/layout.tsx` yorumu.
- `next/font/google` ile self-host, `display: swap`, değişken sürümlerle
  (weight verilmez → tek dosya). `--font-*-loaded` → tokens.css'te
  `--font-display/sans/mono` zinciriyle bağlı.

### Hareket — DİSİPLİN (V4-AKIS)

- Merkezî yapılandırma: `apps/web/src/lib/motion/` (JS) + `tokens.css`
  `--ease-out` / `--dur-*` (CSS). İkisi aynı değerleri taşır.
- **TEK easing ailesi: `ease.out` = expo.out `cubic-bezier(0.16, 1, 0.3, 1)`.**
  Reveal, hover, sayaç, parallax, buton oku — hepsi bu. `inOut` YALNIZCA rota
  perde geçişi. Farklı bölümde farklı easing/yön KULLANMA.
- **Süre ölçeği yalnızca üç değer:** fast 200ms / base 600ms / scene 1200ms
  (+ count 1600ms sayaç). Stagger 60–80ms.
- **Tüm reveal'lar tek desen:** 24px alttan + opaklık (`fadeUp`/`staggerItem`).
- **Stack ayrımı:** Framer Motion (`motion/react`) = bileşen içi mikro
  etkileşim, giriş/çıkış, rota geçişi. GSAP + ScrollTrigger = YALNIZCA scroll'a
  bağlı sahne koreografisi (pin, marquee dışı). Aynı öğeyi ikisiyle animasyon
  etme. GSAP/three/recharts STATİK import edilmez — `import()` + IO ile tembel
  (`lib/motion/gsap-lazy.ts`, `useNearViewport`).
- Lenis smooth scroll `lerp: 0.1`.
- `prefers-reduced-motion: reduce` altında **tüm** animasyon kapanır (Lenis
  başlamaz, ScrollTrigger pin'leri kurulmaz, perde render edilmez, marquee
  durur, split-type/GSAP hiç yüklenmez), içerik anında son hâliyle görünür.
  Hiçbir animasyon içeriğe erişimi geciktirmez; yalnızca `transform`/`opacity`.
- **Pinlenmiş bölüm** (`PinnedCapabilities`) klavye kullanıcısını hapsetmez:
  aktif olmayan adımlar `inert`, Tab bölümden çıkar. Fallback = adımlar alt alta.

### İmza öğeleri ve veri görselleştirme

- Ana sayfa akışı **referansa (futureoffinance.peachweb.io) sadıktır** — bölüm
  sırası `docs/V4-AKIS-PROMPT.md` Bölüm 2. İmza hareket = pinlenmiş "Temel
  yetenekler" bölümü.
- Hero yüzen kartları, "Çözümler" panosu ve "Rakamlar" bölümü **gerçek veri**
  gösterir (tax-engine + saf hesap + `site` sabitleri); dış kaynak (TCMB kur)
  erişilemezse "—", uydurma değer yok.
- Grafikler (Recharts) **tema tokenlarını** kullanır; her grafiğin/panonun
  `sr-only` tablo karşılığı ve klavye erişimi var.
- **Yer tutucu içerik** `CONTENT_IS_PLACEHOLDER` bayrağı arkasında,
  `src/lib/data/placeholder/` altında. Tam liste + firma görevleri:
  `docs/YER-TUTUCU-ICERIK.md`. Üç istisna (sahte resmî içerik, gerçek logo,
  uydurma isim) yer tutucu bile olamaz.

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

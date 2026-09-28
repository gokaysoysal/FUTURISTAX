# V12 premium geçişi — doğrulama (docs/V12-PREMIUM-PROMPT.md Bölüm 7)

## Ekran görüntüleri

- `docs/qa/onceki/` — değişiklikten ÖNCE: ana sayfa (0/25/50/75/100% scroll)
  + `/hizmetler` + `/araclar` + `/iletisim`, 1440 ve 390 genişlik (16 dosya).
- `docs/qa/sonraki/` — aynı görünümler SONRA (16 dosya).
- `docs/qa/premium-karsilastirma.png` — ana sayfa en üst, önce|sonra yan yana.
- `docs/qa/premium-karsilastirma-{home-s50,home-s100,hizmetler,iletisim}-w1440.png`
  — ek karşılaştırmalar (bonus, prompttaki tek dosya adının ötesinde).

Tümü SİTENİN KENDİ ekran görüntüsü — referans/üçüncü taraf pikseli
içermiyor, commit edilebilir (V11'deki `docs/referans/` kısıtı burada
geçerli değil).

## Bölüm 2 — kenar/artefakt kontrolü

`NEXT_PUBLIC_SCENE_DEBUG=1` + Playwright/swiftshader ile doğrulandı (bkz.
V11 doğrulama yöntemi, aynı araç). **Önce:** büyük ve küçük kürenin
silüeti basamaklı/pikselliydi (`if (d>=r) return base` — AA yok); panelde
açık gri dikdörtgen bloklar ve soluk yatay bantlar (gren hash'inin büyük
koordinatlarda `sin()` hassasiyeti çökmesi). **Sonra:** her iki artefakt da
giderildi — `premium-karsilastirma-hizmetler-w1440.png`'de yan yana açıkça
görülüyor (büyük kürenin kenarı artık pürüzsüz). 1.0 ve 2.0 DPR ayrıca
kontrol edilmedi (bu ortamda gerçek ekran yok) — kullanıcı yerelde
`pnpm dev` ile her iki DPR'de de kontrol etmeli.

## Bölüm 3 — Türkçe kelimeler

Ekran görüntülerinde doğrudan görünen kelimeler doğru basılıyor:
"dönüştürüyoruz" (hero), "Çalışma alanlarımız" (hizmetler), "İletişim"
(iletişim eyebrow), "Danışmanlık talebi". Font ailesi DEĞİŞMEDİ (Syne +
Familjen Grotesk + IBM Plex Mono, zaten glif-doğrulanmış — CLAUDE.md) —
ağırlık/aralık değişimi glif kapsamını etkilemez.

## Kontrast — sayılarla (en kötü evre)

- **`.text-scrim` arkası (sahne en parlak evresi, ölçülen ≈p0.6-0.87):**
  `--scene-ground-bright` (#5a789b, rel. luminance ≈0.193) üzerine artık
  düz `color-mix(canvas 82%, transparent)` + `mask-image` (kenarlarda
  DAHA da opak). Kompozit luminance ≈ 0.18×0.193 ≈ 0.0347. `--color-text`
  (≈0.958) karşısında **≈11.9:1** — 4.5:1 tabanının çok üzerinde (V11'deki
  ≈13:1'den az farklı; maskeli versiyon merkezde %82 kullanıyor, öncekinin
  %86'sından biraz daha az opak, ama fark ihmal edilebilir).
- **`.btn-primary`** (artık gerçekten uygulanıyor, bkz. Bölüm 6): beyaz
  metin / `--color-accent-strong` (#3563e6) — CLAUDE.md'de belgeli
  **5.15:1**.
- **Cam kartlar (`.glass`/`.glass-1`, %35 dolgu — eskisi %72'ydi):** axe
  tam paket taramasında (`accessibility.spec.ts`, `--workers=1`, aşağıya
  bakın) SIFIR kontrast ihlali — opaklık düşüşü metin okunabilirliğini
  bozmadı (arkasındaki `backdrop-filter: blur` + koyu sahne zemini yeterli
  ayrım sağlıyor).

## e2e / axe — kırmızı sayısı

**Önce (bu işten önce, `docs/qa/onceki/e2e-kirmizi-liste.txt`):** tam
paket (paralel, `npx playwright test`) → **39 kırmızı** / 55 yeşil.

**Sonra (aynı komut, aynı paralellik):** **16 kırmızı** / 79 yeşil.

Düşüşün ana kaynağı: `.btn-primary` metin rengi kök nedeni (Bölüm 6) —
tek bir CSS düzeltmesi 23 testi kırmızıdan yeşile çevirdi (her sayfadaki
üst menü CTA'sı axe'i tetikliyordu).

Kalan 16'nın döküm:
- **7'si** (`accessibility.spec.ts`, `/`, `/hizmetler`, `/hizmetler/...`,
  `/sektorler`, `/sektorler/...`, `/araclar`, `/araclar/kdv`) — axe analiz
  SÜRESİ AŞIMI (30sn), gerçek ihlal DEĞİL: `--workers=1` ile AYNI paket
  **18/18 yeşil**. Bu ortamda çok sayıda paralel worker'ın aynı axe
  analizini aynı anda çalıştırması kaynak çekişmesi yaratıyor — önceden de
  var olan bir ortam sınırlaması (V11'de de gözlemlendi, o zaman kontrast
  hataları arkasında gizliydi).
- **9'u** (`tax-calendar.spec.ts`, `tools-workspace.spec.ts`,
  `v4-home.spec.ts` bazı testleri) — `v2-oncesi-v12` etiketiyle
  karşılaştırıldı (V11'de zaten yapılmıştı), bu işten BAĞIMSIZ, önceden
  var olan hatalar. Ayrı bir işte ele alınmalı.

**Sonuç: kırmızı sayısı ARTMADI, tam tersine 39→16 düştü** (Bölüm 7 kuralı
fazlasıyla karşılandı).

## Yeni backdrop-scene.spec.ts (V11) hâlâ yeşil

V12 sahne shader'ını değiştirdiği için V11'in `backdrop-scene.spec.ts`si
tekrar çalıştırıldı — 4/4 yeşil (canvas var, `data-backdrop-state` geçerli,
reduced-motion'da canvas yok).

## Performans / bütçe

`NEXT_PUBLIC_SCENE_DEBUG` OLMADAN `next build`: ana sayfa ilk yük JS
**180kB** (<220kB bütçesi, V11'den +0kB — V12 yalnızca CSS + küçük bir
client bileşen (`CardGlow`, sıfır DOM) ekledi). Yeni bağımlılık YOK.

## Dürüstlük notu

Bu oturumda GERÇEK GPU/tarayıcı, gerçek DPR 2.0, veya gerçek dokunmatik
cihaz DENENMEDİ — hepsi Playwright + swiftshader (yazılımsal WebGL) ile.
`prefers-reduced-motion` ve `pointer:fine`/`pointer:coarse` davranışları
`matchMedia` taklit edilerek test edildi, gerçek cihazda DENENMEDİ.
Kullanıcı `pnpm dev` ile yerelde gerçek fare/dokunmatik/DPR 2 ile son bir
göz atmalı — özellikle kart hover parıltısı ve sahne kenar yumuşatması.

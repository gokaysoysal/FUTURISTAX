# Lottie animasyonları

Gerçek `.json` dosyaları buraya konur. `LazyLottie` bileşeni
(`src/components/media/LazyLottie.tsx`) bunları `src="/lottie/xxx.json"` ile
tembel yükler.

## Kurallar

- **lottiefiles.com**'dan ücretsiz, finans/veri temalı 3-5 animasyon:
  grafik çizimi, akış diyagramı, belge işleme.
- Süs olarak değil — bir kavramı anlatırken kullan.
- Lisansı `CREDITS.md`'ye (bu klasörde) yaz.
- `prefers-reduced-motion` altında `LazyLottie` zaten donduruyor; ayrıca
  animasyonun ilk karesi tek başına anlamlı olsun.

## Beklenen dosyalar (öneriler)

| Dosya | Kavram | Kullanım yeri |
|---|---|---|
| `data-flow.json` | veri akışı / hat çizimi | Hero altı "güven bandı" ya da Süreç bölümü |
| `document-process.json` | belge işleme adımları | Süreç bölümü |
| `chart-draw.json` | grafik çizilmesi | Araçlar vitrini |

Dosyalar gelene kadar `LazyLottie` sessizce boş render eder (fetch 404 →
`failed`, hiçbir şey gösterilmez); layout kaymaz.

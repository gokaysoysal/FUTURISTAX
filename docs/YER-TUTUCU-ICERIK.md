# Yer tutucu içerik listesi — V4-AKIS koşusu

> **Bu koşuda düzen ve kalite oturtuldu; gerçek içeriği firma girecek.**
> Tüm yer tutucu metin tek bir bayrağın arkasında: `CONTENT_IS_PLACEHOLDER`
> (`packages/config/src/site.ts`). Gerçek içerik girildikçe ilgili modüller
> değiştirilir ve bayrak `false` yapılır.

## Bayrak nasıl çalışır

- `CONTENT_IS_PLACEHOLDER = true` → yer tutucu metinler devrede; `/mevzuat`
  hub'ında "editoryal taslak" bilgi bandı görünür.
- `false` → yer tutucu modüller gerçek verilerle değiştirilmiş olmalı; bilgi
  bandı kaybolur. (Kod yer tutucu modülleri `import` etmeyi sürdürür — dosya
  içerikleri gerçek metinle güncellenir.)

## Üç istisna — bunlar yer tutucu BİLE olamaz

1. **Sahte resmî içerik yok.** `/mevzuat` yazıları genel editoryal başlıklar
   (`src/lib/data/legislation.ts`, `draft: true`) — GİB duyurusu / tebliğ /
   sirküler taklidi DEĞİL. Resmî besleme (`fetchOfficialAnnouncements`)
   yapılandırılana kadar "şu an güncellenemiyor" gösterir; yedek uydurulmaz.
2. **Gerçek şirket logosu yok.** Logo şeridi ve referans kartlarındaki işaretler
   `src/components/home/BrandMarks.tsx` — palet tokenlı, anlamı olmayan soyut
   SVG'ler.
3. **Uydurma kişi/şirket adı yok.** Referanslar "Örnek Müşteri A · İmalat
   sektörü" biçiminde.

## Dosya dosya — yer tutucu ne var, firma neyi değiştirecek

| Dosya | İçerik | Firma ne yapacak |
|---|---|---|
| `apps/web/src/lib/data/placeholder/home.ts` → `heroContent` | Hero eyebrow / başlık / alt başlık / iki CTA etiketi | Gerçek konumlandırma cümlesi + slogan. Başlık kelime kelime animasyonlu; Türkçe glif kontrolü `SplitHeading`'de. |
| `…/home.ts` → `solutionsContent` | "Çözümler" bölümü etiket / başlık / gövde / iki CTA | Gerçek değer önerisi metni. |
| `…/home.ts` → `featureTriad` | Üç kart: Vergi planlaması / Mevzuat uyumu / Risk analizi başlık + açıklama | Açıklamaları firma diliyle yaz; başlıklar sabit kalabilir. |
| `…/home.ts` → `capabilitySteps` | Pinlenmiş bölüm: Analiz → Yapılandırma → Sürekli takip (01/02/03) açıklamaları | Adım açıklamalarını gözden geçir. |
| `…/home.ts` → `serviceGroups` | 9 hizmetin dört gruba toplanması + grup açıklamaları. `serviceSlugs` gerçek slug'lara bağlı. | Grup adları/açıklamaları; gruplama tercihi. |
| `…/home.ts` → `engagementModels` | Çalışma modeli üç kart: tek seferlik / sürekli / proje. Her kartta 4 madde + CTA. **FİYAT YOK.** | Kapsam maddelerini firma netleştirir. Fiyat eklenmez (fiyat görüşmede). |
| `…/home.ts` → `closingCta` | Kapanış CTA başlık / gövde / iki buton | Gerçek kapanış mesajı. |
| `apps/web/src/lib/data/placeholder/testimonials.ts` → `placeholderTestimonials` | Üç referans: "Örnek Müşteri A/B/C · <sektör>" + yer tutucu alıntı. Avatar yerine geometrik işaret. | **Yazılı yayın izniyle** gerçek görüş + isim. Asıl kaynak `src/lib/data/testimonials.ts` (bilinçli boş) — oraya taşınır; bu dosya silinir. |
| `apps/web/src/lib/data/legislation.ts` | 5 editoryal yazı, `draft: true`, genel başlıklı | Firma gözden geçirir; somut oran/tarih/madde eklerse kaynağıyla. Resmî duyuru taklidi ÜRETİLMEZ. |
| `apps/web/src/components/home/BrandMarks.tsx` | 8 soyut SVG marka işareti (logo şeridi + referans işaretleri) | Gerçek logo İZİNLE gelirse `TreatedImage` ile değiştirilir; aksi hâlde kalır. |
| `apps/web/src/lib/data/services/*`, `sectors/*` | Hizmet/sektör detay metinleri (V2'den, `draft: true`) | Firma revizyonu — bu koşu dokunmadı. |

## Gerçek veri KULLANAN yerler (yer tutucu DEĞİL)

- Hero yüzen kartları: sıradaki yükümlülük (`getUpcomingDeadlines`), TCMB USD/TRY
  (`/api/rates` — erişilemezse "—", uydurma kur yok), örnek vergi yükü
  (`computeBurden`), 30 günlük yoğunluk.
- "Çözümler" panosu: canlı `TaxBurdenPanel` (tax-engine + saf hesap).
- "Rakamlar" bölümü: kuruluş yılı (`site.brand.foundedYear` = 2013), hizmet
  sayısı (`SERVICES.length`), sektör (`SECTORS.length`), araç (`TOOLS.length`).
- Vergi oranları: yer tutucu (2024/2025) / boş (2026) — **AJAN DOKUNMADI**,
  `UnverifiedRatesNotice` kaldırılmadı.

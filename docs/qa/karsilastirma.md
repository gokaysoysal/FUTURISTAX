# V11 sahne — öz değerlendirme (docs/V11-SAHNE-PROMPT.md Bölüm 7)

## Doğrulama yöntemi

`NEXT_PUBLIC_SCENE_DEBUG=1` ile üretim derlemesi (`next build && next start`),
Playwright chromium `--use-angle=swiftshader --use-gl=angle
--enable-unsafe-swiftshader --ignore-gpu-blocklist` ile başlatıldı.
`?scene-debug=1&p={0,.2,.4,.6,.8,1}&mx=0.5&my=0.5` her karede tek
deterministik kare çizdirdi (`window.__sceneReady`), diğer her şey
`visibility:hidden` ile gizlenip yalnızca `[data-testid="site-backdrop"]`
1920×988 ekran görüntüsü alındı. Karşılaştırma araçları geçiciydi
(`apps/web/scripts/v11-*.mjs`), iş bitince silindi.

**A adımı** (tarayıcıda canlı önizleme) bu ortamda denenmedi — B/C/D
doğrudan çalıştı, ek adıma gerek kalmadı.

Ekran görüntüleri: `docs/qa/karsilastirma-p{0,0.2,0.4,0.6,0.8,1}.png` (yalnızca
üretilen sahne, commit edildi). Referans kareyi yan yana koyan
`karsilastirma-yanyana-p*.png` de üretildi ve bu incelemede kullanıldı ama
COMMIT EDİLMEDİ — referans karenin piksellerini içeriyor, docs/referans/ ile
aynı sebeple (Bölüm 0.2) public depoda yayınlanamaz. Yeniden üretmek için:
referans kareyi ve üretilen kareyi aynı HTML sayfasında yan yana koyup
Playwright ile ekran görüntüsü almak yeterli (araç geçiciydi, silindi).

## Öz değerlendirme tablosu

| Kare | Şerit sayısı/adımı + panel kenarı | Küre konumu (±%10) | Kenar ışığı | Işık evresi | Gren/vinyet | Kürede kubbe |
|---|---|---|---|---|---|---|
| p=0 ↔ 1.png | **uyuyor** — adım oranı ve ~%47 kenar konumu yakın; FARKLI: referansın kenarı düz, bizimki hafif organik dalgalı (bilinçli tercih, Bölüm 1 "pürüzsüz" notuyla kısmi çelişki) | **uyuyor** — küçük küre sağ üstte duvarda, büyük kürenin silüeti sağ altta; büyük kürenin eğrisi referanstan biraz daha dik | **uyuyor** — turkuaz Fresnel bandı her iki kürede de var | **uyuyor** — en koyu evrelerden biri (ölçülen light=0.04) | **uyuyor** — gren ve vinyet görünür, referans kadar güçlü değil (vinyet biraz daha hafif) | n/a (küre panelde değil) |
| p=0.2 ↔ 2.png | **farklı** — referans karede panel kenarı üstte testere dişi/çentikli; bizimki düzenli dalgalı. Panel-küre kesişiminde küçük bir parlak blok artefaktı var (bkz. not) | **kısmen uyuyor** — küçük küre üstten giriyor, ama x konumu referanstan ~%15 daha sağda | **uyuyor** | **uyuyor** — en koyu kare (ölçülen light=0.0, palet düzeltmesiyle tutarlı) | **uyuyor** | **kısmen** — üst kenarda kubbe başlangıcı var ama tam scallop yok (küre çoğunlukla ekran dışı) |
| p=0.4 ↔ 3.png | **farklı** — referansta küre panel genişliğinin çoğunu kaplıyor (yoğun, bitişik hilal deseni); bizimki daha küçük/aralıklı hilaller, sol tarafta boşluk var | **kısmen uyuyor** — küre sol-üstte gömülü, konum yönü doğru; boyut referanstan ~%20 küçük | **uyuyor** — hilal kenarlarında turkuaz bant net görünüyor | **uyuyor** | **uyuyor** | **uyuyor** (yön/mekanizma doğru), **farklı** (yoğunluk/genişlik) |
| p=0.6 ↔ 4.png | **uyuyor** — panel kenarı ve adım oranı tutarlı | **uyuyor** — küre sol-altta gömülü, büyük küre sağda dominant eğri; ikisi de referansla aynı bölgede | **uyuyor** | **uyuyor** — orta-parlak evre | **uyuyor** | **uyuyor** — belirgin hilal/mercek deseni |
| p=0.8 ↔ 5.png | **uyuyor** | **uyuyor** — küre alt kenardan yarısı görünür şekilde çıkıyor, büyük küre sağda dominant | **uyuyor** | **uyuyor** — parlak evre | **uyuyor** — parlak evrede gren biraz daha görünür (beklenen, koyu zeminde daha az fark ediliyor) | **uyuyor** — alt kenarda kesik hilal |
| p=1.0 ↔ 6.png | **uyuyor** | **FARKLI (bilinçli tasarım kararı)** — referans karede küre neredeyse tamamen dışarıda/alt kenarda (bkz. docs/qa/palet.md "DÖNGÜ TASARIMI" notu); bizim p=1.0'da küre ÜSTTEN yeniden giriyor — Bölüm 3'ün açık talimatı ("0.8→1.0 arasında ekran dışı kalıp üstten geri girsin") gereği | **uyuyor** | **uyuyor** — ölçülen en parlak evre (light=1.0) | **uyuyor** | n/a (küre çoğunlukla ekran dışı) |

## Bilinen sapmalar (düzeltilmedi, bilinçli veya düşük öncelik)

1. **p=0.2'de panel/küre kesişiminde küçük bir dörtgen parlaklık artefaktı.**
   Kök neden: silüet-slope eşiği (`domeSlope`) çok az sayıda şeridin
   kesiştiği bölgede kuantize sıçrama yapıyor. İki turda yumuşatıldı
   (`smoothstep(0.6,2.4,...)`, yoğunluk 0.5); tamamen gidermek süper-örnekleme
   gerektirir, kapsam dışı bırakıldı.
2. **p=0.4'te küre/panel örtüşmesi referanstan daha "aralıklı."** Şerit adımı
   sabit (~%2,55 genişlik) olduğu için küçük yarıçaplı kürelerde az sayıda
   şerit kesişiyor; referans muhtemelen daha ince şerit veya daha büyük küre
   kullanıyor. Görsel karar: mevcut oran korundu (Bölüm 2'nin adım tarifine
   sadık kalmak, kürede daha çok şerit için adımı küçültmek ödünleşimdi).
3. **Panel kenarı organik dalgalı, referansın çoğu karesinde daha düz.**
   Bilinçli fark — Bölüm 1 hem "pürüzsüz duvar" hem "referans ÖZGÜN olsun"
   diyor; düz çizgi jenerik durduğu için hafif dalga tercih edildi.
4. **Büyük kürenin merkez/yarıçap değerleri gözle tahmin edildi** (iki sınır
   noktasından çember uydurma, bkz. `backdrop-path.ts` yorumu) — referans
   sitenin 3D kamera/perspektif verisi yok, yalnızca 2D karelerden mümkün
   olan en iyi yaklaşım.

## Dürüstlük notu

Ekran görüntüleri bu ortamda BAŞARIYLA alındı (siyah/boş kare sorunu
yaşanmadı, B adımı ilk denemede çalıştı). Karşılaştırma B/C/D adımlarıyla
sınırlı kaldı; A adımının (canlı tarayıcı) ayrıca denenmesine gerek kalmadı.
6 iterasyon sınırının 4'ü kullanıldı (büyük küre görünmüyordu → düzeltildi;
kenar bloklu görünüyordu → yumuşatıldı; rim ışığı bir karede blok gibi
okunuyordu → yumuşatıldı; fare parametreleri (mx/my) doğrulama modunda
uygulanmıyordu → düzeltildi). Kalan sapmalar madde 1-4'te listelendi.

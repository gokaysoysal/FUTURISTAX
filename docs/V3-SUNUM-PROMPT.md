# Claude Code — sunum katmanı yeniden inşası

> `git checkout v2 && git pull && git checkout -b v3-sunum`
>
> Önce bağımlılıkları kurun:
> ```
> cd apps/web
> pnpm add lenis gsap @gsap/react split-type three @react-three/fiber @react-three/drei lottie-react
> ```

---

```
Sunum katmanını baştan inşa ediyoruz. Altyapıya DOKUNMUYORUZ: tax-engine,
API route'ları, veritabanı, form, dağıtım aynen kalıyor. Değişen sadece
görünen katman.

Önce CLAUDE.md ve docs/PROJECT-STATUS.md oku.

Hedef: ödül alabilecek seviyede bir finans/danışmanlık sitesi.
Referanslar:
- dribbble.com/shots/27399041-Biotech-Branding-Website-Case-Study
  (sahne geçişleri, sinematik ritim, görsel yoğunluk)
- dribbble.com/shots/26684193-Cirform-AI-Finance-Website
  (fintech dili, veri görselleştirme)

Mevcut sürümün sorunu animasyon eksikliği değil, GÖRSEL BOŞLUK: ekranda
bakılacak bir şey yok. Bu koşunun asıl işi orayı doldurmak.

Sekiz bölüm. Her bölüm sonunda pnpm typecheck && pnpm test && pnpm build,
ayrı commit. Kırmızıyken devam etme.

────────────────────────────────────────
BÖLÜM 1 — Sanat yönetimi ve görsel varlıklar

FOTOĞRAF YÖNÜ — bu kuralları ihlal eden görsel kullanma:
  YASAK: el sıkışan takım elbiseliler, gülümseyen ofis ekibi, laptop
  başında poz veren insanlar, hesap makinesi + para yığını, ok yukarı
  grafik klişesi. Bunlar siteyi anında ucuzlatır.

  KULLAN: brütalist/modernist mimari detayları, cam ve beton dokular,
  makro belge ve kâğıt dokuları, uzun pozlu şehir gecesi, geometrik
  gölge desenleri, Ankara mimarisi, arşiv/dosya rafları soyut çekim.
  Tercihen tek renkli veya düşük doygunluklu — palete boyanabilsin.

Unsplash ve Pexels'ten 10-14 görsel seç, public/images/ altına indir,
next/image ile AVIF/WebP olarak sun. Her görselin kaynağını ve lisansını
public/images/CREDITS.md dosyasına yaz.

Görselleri OLDUĞU GİBİ kullanma: duotone veya renk katmanı uygula
(mix-blend-mode + palet rengi), grain overlay ekle. Böylece stok
fotoğraflar markanın parçası gibi durur, "stok" gibi değil.

LOTTIE: lottiefiles.com'dan finans/veri temalı 3-5 ücretsiz animasyon
seç (grafik çizimi, akış diyagramı, belge işleme). public/lottie/ altına
koy, lottie-react ile lazy yükle. Süs olarak değil, bir kavramı
anlatırken kullan.

────────────────────────────────────────
BÖLÜM 2 — WebGL hero

React Three Fiber ile ana sayfa hero'suna 3D sahne kur.

KONSEPT (birini seç, gerekçesini yaz):
- Veri akışı: parçacık sistemi, akan sayısal veri hissi, imleçle etkileşim
- Katmanlı ızgara: derinlikte yüzen belge/veri düzlemleri, parallax
- Shader alanı: sıvı gradyan + noise, yavaş devinen, palete bağlı

Kurallar:
- Sahne palet tokenlarını kullansın, kendi renklerini getirmesin.
- İmleç/dokunma etkileşimi olsun ama zorunlu olmasın.
- Hero metni SSR ile gelsin; 3D sahne progressive olarak üstüne binsin.
  Metin asla WebGL'i beklemesin.

ZORUNLU YEDEKLER:
- prefers-reduced-motion: reduce → statik bir görsel veya donmuş kare
- WebGL desteklenmiyorsa → CSS gradyan + görsel
- Mobilde (< 768px) → parçacık sayısını düşür veya statik yedeğe geç
- Sekme arka plandayken render'ı durdur (visibilitychange)
- dynamic(ssr: false) ile yükle, ilk yüklemeyi bloklamasın

────────────────────────────────────────
BÖLÜM 3 — Scroll ve geçiş sistemi

Lenis ile akışkan scroll kur. Merkezî yapılandırma: src/lib/motion/

GSAP ScrollTrigger ile sahne koreografisi:
- Bölümler pinlenerek anlatım: kullanıcı scroll ederken sahne içinde
  içerik değişsin (Biotech referansındaki gibi)
- Yatay scroll bölümü: hizmetler veya süreç adımları yanlamasına aksın
- Görsel reveal: clip-path ile açılan görseller, ölçek + opaklık
- Katmanlı parallax: arka plan, orta katman, ön plan farklı hızlarda

split-type ile başlık animasyonları: harf veya kelime bazında kademeli
giriş. Türkçe karakterlerin bölünmede bozulmadığını KONTROL ET.

Sayfa geçişleri: rota değişiminde perde/maske geçişi. View Transitions
API destekleniyorsa onu kullan, değilse Motion ile yedek.

Sayfa üstünde ince bir scroll ilerleme çubuğu.

KURAL: prefers-reduced-motion altında Lenis devre dışı, tüm ScrollTrigger
animasyonları anında son hâline atlasın, pin'ler kalksın. İçerik her
durumda erişilebilir kalmalı.

────────────────────────────────────────
BÖLÜM 4 — Ana sayfa yeniden inşası

Sinematik bir akış kur. Her bölüm bir sahne:

1. Hero — WebGL sahne + büyük tipografi + tek net CTA
2. Güven bandı — sayılar veya kısa konumlandırma cümlesi
   (doğrulanmamış istatistikleri KULLANMA, unverifiedClaims false)
3. Vergi Takvimi — imza bileşen, yeniden tasarlansın: zaman çizelgesi
   görünümü, yaklaşan tarihlere görsel vurgu
4. Hizmetler — yatay scroll veya pinlenmiş kart dizisi, her kart
   görselli
5. Süreç — "nasıl çalışıyoruz" adım adım, scroll'a bağlı ilerleyen
6. Araçlar vitrini — hesaplayıcı çalışma alanına canlı önizleme
7. Sektörler — ızgara, hover'da derinlik
8. CTA bölümü — güçlü kapanış

Her bölüm arasında görsel bir nefes olsun: doku, ışık huzmesi, ince
ayraç. Ama gradyanı her yüzeye yayma.

────────────────────────────────────────
BÖLÜM 5 — Hesaplayıcı çalışma alanı (ÖNEMLİ)

Mevcut hâli yetersiz: araçlar birbirinden kopuk ve grafik gerçek veriyi
yansıtmıyor. Yeniden kur.

/araclar sayfasını tek bir "çalışma alanı" hâline getir:
- Solda veya üstte araç seçici (sekme/segment kontrol): KDV, gelir
  vergisi, kurumlar vergisi, binek araç gider kısıtı, binek araç kira
  sınırı, SGK işveren maliyeti, kıdem tazminatı, TÜFE güncelleme,
  kur çevirici
- Araç değiştirince form ve sonuç akışkan biçimde geçiş yapsın
- HER ARAÇ KENDİ İÇİNDE BAĞIMSIZ HESAPLASIN. Her birinin kendi girdi
  alanları, kendi sonuç dökümü, kendi grafiği olsun.
- Grafik o aracın GERÇEK sonucunu göstersin — dilim dağılımı,
  indirilebilir vs KKEG, işveren maliyeti kırılımı gibi. Genel amaçlı
  bir grafiği her araca yapıştırma.
- Yıl seçici korunsun, UnverifiedRatesNotice görünmeye devam etsin
- Sonuç değiştiğinde sayı sayma animasyonu (tabular-nums korunarak,
  layout kaymadan)
- Her aracın kendi URL'i olsun (/araclar/[slug]) ve seçici o rotayı
  yansıtsın; derin link ve paylaşım çalışsın

Hesaplama mantığını packages/tax-engine'den al. YENİ HESAP MANTIĞI YAZMA.

────────────────────────────────────────
BÖLÜM 6 — Diğer sayfalar

Ana sayfadaki dili tüm sayfalara taşı: hizmet ve sektör detayları,
kurumsal, mevzuat, SSS, iletişim. Her sayfanın kendi giriş sahnesi
olsun ama ana sayfayla aynı ritmi paylaşsın.

İletişim sayfası özellikle güçlü olsun — dönüşümün olduğu yer orası.

────────────────────────────────────────
BÖLÜM 7 — Performans

Ağırlaşacak. Kontrol altında tut:
- WebGL, Lottie, grafikler: hepsi dynamic import + IntersectionObserver
  ile görünüre girince yüklensin
- Görseller: AVIF/WebP, blur placeholder, doğru sizes
- GSAP ve Three yalnızca kullanan sayfalarda bundle'a girsin
- Fontlar: değişken font, subset, preload yalnızca hero fontu
- Bundle analizi çalıştır, en ağır üç modülü raporla

lighthouserc.json eşikleri: performans 0.75, LCP 3000, CLS 0.05,
erişilebilirlik 1.0 (bu düşmez).

────────────────────────────────────────
BÖLÜM 8 — Erişilebilirlik (ESNEMEZ)

- axe taraması sıfır ihlal, tüm sayfalarda
- prefers-reduced-motion tam destek: Lenis kapalı, ScrollTrigger'lar
  son hâle atlar, WebGL statik yedeğe düşer, Lottie donar
- Klavyeyle tüm akışlar: araç seçici, komut paleti, filtreler, grafikler
- Pinlenmiş bölümler klavye kullanıcısını hapsetmesin
- Yatay scroll bölümü klavyeyle de gezilebilsin
- Grafiklerin sr-only tablo karşılığı
- Görsellerde anlamlı alt metni; dekoratif olanlarda alt=""
- Kontrast: gövde 4.5:1, büyük metin 3:1
- Türkçe karakterler hiçbir yerde düşmez — split-type sonrası özellikle
  kontrol et

────────────────────────────────────────
BİTİRİRKEN

docs/PROJECT-STATUS.md güncelle. CLAUDE.md'deki tasarım bölümünü yeni
yöne göre yeniden yaz. Karar gerektiren her şeyi "cevap bekleyen
kararlar"a ekle.

Raporla: hangi WebGL konseptini neden seçtin, hangi görselleri nereden
aldın, bundle boyutu ne oldu, hangi yedekler devrede.

YAPMA:
- main dalına dokunma
- tax-engine, API route'ları veya veritabanı şemasını değiştirme
- Vergi oranlarını değiştirme veya doğrulanmış işaretleme
- UnverifiedRatesNotice'ı kaldırma
- LEGAL_TEXTS_APPROVED'ı true yapma
- Testleri gevşetme
- ui-ux-pro-max scriptlerini çalıştırma
- Kurumsal klişe stok fotoğraf kullanma
```

---

## Koşu sonrası

`pnpm dev` ile gezin. Özellikle şuna bakın: **mobilde ne oluyor?** WebGL
hero'nun en riskli tarafı orası.

Sonra push edip önizleme adresini bana getirin.

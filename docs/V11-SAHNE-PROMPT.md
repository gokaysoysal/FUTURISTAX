# Claude Code — V11: oluklu panel + küre sahnesi (referans karelerden)

> Ajana: "docs/V11-SAHNE-PROMPT.md dosyasını oku ve içindeki kod bloğunu uygula."
>
> Önce altı referans karesini `docs/referans/1.png … 6.png` olarak koyun.
> Bu dosyaları GitHub'a commit ETMEYİN (ajan .gitignore'a ekleyecek).

---

```
Sen kıdemli bir grafik/full-stack mühendisisin. Görev: sitenin kalıcı
arka plan sahnesini, docs/referans/ altındaki 6 kareye benzeyen ÖZGÜN,
gerçek zamanlı bir WebGL sahnesiyle değiştirmek. Sahne scroll'a ve
fareye tepki verecek. Karar noktalarında bana sorma, en iyisini yap.
Bu iş dışında hiçbir şeye dokunma.

════════════════════════════════════════
BÖLÜM 0 — Hazırlık

1. git checkout v2 && git pull && git checkout -b v11-sahne
   git tag v2-oncesi-v11 && git push origin v2-oncesi-v11
2. .gitignore'a docs/referans/ ekle. Bu kareler başka bir sitenin
   sahnesi; depo public olduğu için yayınlanmamalı. Zaten commit
   edilmişse git rm -r --cached docs/referans ile çıkar ve bana
   geçmişte kaldığını raporla.
3. 6 kareyi (1920x988) tek tek OKU ve incele. Aşağıdaki anatomi benim
   gözlemim; ölçüleri kendin doğrula, çelişki varsa karelere güven.
4. Paleti karelerden ÖRNEKLE: yeni bağımlılık ekleme; Playwright
   sayfasında canvas.getImageData ile en koyu, orta ve en açık zemin
   rengini, kenar ışığı rengini oku. docs/qa/palet.md'ye yaz ve
   tokens.css'e --scene-* olarak ekle. Sahnede menekşe KULLANMA.

YASAK: referans sitenin JS, shader, doku veya videolarını indirme,
kopyalama ya da DevTools'tan çekme. Kareler yalnızca hedef ve karşılaştırma
içindir; public/ altına konmaz, doku olarak kullanılmaz.

════════════════════════════════════════
BÖLÜM 1 — Referansın anatomisi (gözlem)

- SOL PANEL: ince dikey şeritlerden (oluklu) oluşan yüzey. Şerit adımı
  genişliğin ~%2,55'i (1920px'te ~49px), her sınırda ~3px koyu oluk.
  Panel genişliğin ~%47,4'ünde SERT bir dikey kenarla biter; sağı düz,
  pürüzsüz duvar.
- KÜÇÜK KÜRE: karelerde sırayla sağ üst (düz duvarda) → sol üst →
  sol alt → alt orta (yarısı görünür) → neredeyse çıkmış → 6. karede
  üstten yeniden girmiş. Yani aşağı doğru elips benzeri bir yörünge.
- KÜRE ŞERİTLERİ DEFORME EDER: panel içindeyken küre, şeritleri
  kubbe gibi kaldırır; şeritlerin oluk çizgileri kürenin üzerinden
  kesintisiz devam eder. Şeritlerin kenarlarında mercek/hilal biçimli
  turkuaz kenar ışığı oluşur (2. ve 3. kare). 1. karedeki çapraz ışık
  huzmesi şeritlerde testere dişi gölge bırakır.
- BÜYÜK İKİNCİ KÜRE: sağ/sağ altta, ekran yüksekliğinin birkaç katı
  yarıçaplı; yalnızca sol kenarı bir eğri olarak görünür ve turkuaz
  kenar ışığı taşır. Scroll'da yavaşça yer değiştirir. 2.-3. karede
  panelin sağ ucundaki şeritleri de kendine doğru çeker.
- IŞIK EVRELERİ: 1. kare koyu, çapraz huzmeli; 2. orta; 3-5. parlak
  gri-mavi (ambient yüksek); 6. yeniden koyu.
- SİNEMATİK KATMAN: belirgin film greni, güçlü vinyet.

════════════════════════════════════════
BÖLÜM 2 — Teknik yaklaşım (önerim; karelere daha iyi uyan bir şey
bulursan onu kullan)

Mevcut ogl + Lenis + paylaşımlı RAF altyapısını koru (components/backdrop,
lib/motion/raf.ts, cursor.ts, backdrop-scene.ts). Yalnızca sahnenin
shader'ını ve parametre modelini değiştir; React Bits Orb shader'ını
kaldır. Tek tam ekran üçgen + fragment shader.

Önerilen model — "kuantize yükseklik alanı", raymarching YOK:
- Her pikselin şerit indeksi i = floor(x / adım); yükseklik şerit
  merkezinden hesaplanır: H = kubbe(küçük küre) + kubbe(büyük küre),
  yalnızca panelin içinde. Yükseklik x'te kuantize, y'de sürekli olduğu
  için komşu şeritler arasında basamaklar oluşur; hilal/mercek biçimleri
  ve testere dişi gölgeler buradan çıkar.
- Aydınlatma: yön ışığı + Fresnel benzeri turkuaz kenar ışığı (basamak
  yüzeylerinde ve kürelerin siluetinde), komşu şerit yüksekliğinden
  türetilen ucuz yumuşak gölge.
- Küreler panel dışında düz duvar üzerinde normal küre olarak çizilir.
- Grenin animasyonu düşük hızlı (~12 fps etkin) olsun, vinyet güçlü.
- Şerit adımı dar ekranda alt sınır 22px (mobilde daha az, daha kalın).

════════════════════════════════════════
BÖLÜM 3 — Scroll yolu

Lenis ilerlemesini 0..1'e normalize et. Altı kare, tek scroll yolunun
eşit aralıklı örnekleri varsayıldı: p = 0, .2, .4, .6, .8, 1.
Başlangıç değerleri (görsel tahminim, viewport 0..1, y aşağı; yarıçap
viewport yüksekliğine oranlı; karelerden ölç, düzelt):

 p     küçük küre (x, y, r)     ışık   notlar
 0.0   0.75, 0.19, 0.28         0.35   düz duvarda, çapraz huzme
 0.2   0.20, 0.32, 0.31         0.50   panelde, şeritler kubbe
 0.4   0.20, 0.70, 0.35         0.85   alt sol, ambient yüksek
 0.6   0.36, 1.08, 0.38         0.95   çoğu ekran dışı
 0.8   0.57, 1.40, 0.40         0.90   neredeyse çıkmış
 1.0   0.60, 0.02, 0.29         0.30   üstten yeniden giriyor

0.8 → 1.0 arasında küre tamamen ekran dışında kalıp üstten geri girsin
(döngü hissi). Anahtar karelerde Catmull-Rom (veya benzeri düzgün)
enterpolasyon; parametreler sönümlü lerp ile (~0.06) — sıçrama yok,
ama scroll durunca sahne de durur. Yol fonksiyonunu saf bir modüle çıkar
(lib/motion/backdrop-path.ts) ve birim testle: anahtar karelerde beklenen
değer, süreklilik, sınır değerleri.
Büyük kürenin yolunu da karelerden çıkar (p=0'da sağ altta, orta
evrelerde sağa-yukarı, sonda başlangıca yakın).

════════════════════════════════════════
BÖLÜM 4 — Fare

- Işık odağı fareyi sönümlü izler (~0.06); kenar ışığı ve parlak
  bölgeler buna göre kayar.
- Küçük küre fare yönünde ±%2, büyük küre ters yönde ±%1 kayar
  (derinlik hissi). Scroll hareketinin ÜSTÜNE binen ikincil katman;
  onu ezmez.
- Dokunmatik cihazda fare katmanı kapalı. prefers-reduced-motion
  altında fare ve scroll hareketi kapalı: tek statik kare (p≈0.2).

════════════════════════════════════════
BÖLÜM 5 — Okunabilirlik (esnemez)

Parlak evrelerde (p 0.4-0.8) zemin ~#7a8bab civarına çıkıyor; beyaz
metin orada ~3,3:1 verir, tabanımız 4,5:1. Çözüm:
- Tüm metin blokları buzlu cam kart içinde olsun: koyu yarı saydam zemin
  (>=%55 opaklık) + backdrop-filter blur. Kart zemini sahne üzerine
  bindirildiğinde bileşik göreli parlaklık <= 0.15 olmalı (#EAF0F7 metin
  için 4,5:1 sınırı). Bunu en parlak evre (p=0.6) için hesapla ve yaz.
- Gerekirse sahnenin en parlak evresini biraz kıs; okunabilirlik görsel
  sadakatten önce gelir.
- Hero başlığı ve butonlar hiçbir evrede kürenin veya şeritlerin
  altında okunmaz kalmasın.

════════════════════════════════════════
BÖLÜM 6 — Performans ve yedekler

- Mount'u requestIdleCallback sonrasına al; önce CSS yedeği görünür,
  sahne 600ms crossfade ile gelsin. Hero metni SSR kalır, LCP'yi
  canvas geciktirmesin.
- DPR üst sınırı 1.5; mobilde iç çözünürlük 0.6-0.75 ölçek. Sekme
  gizliyken render durur (paylaşımlı RAF).
- WebGL yoksa veya reduced-motion: CSS yedeği (repeating-linear-gradient
  ile oluklu panel + gren + vinyet). Statik kare bunun WebGL sürümü.
- Ana sayfa ilk yük JS <= 220 kB, yeni bağımlılık yok.

════════════════════════════════════════
BÖLÜM 7 — Doğrulama döngüsü (atlama; en kritik bölüm)

Bu ortamda WebGL çıktısını görmek daha önce başarısız oldu (canvas
boş pikseller, document.hidden). Aşağıdakileri SIRAYLA dene, hangisi
çalışırsa onunla ilerle:

A) Deterministik hata ayıklama modu: NEXT_PUBLIC_SCENE_DEBUG=1 iken
   ?scene-debug=1&p=0.4&mx=0.5&my=0.5 parametreleriyle sahne verilen
   durumda tek kare çizer, preserveDrawingBuffer açık olur ve hazır
   olunca window.__sceneReady = true olur. Üretim derlemesinde bayrak
   kapalıyken bu kod yolu devre dışıdır.
B) Playwright chromium'u yazılımsal WebGL ile başlat:
   args: --use-angle=swiftshader, --use-gl=angle,
   --enable-unsafe-swiftshader, --ignore-gpu-blocklist
   (gerekirse pnpm exec playwright install chromium). p = 0, .2, .4,
   .6, .8, 1 için ekran görüntüsü al (1920x988).
C) Yan yana karşılaştırma: yeni bağımlılık ekleme; bir HTML sayfasında
   referans kare ve üretilen kareyi yan yana koyup Playwright ile
   ekran görüntüsü al → docs/qa/karsilastirma-p{0..1}.png.
D) Öz değerlendirme tablosu (docs/qa/karsilastirma.md), her kare için:
   şerit sayısı/adımı ve panel kenarı konumu, küre konumu (±%10),
   kenar ışığının varlığı, ışık evresi (koyu-parlak-koyu), gren ve
   vinyet, şeritlerin kürede kubbe yapması. Her madde: uyuyor / farklı
   + neden.
E) Farklıysa parametreyi/şeyi düzelt ve B-D'yi tekrarla. En fazla 6
   yineleme; sonra dur ve durumu dürüstçe raporla.

DÜRÜSTLÜK KURALI: Ekran görüntüsü alamadıysan "doğrulandı" DEME.
PROJECT-STATUS.md'ye "görsel doğrulama yapılamadı" yaz, hangi kareleri
kullanıcının hangi adreste ve hangi p değerleriyle kontrol etmesi
gerektiğini listele. Kareler boş/siyahsa bunu da yaz.

════════════════════════════════════════
BİTİRİRKEN

- Kontrol: pnpm typecheck, lint, build (turbo.exe Windows'ta
  engelleniyorsa paketleri ayrı ayrı çalıştır), e2e/hydration testi.
- Playwright'a küçük bir test ekle: canvas var, data-backdrop-state
  özniteliği geçerli p'yi veriyor, reduced-motion'da hareket yok.
- docs/PROJECT-STATUS.md ve CLAUDE.md'nin tasarım bölümünü güncelle.
- Commit'leri bölüm bölüm at; typecheck+build yeşilse v2'ye merge et,
  push et.

YAPMA:
- main dalına dokunma
- tax-engine, API, veritabanına dokunma
- Vergi Yükü Panosu hatasıyla ilgilenme (ayrı, bilinen bir sorun)
- Referans karelerini commit etme veya siteye koyma
- Testleri gevşetme, erişilebilirlik kurallarını bastırma
- Görmediğin bir çıktı için "doğru görünüyor" deme
```

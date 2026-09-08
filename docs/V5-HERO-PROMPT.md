# Claude Code — hero düzeltmesi, scroll hareketi, tipografi

> Ajana: "docs/V5-HERO-PROMPT.md dosyasını oku ve içindeki kod bloğunu uygula."

---

```
Üç iş var: önce görünen hataları düzelt, sonra scroll hareketini kur,
sonra tipografiyi değiştir. SIRAYLA. Her bölüm sonunda
pnpm build && pnpm start ile üretim modunda AÇ VE GÖZLE DOĞRULA,
sonra commit at.

════════════════════════════════════════
BÖLÜM 1 — Hero'daki görünen hatalar (ÖNCE BU)

Canlı önizlemede üç hata var. Yeni özellik eklemeden önce bunları kapat.

HATA 1 — Yüzen kartlar başlığın üstüne biniyor
Kartlar mutlak konumlandırılmış ve başlık metniyle çakışıyor. Metin
okunamıyor.
Çözüm: kartları serbest konumlandırma. Hero'yu açık bir ızgaraya kur ve
kartlara başlık sütununun DIŞINDA ayrılmış bölgeler ver (sol/sağ boşluk,
üst/alt bant). Başlığın kapladığı alan kartlara kapalı olsun.
Dar ekranlarda kartlar başlığın altına insin, üstüne binmesin.
Doğrulama: 1920, 1440, 1024, 768, 390 px genişliklerde başlığın hiçbir
harfi bir kartın altında kalmamalı.

HATA 2 — Başlık soldan kesiliyor
Ekranda "giyi yönetile..." görünüyor; başlık kapsayıcısından taşıyor.
Çözüm: sabit genişlik ve negatif margin kullanma. Font boyutunu
clamp() ile akışkan yap, kapsayıcıya max-width ver, overflow-x
kontrol et. Türkçe uzun kelimeler (dönüştürüyoruz, yükümlülük) taşmaya
en yatkın olanlar — onlarla test et.

HATA 3 — Solda siyah dikdörtgen artığı
Hero'nun solunda içeriği olmayan siyah bir blok var. Muhtemelen boş bir
görsel kapsayıcısı, yüklenmemiş bir doku ya da yanlış boyutlanmış canvas.
Bul ve kaldır.

Bu üçü düzelmeden Bölüm 2'ye geçme.

════════════════════════════════════════
BÖLÜM 2 — Scroll'a bağlı hareket

İSTENEN DAVRANIŞ: sayfa aşağı kaydıkça hem arka plan sahnesi hem de
öndeki kartlar/öğeler hareket etsin. Hiçbir şey donuk durmasın.

1. KARTLAR SCROLL'DA HAREKET ETSİN
   Şu an kartlar sabit duruyor. Her kart scroll ilerlemesine bağlı
   farklı hızda hareket etsin (parallax): arkadakiler yavaş, öndekiler
   hızlı. Hafif rotasyon ve ölçek değişimi de ekle.
   Hero'dan çıkarken kartlar dağılarak yukarı süzülsün, ani kaybolmasın.

2. ARKA PLAN SAHNESİ SAYFA BOYUNCA DEVAM ETSİN
   Tek kalıcı canvas, layout seviyesinde, position fixed, içeriğin
   arkasında, pointer-events: none. Rota değişiminde yeniden mount
   olmasın.
   Lenis scroll ilerlemesini 0-1'e normalize edip sahneye uniform
   olarak geçir. Her bölüm kendi hedef parametrelerini kaydetsin:
   renk sıcaklığı, yoğunluk, kamera derinliği, akış hızı.
   Bölümler arası geçiş sönümlü lerp ile (damping ~0.05) — ani sıçrama
   olmasın.

3. BÖLÜM İÇİ HAREKET
   Her bölümün içeriği de scroll'a tepki versin: başlıklar farklı hızda
   girsin, kartlar kademeli belirsin, görseller hafif ölçeklensin.
   Sayfa hiçbir noktada "durmuş" hissettirmesin.

4. OKUNABİLİRLİK — ESNEMEZ
   Hareketli arka plan üzerinde metin kontrastı düşer. Her metin
   bloğunun arkasına ince scrim koy (radial/lineer, düşük opaklık).
   Kontrast oranlarını GERÇEK arka plan üzerinde ölç: gövde metni
   4.5:1, büyük metin 3:1 altına düşmeyecek.
   Metin asla hareketli bir öğenin altında kalmayacak.

5. PERFORMANS
   - Tek RAF döngüsü, Lenis ile paylaşımlı
   - Sekme arka plandayken render dur (visibilitychange)
   - devicePixelRatio max 2
   - Mobilde karmaşıklık yarıya
   - Ana sayfa ilk yük JS 220 kB altında

6. YEDEKLER
   - prefers-reduced-motion → sahne donar, parallax kapanır, içerik
     son hâliyle durur
   - WebGL yoksa → CSS gradyan + grain
   - Düşük performanslı cihaz → statik yedek

════════════════════════════════════════
BÖLÜM 3 — Tipografi

Mevcut fontlar sıradan. Daha cesur ve ayırt edici bir set kur.

MARKA BAĞLAMI: FuturistaX kendi yapay zekâ araçlarını ve yazılımlarını
kullanan bir denetim/danışmanlık firması. Tipografi bu teknolojik
iddiayı taşımalı — ama okunabilirlikten ödün vermeden. Mali müşavirlik
sitesi bu; bilim kurgu afişi değil.

ADAYLAR (hepsi ücretsiz):
  Display: Syne, Unbounded, Bricolage Grotesque, Chillax, Clash Display
  Gövde:   Sora, Space Grotesk, General Sans, Satoshi
  Veri:    Martian Mono, Space Mono, IBM Plex Mono

Syne ve Unbounded en ayırt edici olanlar — geniş, geometrik, çağdaş.
Sora gövdede modern ve okunaklı.

ZORUNLU DOĞRULAMA: bir fontu benimsemeden önce Türkçe glif kapsamını
kontrol et — ı, İ, ğ, Ğ, ş, Ş, ç, Ç, ö, Ö, ü, Ü. Eksik glif varsa o
fontu KULLANMA. Hangi fontu seçtiğini ve kontrolü nasıl yaptığını
raporla. (Eski sitede bu kontrol atlandığı için başlıklarda Türkçe
karakterler düşürülmüştü — tekrar etmesin.)

Uygulama:
- Display boyutları büyük ve iddialı: hero clamp(3rem, 8vw, 7rem)
- Sıkı letter-spacing (-0.03em), yakın satır aralığı (0.95-1.05)
- Değişken font varsa tercih et, next/font ile self-host, swap
- Gövde okunaklı kalsın: 17-18px, 1.6 satır aralığı
- Rakamlarda tabular-nums korunsun
- split-type ile bölünen başlıklarda Türkçe karakterlerin bozulmadığını
  GÖRSEL OLARAK doğrula

════════════════════════════════════════
DOĞRULAMA — bu adımı atlama

Her bölüm sonunda:
  pnpm build && pnpm start
Sonra tarayıcıda AÇ ve gerçekten gez. Sadece "build yeşil" yeterli
değil — önceki turda build geçiyordu ama sayfa çalışma zamanında
çöküyordu.

Kontrol et:
- Ana sayfa hatasız açılıyor mu, konsol temiz mi
- Kartlar başlıkla çakışıyor mu (5 farklı genişlikte)
- Scroll'da arka plan ve öğeler hareket ediyor mu
- Metinler her noktada okunabilir mi
- Türkçe karakterler doğru basılıyor mu

Sonra typecheck && test && build, commit, push.

YAPMA:
- main dalına dokunma
- tax-engine, API, veritabanı şemasını değiştirme
- Vergi oranlarını değiştirme
- UnverifiedRatesNotice'ı kaldırma
- Testleri gevşetme
- Okunabilirliği görsel etki için feda etme
```

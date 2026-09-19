# Claude Code — hazır bileşenden arka plan sahnesi kur

> Ajana: "docs/V9-HAZIR-BILESEN.md dosyasını oku ve içindeki kod bloğunu uygula."

---

```
Üç turdur kendi shader'ımızı sıfırdan yazıp scroll senkronizasyonunda
sorun yaşıyoruz. Yön değiştiriyoruz: olgunlaşmış, açık kaynak, ücretsiz
bir bileşen kütüphanesinden başlayıp kendi ihtiyacımıza göre uyarlıyoruz.

OTONOMİ: Karar noktalarında bana sorma, en iyi kararı ver. Bu konu
dışında hiçbir şeye dokunma.

────────────────────────────────────────
ADIM 0 — Referansı gerçekten gör

claude-in-chrome ile https://futureoffinance.peachweb.io/ adresini aç,
hero'dan footer'a scroll et. Arka plandaki objenin tipini, rengini,
scroll ile nasıl değiştiğini not et.

────────────────────────────────────────
ADIM 1 — Aday kütüphaneleri incele

İki kaynağa bak, ikisi de ücretsiz ve açık kaynak:

1. React Bits — github.com/DavidHDev/react-bits
   npm: aynı depo üzerinden shadcn-tarzı CLI ile tek bileşen kurulumu
   destekliyor (bileşen kodu projeye kopyalanır, bağımlılık olarak
   eklenmez). İlgili bileşenler: Hyperspeed, Lightning, RippleGrid,
   Ballpit, ShapeBlur, Aurora, GradientBlinds.

2. Lightswind UI — lightswind.com/components/background
   Next.js + Tailwind için hazır kopyala-yapıştır WebGL/canvas
   bileşenleri: Aurora, Particles, Beam Grid, Liquid Surface, Reflect.

WebFetch ile her ikisinin de dokümantasyonunu oku. Referansın görsel
diline (tek odaklı, sakin, mavi-mor spektrum ışıma) en yakın 2-3 adayı
belirle.

────────────────────────────────────────
ADIM 2 — Seçim kriterleri (bunları kontrol etmeden kurma)

21st.dev'in yayımladığı bir analize göre incelenen 155 arka plan
bileşeninden yalnızca %4'ü sekme gizlenince render'ı durduruyor,
yalnızca %3'ü prefers-reduced-motion'a saygı gösteriyor. Yani "hazır"
olması doğru yazıldığı anlamına gelmez. Seçtiğin bileşenin kaynak
kodunu oku ve şunları DOĞRULA:

- requestAnimationFrame döngüsü var mı, IntersectionObserver veya
  visibilitychange ile duraklıyor mu?
- prefers-reduced-motion kontrolü var mı? Yoksa SEN ekleyeceksin.
- unmount'ta temizlik (cleanup) yapılıyor mu, memory leak riski var mı?
- SSR uyumlu mu (Next.js App Router'da dynamic ssr:false ile
  çalışacak mı)?
- Dışarıdan scroll ilerlemesi enjekte etmeye uygun bir API'si var mı
  (prop olarak progress/uniform alabiliyor mu), yoksa kendi iç saatiyle
  mi çalışıyor?

Bu kontrolleri geçmeyen bileşeni SEÇME, listede bir sonrakine geç.

────────────────────────────────────────
ADIM 3 — Kur ve scroll'a bağla

Seçtiğin bileşeni projeye al (CLI ile veya kaynağı kopyalayarak).

Lenis'in scroll ilerlemesini (0-1 normalize) bileşenin kabul ettiği
prop/uniform'a bağla. Bileşen kendi iç zamanlayıcısıyla çalışıyorsa,
o zamanlayıcıyı scroll ilerlemesiyle sürecek şekilde fork'la —
bağımsız oynamasın.

Renk paletini mevcut tema tokenlarına (azur/menekşe aksan) göre
özelleştir. Referanstaki gibi TEK ve NET bir odak noktası hedefle;
bileşenin varsayılan yoğunluğu fazlaysa parametrelerini kıs.

────────────────────────────────────────
ADIM 4 — Eski sahneyi kaldır

components/backdrop/ altındaki önceki elle yazılmış shader sistemini
kaldır. İki paralel sahne bırakma.

────────────────────────────────────────
ADIM 5 — Performans ve yedekler (esnemez)

- prefers-reduced-motion: reduce → sahne donar/kapanır
- WebGL yoksa → CSS gradyan yedeği
- Sekme arka plandayken render dur
- Ana sayfa ilk yük JS 220 kB altında
- Metin okunabilirliği: scrim + kontrast 4.5:1 altına düşmesin

────────────────────────────────────────
ADIM 6 — Görsel doğrulama (atlama)

claude-in-chrome ile kendi sitende aynı scroll turunu yap. Referansla
karşılaştır. Metin okunabilirliğini kontrol et. Mobilde (390px) de
tekrarla. Konsol hatasız olmalı. Tatmin olmadıysan ADIM 2'ye dön,
başka bir aday dene.

────────────────────────────────────────
BİTİRİRKEN

pnpm typecheck && pnpm test && pnpm build yeşil.
docs/PROJECT-STATUS.md güncelle: hangi kütüphaneden hangi bileşeni
seçtin, neden, hangi kontrolleri geçti.
Commit, v2'ye push.

YAPMA:
- main dalına dokunma
- tax-engine, API, veritabanı şemasını değiştirme
- Bilinen diğer hatalarla (Vergi Yükü Panosu vb.) ilgilenme
- Testleri gevşetme
- Kaynak kodunu okumadan bir bileşeni güvenip kurma
```

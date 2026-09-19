# PROJE DURUMU — devam noktası

> **Her yeni oturumda önce bu dosyayı oku.** Kurallar ve mimari için `CLAUDE.md`.

**Son güncelleme:** 2026-09-19 — V10 İÇERİK + ARKA PLAN (`v10-icerik-arkaplan`
dalı, `v2`'den): üç iş tamamlandı — (1) arka plan sahnesine imlece duyarlı
ikincil katman eklendi, (2) `document-grid` sahne varyantındaki sahte yatay
ızgara çizgileri kaldırıldı, (3) tüm site www.futuristax.com'un yayınladığı
GERÇEK içerikle dolduruldu (firma bilgileri, 9 hizmet, 8 sektör — önceki 7
varsayımı yanlıştı —, SSS, kanun bilgi bankası, 3 gerçek referans).
**3/3 iş bitti.** Öncesinde: V9 HAZIR BİLEŞEN (`v9-hazir-bilesen` dalı,
`v2`'den): kalıcı arka plan sahnesi artık elle yazılan bir shader değil —
react-bits `Backgrounds/Orb` bileşeninin (MIT+Commons Clause, tek bağımlılık
`ogl`) ışık/gürültü shader'ı taban alındı, three.js/@react-three/fiber/drei
bağımlılığı tamamen kaldırıldı, **1/1 bölüm bitti**. Öncesinde: V8 BACKDROP
(`v8-backdrop` dalı, `v2`'den): tek küre düz gaussian lekeden gerçek
aydınlatılmış/hacimli küreye yeniden çizildi, 2026-09-19. Öncesinde: V7 ORB
(`v7-orb` dalı, `v2`'den): kalıcı arka plan sahnesi çok-oktavlı bulut
alanından tek odaklı küreye sadeleştirildi, 2026-09-19. Öncesinde: ANA SAYFA
bölüm ayraç "beyaz çizgileri" kaldırıldı (`v2`, küçük düzeltme, 2026-09-08).
Öncesinde: V6 REFERANS CİLASI (`v6-referans` dalı, `v2`'den), **3/3 bölüm
bitti**.
Önceki: V5-HERO (`v5-hero`, `v2`'ye merge) · V4-AKIS (`v4-akis`, merge) ·
V3 SUNUM KATMANI (`v2-fx`, merge) · TASARIM YÖNÜ DEĞİŞİMİ (`v2-tasarim`, absorbe).
**Depo:** github.com/gokaysoysal/FUTURISTAX — çalışma dalı `v2`, aktif koşu dalı `v10-icerik-arkaplan`
**Önizleme:** deploy-preview-1--futuristax.netlify.app
**Canlı site:** futuristax.com — hâlâ ESKİ sürüm (`main` dalı, `legacy/index.html`)

---

## 0-S. V10 İÇERİK + ARKA PLAN — 2026-09-19 (`v10-icerik-arkaplan`, `v2`'den)

Görev: `docs/V10-ICERIK-ARKAPLAN.md`'deki otonom prompt — üç iş, sırayla.
**Kapsam:** backdrop imleç katmanı + `document-grid` düzeltmesi + site geneli
gerçek içerik. tax-engine/API/DB/vergi oranları/Vergi Yükü Panosu dokunulmadı.

### İş 1 — Arka planı imlece duyarlı yap

`lib/motion/cursor.ts` (yeni): yalnızca gerçek mouse'ta (`pointer: fine`)
`pointermove` izler, damped lerp (`backdrop-scene.ts`'teki aynı desen,
kare hızından bağımsız) ile sönümler. `SiteBackdropScene`'de `uCenter`'a
küçük bir ofset (`±0.035`) olarak eklendi — scroll'un sürdüğü ana hareketin
ÜSTÜNE biner, onu ezmez. Dokunmatik cihazlarda `startCursorTracking()`
no-op döner (katman etkisiz). `prefers-reduced-motion` altında zaten hiç
çağrılmıyor (`reduce` dalı ayrı).

**Doğrulanamayan (ortam sınırlaması, V7/V8/V9'da da aynı bulgu):** bu
otomasyon ortamında sekme `hasFocus()===true` iken bile `document.hidden
===true` raporlanıyor — `raf.ts` TASARIM GEREĞİ bu durumda hiç başlamıyor,
yani gerçek pikselde imleç-tepkisi bu ortamda GÖZLE görülemedi. Kod
mimarisi ve olay bağlanması doğrulandı (console'da cursor/backdrop/WebGL
hatası yok); gerçek fare hareketiyle görsel doğrulama kullanıcı/CI
tarayıcısında yapılmalı.

### İş 2 — Sahte ızgara çizgileri kaldırıldı

`components/media/SceneBackdrop.tsx` → `DocumentGrid`: tekrarlanan yatay
çizgi deseni (`sb-doc-grid` pattern + dolgu `rect`) kaldırıldı, belge
silüeti (bloklar + kenar çizgisi) korundu. Bu varyant `PageHero`
üzerinden `/mevzuat`, `/mevzuat/[slug]`, `/hizmetler/[slug]`, `/araclar`
sayfalarının TAMAMINDA kullanılıyordu — düzeltme hepsine yayıldı. Yerel
`pnpm dev` ile `/mevzuat` ve `/hizmetler/sgk-ve-isci-mevzuati` başlıkları
GÖZLE doğrulandı (çizgi yok).

### İş 3 — Gerçek içerik

`www.futuristax.com` firmanın kendi yayınladığı sitesi — `curl` ile ham
HTML alınıp doğrulandı (WebFetch'in ilk özeti testimonial unvanlarında
şüpheli bir tekrar gösterdiği için — Cenk Yavuz ve Esra Yıldız'ın ikisi de
"CFO · Teknoloji A.Ş." — raw HTML'den birebir teyit edildi, gerçekten
öyle).

- `packages/config/src/site.ts`: kurucu unvanı/kimlik bilgileri (Vergi
  Danışmanı · Kurucu, SMMM/Vergi Danışmanı/Mali Denetçi, 12+ yıl), adres
  ("Gaziosmanpaşa Mah. Bülten Caddesi 72"), `unverifiedClaims` gerçek
  rakamlarla (150+, %98, %28, %82) `publish: true` — yapı (CLAUDE.md
  kuralı) korunuyor, sadece bu rakamlar onaylandı.
- `/kurumsal`: gerçek zaman çizelgesi (2013/2016/2020/2023) ve onaylı
  rakamlar bloğu eklendi; `FOUNDER.bio` gerçek metinle değiştirildi.
- 9 hizmet kaydı gerçek özetle güncellendi (`draft: false`). İki isim/kapsam
  değişikliği: "Kurumsal yapılandırma" → **"Stratejik yapılandırma"**
  (slug da değişti, KVK Madde 19 vurgusu eklendi); "Bağımsız denetim
  desteği" tamamen kaldırılıp **"SGK ve işçi mevzuatı"** ile değiştirildi —
  firmanın gerçek 9. hizmeti bu, öbürü hiç yoktu.
- Sektörler **7'den 8'e çıkarıldı** (önceki varsayım yanlıştı, `CLAUDE.md`
  ve koddaki 7 sayısı artık geçersiz — kod tarafında `SECTORS.length`
  zaten dinamikti, yalnızca veri eklendi): `imalat`→`uretim-ve-sanayi`,
  `bilisim-ve-yazilim`→`teknoloji-ve-bilisim`,
  `saglik`→`saglik-ve-eczacilik` yeniden adlandırıldı; `lojistik` ve
  `hizmet-ve-danismanlik` KALDIRILDI (firmanın gerçek listesinde yok);
  `finans-ve-sermaye-piyasalari`, `tarim-ve-gida`, `enerji-ve-cevre`
  eklendi. Tüm çapraz referanslar (`relatedServiceSlugs`/
  `relatedSectorSlugs`, e2e'deki `/sektorler/imalat`) güncellendi.
- `/sss`: iki gerçek kategori (Vergi & Danışmanlık, Teşvik & Ar-Ge) —
  gerçek soru/cevaplar, KVK/GVK madde atıfları ve tutarlar firmanın kendi
  metninden. "Gizlilik ve veri" kategorisi (genel, taslak) korundu.
- `/mevzuat`: yeni "Kanun bilgi bankası" bölümü — 5 kanun,
  mevzuat.gov.tr'ye doğrudan bağlantı (`LAW_LIBRARY`, `legislation.ts`).
- 3 gerçek, yazılı yayın izinli referans eklendi (`testimonials.ts`):
  Cenk Yavuz, Esra Yıldız, Murat Kaya — isim/unvan/alıntı birebir kaynak
  siteden. Ana sayfadaki "Örnek Müşteri A" yer tutucuları kaldırıldı;
  `TestimonialTriad` artık `publishableTestimonials()` kullanıyor.
  `lib/data/placeholder/testimonials.ts` gereksiz kaldığı için silindi.

### Doğrulama

`pnpm typecheck · lint · test (tax-engine 65) · build` — **kökten** (turbo)
çalıştırıldı, hepsi yeşil (önceki oturumlardaki `turbo.exe` Windows Uygulama
Denetimi engeli bu oturumda YAŞANMADI). `playwright --list`: 92 test / 7
dosya, parse temiz. Yerel `pnpm dev` + claude-in-chrome ile GÖZLE doğrulandı:
ana sayfa, `/hizmetler`, `/hizmetler/sgk-ve-isci-mevzuati`, `/sektorler`,
`/kurumsal`, `/sss`, `/referanslar`, `/mevzuat` — 8 sektör doğru sırada,
9 hizmet doğru içerikle, gerçek referanslar, Türkçe karakterler
(İ ğ Ş ç ö ü) hiçbir yerde düşmüyor, ızgara çizgisi yok. Konsolda tek uyarı:
önceden var olan, bu koşuyla ilgisiz dev-only CSP nonce hydration uyarısı
(V8'den beri bilinen, kapsam dışı).

**Doğrulanamayan (ortam sınırlaması):** WebGL sahnesinin gerçek pikselde
imlece tepkisi (yukarıda İş 1) ve gerçek 390px mobil viewport (`resize_window`
bu ortamda `window.innerWidth`'i değiştirmiyor — V7'de de aynı bulgu
kaydedilmişti). **Kullanıcı/CI tarayıcı QA'sında doğrulanmalı.**

### Sonraki adım

- Kullanıcı/CI tarayıcı QA (imleç hareketi + mobil 390px) → `v10-icerik-arkaplan` → `v2` merge.
- `main`'e ERKEN GEÇME.

---

## 0-T. V9 HAZIR BİLEŞEN — 2026-09-19 (`v9-hazir-bilesen`, `v2`'den)

Görev: `docs/V9-HAZIR-BILESEN.md`'deki otonom prompt — üç turdur (V7/V8, artı
bu koşunun kendi ilk denemeleri) elle yazılan shader'ın scroll senkronizasyonu
ve görsel doğrulamayla hep boğuşması üzerine, yön değiştirip olgun, açık
kaynak bir bileşenden başlamak. **Kapsam: yalnızca
`components/backdrop/SiteBackdropScene.tsx` + `apps/web/package.json`
(bağımlılık değişimi).** tax-engine/API/DB/Vergi Yükü Panosu dokunulmadı.

### ADIM 0-1 — Referans + aday araştırması

Referans (futureoffinance.peachweb.io) gerçek tarayıcıyla incelendi: arka
plan tek, keskin kenarlı, arkadan aydınlatılmış bir küre — V8'in vardığı
sonuçla aynı, yeniden doğrulandı. Prompttaki aday listesi (Hyperspeed,
Lightning, RippleGrid, Ballpit, ShapeBlur, Aurora, GradientBlinds) react-bits
kataloğunun tamamına bakılmadan yazılmış tahminler çıktı — kataloğun
tamamı (`src/constants/Information.js`, GitHub üzerinden) tarandığında
`Backgrounds/Orb` ("Floating energy orb") bulundu: referansa doğrudan,
harfiyen uyan tek aday. Lightswind UI (dokümandaki ikinci kaynak) da
kontrol edildi — sphere/orb/globe kategorisinde hiç bileşeni yok.

### ADIM 2 — Seçim kriterleri

`Orb` kaynağı (react-bits, MIT+Commons Clause, tek bağımlılık `ogl` — three.js
değil, çok daha küçük) okundu:

| Kriter | Sonuç |
|---|---|
| rAF, visibilitychange/IO ile duraklıyor mu | ✗ kendi sürekli rAF'ı var, duraklamıyor |
| prefers-reduced-motion kontrolü | ✗ yok |
| unmount cleanup | ✓ rAF iptali, listener kaldırma, `WEBGL_lose_context` |
| SSR uyumlu (`dynamic(ssr:false)`) | ✓ modül seviyesinde window/document erişimi yok |
| Dışarıdan scroll ilerlemesi enjekte edilebiliyor mu | ✗ `iTime` tamamen içsel, dışa açık prop yok |

3/5 kriter "olduğu gibi" geçmedi — ama react-bits **kopyala-yapıştır**
modelinde (paket olarak değil, kaynak koda kopyalanır), yani bu üçü paketi
elemek için değil, **kendi kopyamızda düzeltmek için** bir kontrol listesi.
Aynen promptun reduced-motion için zaten izin verdiği gibi ("yoksa SEN
ekleyeceksin") — visibilitychange/IO ve dış ilerleme enjeksiyonu için de
aynı tavır uygulandı.

### ADIM 3 — Kurulum ve uyarlama

`SiteBackdropScene.tsx` **tamamen yeniden yazıldı** (R3F/three yerine ham
`ogl`): Orb'un fragment shader'ının ışık/gürültü matematiği (`snoise3`,
`light1`/`light2`, YIQ hue döndürme) **değiştirilmeden** taşındı. Değişen:

- Orb'un kendi rAF döngüsü, mouse-hover çarpıtması, `rotateOnHover`/
  `forceHoverState` kaldırıldı — bunun yerine V5'ten beri var olan TEK
  paylaşımlı rAF'a (`lib/motion/raf.ts`, sekme arka plandayken otomatik
  durur) ve `SceneRegion` hedef parametrelerine (`backdrop-scene.ts`'in
  `tone/density/depth/flow`'u — **değiştirilmedi**) bağlandı.
- `uCenter`/`uScale`/`uPresence` uniformları eklendi — `depth` küre
  boyutu/konumu/opaklığını sürüyor (hero büyük/yakın/parlak, kapanış küçük/
  uzak/soluk, iz asla sıfıra inmez) — V7/V8'deki AYNI tasarım kararı, yeni
  shader'a taşındı.
- Orb'un sabit `baseColor1`/`baseColor2` paleti kaldırıldı, yerine
  `--color-accent`/`--color-accent-glow` tema tokenları (`uAccent`/`uGlow`,
  `matchMedia('prefers-color-scheme: dark')` ile açık/koyu tema senkron) —
  **CLAUDE.md'nin "Palet tokenlardan" kuralı** için gerekliydi, ilk taslakta
  atlanmıştı, review'da yakalandı ve düzeltildi.
- `prefers-reduced-motion`: `settleScene()` + TEK kare çiz, hiç abone olma
  (V8 `Driver`'daki aynı desen).
- Mobilde (`complexity<1`) devicePixelRatio tavanı 1.5 (masaüstü 2).

### ADIM 4 — Eski sistem kaldırıldı

`three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`
`apps/web/package.json`'dan çıkarıldı (repoda başka hiçbir yerde
kullanılmıyorlardı — `grep` ile doğrulandı, yalnızca `lib/security/csp.ts`
içinde eski bir yorum referans veriyordu, o da `ogl`'ye göre güncellendi:
ham WebGL API kullanıyor, `new Function`/eval gerektirmiyor). `ogl@1.0.11`
eklendi. İki paralel sahne yok — `SiteBackdropScene.tsx` tek dosya, tek
implementasyon.

### ADIM 5-6 — Doğrulama ve görsel iterasyon

**Bu ortamda gerçek rAF'ın çalışmadığı netleşti** (V8'in "headless" notundan
daha kesin): `document.hidden` otomasyon tarayıcısında `hasFocus()===true`
iken bile `true` — ve bu özelliği JS'ten override edip `visibilitychange`
tetiklemek de işe yaramadı (`requestAnimationFrame` sayacı 0 kaldı) —
Chrome'un gerçek rAF zamanlamasının, sayfanın JS'ten okuduğu
`document.hidden`'dan BAĞIMSIZ, kompozitör seviyesinde perde-arkası/
görünmez sekmeleri kıstığı sonucuna varıldı. V8'in "shader kaynağını
gerçek canvas'a doğrudan derleyip enjekte etme" numarası burada da
uygulandı — ama bu kez paketlenmiş bir bileşenin kendi render mantığını
izole edip ham WebGL2 ile canlı sayfa üstüne bindirerek.

Bu probe sayesinde **gerçek bir bulgu** çıktı: Orb'un varsayılanı (referans
alınan orijinal shader, `innerRadius=0.6`) referans gibi dolu bir küre değil,
**içi boş, ince bir HALKA** çiziyor — ve `innerRadius`'u 0.6'dan 0.95'e kadar
değiştirmek görünüşü neredeyse hiç etkilemiyor (üç değer yan yana
karşılaştırıldı, farksız); boşluk `v2`/`v3` maskeleme teriminden geliyor,
tek bir sabitle düzelmiyor. Orb'un ışık/gürültü matematiğini yeniden
yazmadan (bu tam olarak V9'un kaçınmak istediği şey), TEK ek terim olarak
yumuşak bir gaussian çekirdek parıltısı eklendi (`core = exp(-len²·2.5)`,
`darkCol += colBase·core·0.9`) — dolu, merkezden kenara gradyanlı, referansa
çok daha yakın bir "backlit küre" hissi elde edildi (probe ile üç yoğunluk
denendi, 2.5 seçildi). Renk tokenlarının (`--color-accent`/`-glow`) doğru
okunduğu ve gerçek ölçekte (hero derinliğinde) doğru boyut/konumda çizildiği
de aynı probe yöntemiyle doğrulandı.

**Doğrulanamayan:** gerçek tarayıcıda scroll sırasında canlı rAF/`SceneRegion`
tetiklemesinin (yalnızca kod incelemesiyle doğru görünen, ama pixel'e
dökülmüş hâli görülemeyen) sorunsuz çalışması, ve mobil (390px) görünüm —
bu ortamda pencere/viewport yeniden boyutlandırma denendi ama tarayıcı
penceresi gerçek genişliği değiştirmedi (`resize_window` çağrıldı, `window.
innerWidth` 1536 olarak kaldı). Değişiklik yalnızca dekoratif, `position:
absolute` arka plan canvas'ına dokunuyor — sayfa akışını/`scrollWidth`'i
etkilemiyor, mobil regresyon riski düşük değerlendirildi ama **kullanıcı/CI
tarayıcı QA'sında doğrulanmalı** (`docs/QA-KONTROL-LISTESI.md` güncellendi).

### Doğrulama

`apps/web`: `pnpm typecheck` + `pnpm lint` (biome) + `pnpm build` — hepsi
yeşil. Ana sayfa ilk yük JS **181 kB** (değişmedi — backdrop zaten dinamik
import, ilk yüke girmiyor). Dinamik backdrop chunk'ı artık **8.3 kB ham /
~3.4 kB gzip** (`ogl` dahil) — önceki three/@react-three/fiber/drei
yığınından belirgin küçük (tam öncesi-sonrası bayt karşılaştırması yok,
dosya bu koşuda tamamen değiştirildiği için, ama `ogl`'nin tek başına npm
paket boyutu three'nin küçük bir kesri). `packages/tax-engine`: typecheck +
65/65 test yeşil, dokunulmadı. `packages/config`: typecheck yeşil. (Kök
`pnpm typecheck/test/build` bu makinede bilinen `turbo.exe` Windows Uygulama
Denetimi ilkesi engeli yüzünden çalışmıyor — paket başına doğrudan koşuldu,
önceki turlarda olduğu gibi.)

### Git

`v9-hazir-bilesen` dalında commit edildi, `v2`'ye merge edilip
`origin/v2`'ye push edildi.

---

## 0-U. V8 BACKDROP — 2026-09-19 (`v8-backdrop`, `v2`'den)

Görev: `docs/V8-BACKDROP-FINAL.md`'deki otonom prompt — kalıcı arka plan
sahnesini (`components/backdrop/SiteBackdropScene.tsx`) referans siteye
(futureoffinance.peachweb.io) görsel olarak yakınlaştırmak. **Kapsam: yalnızca
bu dosya.** tax-engine/API/DB/vergi oranları/Vergi Yükü Panosu dokunulmadı.

### ADIM 0 — Gözlem (claude-in-chrome, gerçek tarayıcı)

Referans site incelendi: tek `<canvas>` (WebGL2, `pwb-scene` konteyneri —
muhtemelen site builder'ın hazır arka plan bileşeni), **TEK büyük, net
kenarlı bir küre** — matbir gövde + belirgin bir "sırt/kenar ışığı" (fresnel
tarzı, sanki arkadan aydınlatılmış), sayfanın üst-sağında konumlanıyor,
scroll'da büyüyüp küçülerek ve konum değiştirerek kamera hareketi hissi
veriyor. (Sol tarafta görülen "pileli/yelpaze" desen de aynı tek WebGL
sahnenin parçası — muhtemelen kürenin kendi yüzey dokusu/ikinci bir
geometri; ADIM 2'nin "tek, karmaşık desensiz odak" kısıtı gereği bu ayrı
desen KOPYALANMADI, yalnızca kürenin ışıklandırma kalitesi hedef alındı.)

Kendi sitede (yerel `pnpm dev`, `localhost:3010`) aynı tur: **kod incelemesi
+ ADIM 1'deki bulgu nedeniyle piksel doğrulaması `document.hidden` engeliyle
sınırlı** (aşağıya bakın) — bulgular canlı gözlemden değil kod okumasından ve
"ham WebGL probe" tekniğinden (ADIM 5) geldi. Önceki sahne (V7): kürenin
kendisi düz bir gaussian leke (`exp(-dist²)`) + kürenin 2 katı yarıçapta
AYRIK, dekoratif ince bir halka — hacim/aydınlatma hissi yok, sınırsız
yumuşak bulanıklık (net bir siluet değil). Referanstaki "gerçek, aydınlatılmış
tek nesne" hissinden uzak.

### ADIM 1 — Mimari teşhis: gerçek bir render engeli bulundu

Sahne DOM'a doğru mount oluyor, canvas doğru boyutlanıyor, z-index/opaklık
doğru (`fixed inset-0 -z-10` sarmalayıcı, `pointer-events:none`). **Ama**
`gl.drawArrays`/`gl.clear` çağrılarını izleyen bir monkey-patch ile ölçüldü:
sayfa birkaç saniye açık kalsa bile **sıfır** çizim çağrısı. Kök neden:
`document.hidden === true` — claude-in-chrome'un yönettiği sekme, `hasFocus()`
`true` olsa bile Page Visibility API'sine göre "gizli" raporlanıyor (otomasyon
ortamının penceresi OS'ta öne alınmamış/occluded olabilir). `lib/motion/raf.ts`
TASARIM GEREĞİ `document.hidden` iken rAF döngüsünü başlatmıyor (performans
kuralı — CLAUDE.md/ADIM 4 "sekme arka plandayken render dur" ile birebir
uyumlu, bu BİR HATA DEĞİL). Sonuç: otomatik/başsız (headless benzeri)
tarayıcı oturumlarında sahne asla render edilmiyor — V7 notundaki "ortam
sınırlaması" varsayımı doğrulandı, ama kökü ilk kez netleşti (yalnızca
headless değil, spesifik olarak `document.hidden` bayrağı). **Kod mimarisi
sağlam, düzeltme gerekmedi** — bu adım sadece teşhis.

### ADIM 2 — Shader yeniden çizildi

`SiteBackdropScene.tsx` FRAG shader'ı: ekran-uzayı disk artık gerçek bir
kürenin izdüşümü gibi ele alınıyor — `r2 = |p|²` üzerinden bir yükseklik
(`z = sqrt(1-r2)`) ve yüzey normali türetiliyor, TEK sabit ışık yönüyle
(sırttan/yukarıdan) fresnel kenar aydınlatması (`pow(1-z, 2.2)`) + hafif
yönlü gölgeleme (`dot(normal, lightDir)`) + iç yumuşak parıltı hesaplanıyor.
Kürenin kenarı `smoothstep` ile net/anti-alias'lı bir siluet (`mask`) —
sınırsız bulanıklık değil. Diskin dışına `halo` ile yumuşak, düşük yoğunluklu
bir ambiyans sızıntısı eklendi (sert kesim hissi olmasın). **Ayrık halka deseni
tamamen kaldırıldı** (referansta yoktu — ilk üst-sağ ekran görüntüsünde "halka"
sanılan şey aslında ikinci, çok daha büyük bir kürenin/gezegenin kenarıydı).
`tone`/`density`/`depth`/`flow` uniformlarının anlamı ve `backdrop-scene.ts`
sönümlü lerp/bölüm-ağırlık mimarisi **değişmedi** — yalnızca bu 4 parametreden
kürenin GÖRÜNÜMÜNÜN türetilme biçimi değişti. Bölüm hedef parametreleri
(`Hero`/`SolutionsSection`/`PinnedCapabilities`/`StatsRow`/`ClosingCta`
içindeki `<SceneRegion>` çağrıları) **dokunulmadı** — V7'de zaten dar bir
bantta (density 0.56-0.78) kayıtlıydı, referansın "tek/sakin" isteğiyle
çelişmiyor. `uComplexity` düşükken (mobil, bkz. not) yüzey parıltı animasyonu
kapanıyor.

### ADIM 5 — Görsel doğrulama (ham WebGL probe yöntemi)

`document.hidden` engeli normal R3F render döngüsünü otomasyon ortamında
imkânsız kıldığından, şu yöntemle doğrulandı: **aynı FRAG shader kaynağı**
ham bir WebGL2 programına derlenip, GERÇEK arka plan `<canvas>`'ının (doğru
z-index/opaklık/DOM konumunda, gerçek sayfa içeriğinin ARKASINDA) içine
`gl.drawArrays` ile doğrudan çizildi — `advance()`/rAF'ı atlayarak ama gerçek
DOM bileşimini kullanarak. Üç bölüm hedefiyle test edildi:

- **Hero (depth=0.1, density=0.78, tone=0.12):** büyük, net kenarlı, parlak
  fresnel'li küre; `.text-scrim` başlığın arkasında hâlâ tam kontrastlı
  çalışıyor (V5'ten korunan mekanizma, dokunulmadı) — ekran görüntüsüyle
  doğrulandı.
- **Orta (depth=0.5, density=0.7, tone=0.55):** küre yukarı/küçük kayıyor,
  ton ısınıyor — sönümlü geçiş beklendiği gibi yumuşak.
- **ClosingCta (depth=0.9, density=0.78, tone=0.9):** küre üst kenara
  yakın, çok küçük/soluk ama **tamamen kaybolmuyor** — iz sürekliliği
  (`presence` alt sınırı) korunmuş.

Bu üç nokta arası geçiş `mix()` fonksiyonlarıyla matematiksel olarak sürekli
olduğundan aradaki `SceneRegion` hedefleri (SolutionsSection depth=0.36,
PinnedCapabilities depth=0.62, StatsRow depth=0.72) ayrıca tek tek
render edilmedi — güvenle enterpole olduğu kabul edildi.

**Bu yöntem gerçek R3F/rAF entegrasyonunu doğrulamaz** (yalnızca shader
matematiğini ve gerçek DOM bileşimini doğrular) — kullanıcının normal,
odaklı bir tarayıcı sekmesinde gerçek scroll ile doğrulaması hâlâ gerekiyor
(`docs/QA-KONTROL-LISTESI.md` "Orb sahnesi" maddesi).

### Doğrulama

`apps/web`: `pnpm typecheck` ve `pnpm build` yeşil (ana sayfa ilk yük JS
**181 kB**, değişmedi — yalnızca metin, bayt eklemedi). `packages/tax-engine`:
`pnpm typecheck` + `pnpm test` — 65/65 yeşil, dokunulmadı.
`packages/config`: `pnpm typecheck` yeşil. (Not: kök `pnpm typecheck/test/build`
bu makinede Windows Uygulama Denetimi ilkesi `turbo.exe`'yi engellediği için
çalışmıyor — paket başına doğrudan çalıştırıldı, kod/kurulum sorunu değil.)
Konsolda tek hata: önceden var olan, bu değişiklikle ilgisiz bir dev-only CSP
nonce hydration uyarısı (kapsam dışı, dokunulmadı).

### Sonraki adım — kullanıcı tarayıcı QA'sında doğrulanacak

`docs/QA-KONTROL-LISTESI.md` güncellendi: "Orb sahnesi" maddesi artık net
kenarlı/aydınlatılmış tek küre + kenar ışığı bekliyor (önceki "dağınık
bulut yerine tek küre" ifadesinden daha spesifik).

---

## 0-V. V7 ORB — 2026-09-19 (`v7-orb`, `v2`'den)

Kalıcı site-geneli arka plan sahnesini (`components/backdrop/SiteBackdropScene.tsx`,
V5 Bölüm 2'de kurulan R3F/WebGL katman) referans hisse (futureoffinance.peachweb.io)
göre sadeleştirme: çok-oktavlı domain-warp fbm bulut alanı yerine **tek odaklı
küre + ince halka**. Yeni sistem kurulmadı — aynı `backdrop-scene.ts` sönümlü
lerp/bölüm-ağırlık mimarisi (tone/density/depth/flow) korundu; yalnızca fragment
shader'ın kürenin konum/boyut/opaklığını bu AYNI parametrelerden türetme biçimi
değişti. **Kapsam: yalnızca `SiteBackdropScene.tsx`.** tax-engine/API/DB/vergi
oranları/testler dokunulmadı (ayrı bir kritik hata — Vergi Yükü Panosu — bu koşudan
ÖNCE incelendi, bulgu: mevcut kodda üretilemedi, bkz. commit mesajı).

### Ne değişti

- Çekirdek ışıma: `exp(-dist²)` tabanlı tek yumuşak glow (+ isteğe bağlı sıcak iç
  çekirdek) — çok parçacıklı/çok oktavlı gürültü alanı kaldırıldı.
- İnce halka: küre yarıçapının ~2×'i mesafede, hash tabanlı hafif organik
  dalgalanmalı (katı CAD çemberi değil), düşük opaklık.
- **Konum/boyut/opaklık `depth` parametresinden türüyor** — bu parametre zaten
  hero'da düşük (yakın/parlak) kapanışta yüksek (uzak/soluk) kayıtlıydı
  (`Hero` depth=0.1 → `ClosingCta` depth=0.9); V7 öncesinde bu yalnızca renk/
  yoğunluk etkiliyordu, şimdi doğrudan kürenin sahne içindeki "mesafesi".
  Kapanışta bile opaklık tabanı SIFIRA inmez (`coreAlpha` alt sınırı ~0.16-0.18)
  — iz sürekliliği korunur.
- `uOctaves`/`uProgress` uniformları kaldırıldı (kullanılmıyordu); `uComplexity`
  eklendi — mobilde (`complexity<1`) sıcak iç çekirdek ve ikinci halka kapanır.
- Bölüm hedef parametreleri (`Hero`/`SolutionsSection`/`PinnedCapabilities`/
  `StatsRow`/`ClosingCta` içindeki `<SceneRegion>` çağrıları) **değiştirilmedi**
  — zaten dar bir bant içindeydi (density 0.56-0.78), referansın "sakin/tek
  odaklı" isteğiyle çelişmiyor.
- Lenis `lerp: 0.1` zaten istenen aralıktaydı (0.08-0.1) — dokunulmadı.
- Metin/küre z-sıralaması mimari olarak zaten garanti: sahne `fixed inset-0
  -z-10`, sayfa içeriği `relative z-10` — bu koşuda DOM sırası değişmedi.

### Doğrulama

- `pnpm typecheck · lint` (`@futuristax/web`) — yeşil. `pnpm --filter
  @futuristax/tax-engine test` — 65/65 yeşil, dokunulmadı. `pnpm build` — yeşil,
  ana sayfa ilk yük JS **181 kB** (< 220 kB bütçesi, değişmedi — shader yalnızca
  metin, bayt eklemedi).
- `pnpm start` gerçek üretim sunucusunda çalıştırıldı, SSR HTML ve statik
  yerleşim (hero, kartlar, header) doğrulandı.
- **WebGL küre görsel doğrulaması bu ortamda YAPILAMADI:** hem Chrome-uzantısı
  hem Playwright ile denendi; canvas doğru boyutlanıyor, WebGL bağlamı geçerli,
  konsol/sayfa hatası yok — ama piksel taraması (`readPixels`, tüm tuval)
  **her iki şeklide de** (V7 küresi VE değiştirilmeden önceki V6 bulut shader'ı)
  boyanmış tek bir piksel bulamadı. Yani bu, V7'nin bir regresyonu değil —
  ortamın (headless/otomatize Chromium, `frameloop="never"` + paylaşımlı rAF
  mimarisiyle) önceden de var olan bir sınırlaması; V6 notunda da "tarayıcı/
  `pnpm start` YOK" olarak işaretlenmişti. **Kullanıcı/CI tarayıcı QA'sında
  gerçek görsel doğrulama gerekiyor** (aşağıdaki liste).

### Kapsam dışı (sonraki adım)

- Bölüm hedef parametrelerinin (tone/density/depth/flow) ince ayarı — yalnızca
  kullanıcı/CI görsel geri bildirimden sonra.
- Palet / tipografi değişimi (istenmedi).

### Sonraki adım — kullanıcı/CI tarayıcı QA'sında doğrulanacak

- Hero'da küre net ve tek odaklı mı (dağınık/çok parçacıklı değil).
- Scroll'da küçülme + soluklaşma yumuşak mı, sıçrama var mı; kapanışta iz hâlâ
  görünür mü (tamamen kaybolmamalı).
- Metin her noktada okunabilir mi (`text-scrim` kontrastı korunmuş mu).
- Lighthouse perf ≥ 85, LCP ≤ 2.5s; konsolda WebGL/GLSL derleme hatası yok.
- `v7-orb` → `v2` merge kararı kullanıcı onayından sonra. `main`'e ERKEN GEÇME.

---

## 0-W. ANA SAYFA — BÖLÜM AYRAÇ ÇİZGİLERİ KALDIRILDI — 2026-09-08 (`v2`)

Kullanıcı geri bildirimi: ana sayfayı kaydırırken bölüm altlarında "beyaz
çizgiler" görünüyor. Koyu zeminde açık bir hairline olarak okunan iki sert
1px ayraç kaldırıldı:

- `styles/depth.css` — `.section-beam::after` (1px `--gradient-hairline`) silindi;
  kullanılmayan `--gradient-hairline` token'ı da. `.section-beam::before`
  (blur'lu yumuşak ışık huzmesi) KALDI — "bölüm geçişlerinde yumuşak ışık
  huzmesi" tasarım yönü korunuyor.
- `components/home/SceneSection.tsx` — alt `<hr className="scene-divider">` ve
  artık gereksiz `divider` prop'u kaldırıldı. `.scene-divider` sınıfı
  `art.css`'te kalıyor: iç sayfalarda `PageHero` hâlâ kullanıyor (kapsam dışı).

`pnpm typecheck · lint · build` — yeşil.

---

## 0-X. V6 REFERANS CİLASI — 2026-09-08 (`v6-referans`, `v2`'den)

Ana sayfayı `futureoffinance.peachweb.io`'nun hissine yaklaştırma: **bento
düzen + hareket yoğunluğu + premium yüzey**. Bölüm sırası/akışı zaten sadıktı
(V4-AKIS); bu koşu düzen ve cila. **Kapsam: yalnızca ana sayfa + paylaşılan
header.** Palet ve tipografi (Syne) DEĞİŞMEDİ (kullanıcı onayı). Altyapı
(tax-engine/API/DB/form) dokunulmadı.

`352b3cd` (1) · `26bf963` (2) · `575909e` (3).

**Bu ortamda tarayıcı/`pnpm start` YOK** — bento span'leri, marquee
pürüzsüzlüğü, header scroll durumu, hareketli zemin üzerinde kontrast
kullanıcı/CI tarayıcı QA'sında doğrulanmalı.

### Bölümler

| # | Bölüm | Not |
|---|---|---|
| 1 | Bento düzen | Yeni `components/home/Bento.tsx` (`Bento` + `BentoTile`: span→grid öğesi, `card`+`surface-glow` kabuk, `href`→Link, `as`). **ServicesQuad** `lg:grid-cols-3 lg:grid-rows-3` — Vergi danışmanlığı 2×3 kahraman + 02–04 yığın (`.text-aurora` numaralar). **FeatureTriad** `lg:grid-cols-[1.5fr_1fr]` — kahraman + yığın. **TestimonialTriad** ilk görüş 2×2 geniş alıntı. **EngagementModels** featured kutu aurora şeridi + `lg:-mt-4`. **StatsRow** tek `card surface-glow` pano + hairline ızgara, kuruluş yılı vurgulu. `SceneSection` `wide` prop (72→80rem), `section-beam` + başlık `text-scrim`. Hero/Solutions kapsayıcı genişletildi. |
| 2 | Hareket + akış | Yeni `components/home/PhraseMarquee.tsx` — Hero'dan sonra sonsuz kelime bandı (serviceGroups+featureTriad başlıkları, `aria-hidden`, `.marquee` yeniden kullanılır). LogoMarquee çift sıra (alt sıra `.marquee-reverse .marquee-slow`). `lib/motion/config.ts` reveal 24→32px, stagger 70→80ms (easing/yön/süre ölçeği AYNI). `SiteBackdropScene` shader alfa tavanı 0.55→0.62; SceneRegion density/flow hedefleri yükseltildi. |
| 3 | Premium yüzey + header | SiteHeader `scrolled` durumu (rAF throttle passive dinleyici) → `.is-scrolled` cam/gölge/alt-kenar güçlenir, py 4→2.5, logo küçülür (depth.css, reduced-motion'da geçiş yok). `.section-beam--strong` (hero + kapanış — geniş/parlak huzme). Header kapsayıcı 6xl→7xl. |

### Doğrulama

- `pnpm typecheck · lint · test` (65) `· build` — yeşil. `playwright --list`
  temiz (92 test / 7 dosya).
- **Ana sayfa ilk yük JS 181 kB** (< 220). Yeni kod saf bileşen/CSS;
  three/gsap ilk yükte değil.
- **CI/kullanıcı tarayıcı QA (raporlanacak):** bento 390/768/1024/1440/1920 —
  taşma yok, kahraman span'ler doğru, `<lg` yığın; iki marquee pürüzsüz +
  reduced-motion'da durur ama dolu; header scroll'da sıkışır (reduced-motion
  sıçramasız); metin kontrastı hareketli zemin + alfa 0.62 üzerinde AA
  (axe motion açık + reduced-motion); Türkçe karakterler bento + kelime
  bandında düşmüyor; Lighthouse perf ≥ 85 / LCP ≤ 2.5s.

### Kapsam dışı (sonraki adım)

- İç sayfaların aynı bento diline taşınması (hizmetler/sektörler/kurumsal/
  araçlar/mevzuat/sss/iletişim).
- Palet / tipografi değişimi (istenmedi).

### Sonraki adım

- Kullanıcı/CI tarayıcı QA → `v6-referans` → `v2` merge. `main`'e ERKEN GEÇME.

---

## 0-Y. V5-HERO KOŞUSU — 2026-09-08 (`v5-hero`, `v2`'den)

Hero düzeltmeleri + scroll hareketi + tipografi (bkz. `docs/V5-HERO-PROMPT.md`).
Altyapı (tax-engine / API / DB / form / dağıtım) DEĞİŞMEDİ. Her bölüm ayrı commit,
sonunda `pnpm typecheck · lint · test · build` YEŞİL.

`9e0c1e6` (1) · `854baac` (2) · `e2474c7` (3).

**Bu ortamda TARAYICI/`pnpm start` YOK** — her bölümün "AÇ VE GÖZLE DOĞRULA"
adımı (5 genişlikte kart çakışması, canlı görünüm, axe, Lighthouse) kullanıcı
veya CI'da yapılmalı. Kod tarafı doğrulaması tam.

### Ön iş

- Dış klasördeki `…/FUTURISTAX/CLAUDE.md` (V4 öncesi, çelişkili kopya) SİLİNDİ;
  yalnızca iç çalışma kopyasındaki (`…/FUTURISTAX/FUTURISTAX/CLAUDE.md`) kaldı.
- Çalışma kopyası `v2`'nin tepesindeydi (`v2-tasarim` değil); `v5-hero` `v2`'den
  açıldı.

### Bölümler

| # | Bölüm | Not |
|---|---|---|
| 1 | Hero görünen hatalar | **Kart çakışması:** yüzen kartlar başlık sütununun (`max-w-3xl`) DIŞINDA — `xl`+ (1280px) sol/sağ raylarda (`left/right:0`, kapsayıcı 76rem, kart 12rem), negatif offset yok; `<xl` CTA altında ızgara. **Başlık kırpılması:** sabit `--text-6xl` → akışkan `--text-hero` clamp; `hyphens:auto`; `SplitHeading by="words"` artık yalnız `words` böler (`lines` → `overflow:hidden` satır div'i genişliği donduruyordu = soldan kırpma). **Siyah blok:** HeroScene vinyet tabanı 0.32→0.62 + canvas clear color `--color-canvas`. |
| 2 | Scroll'a bağlı hareket | **Kalıcı site-geneli arka plan:** `components/backdrop/` (SiteBackdrop karar · SiteBackdropScene R3F shader `dynamic ssr:false` · SiteBackdropFallback statik · SceneRegion bölüm kaydı). `[locale]/layout.tsx`'te bir kez, `fixed -z-10`, rota değişiminde remount yok. `lib/motion/raf.ts` TEK paylaşımlı rAF (sekme gizliyken durur). `lib/motion/backdrop-scene.ts` Lenis ilerlemesi (0..1) + bölüm tone/density/depth/flow hedefleri, kare-hızından bağımsız sönümlü lerp. Hero'nun kendi WebGL canvas'ı (`hero/`) KALDIRILDI. **Kartlar:** imleç-parallax + CSS drift → GSAP ScrollTrigger scrub (derinliğe göre hız, döner/ölçeklenir, dağılarak solar; xl+ & motion açık). **Bölüm içi:** SolutionsSection `Parallax`+`ScrollZoom`. **Okunabilirlik:** `.text-scrim` (efektif zemin `--color-canvas`) hero+kapanışta; sahne alfası ≤0.55. **Perf:** DPR≤2 (mobil 1.5), mobil fbm 4→2 oktav, three ilk yükte değil. **Yedek:** reduced-motion/WebGL yok/düşük perf (`hardwareConcurrency≤4 \|\| deviceMemory≤4`) → statik. |
| 3 | Tipografi | **Display: Space Grotesk → Syne** (değişken 400–800, ağırlık 600, `clamp(2.75rem,7vw,6rem)` hero, satır aralığı 1.05/hero 0.95). Gövde Familjen Grotesk + Mono IBM Plex Mono DEĞİŞMEDİ. Türkçe glif: Syne CSS2 `unicode-range` incelendi — 12 glif tam (`latin`: ı ç Ç ö Ö ü Ü · `latin-ext` U+0100–02BA: İ Ğ ğ Ş ş). Brief'in 7rem tavanı 6rem'e çekildi (Syne geniş; `max-w-3xl` sütunda 7rem 4+ satıra sarardı). `next/font` `['latin','latin-ext']` isteği = derleme-zamanı glif kontrolü. |

### Bundle + doğrulama

- **Ana sayfa ilk yük JS 177 → 181 kB** (< 220 hedefi). three/R3F/gsap ilk yükte
  DEĞİL (backdrop sahnesi `dynamic ssr:false`).
- `pnpm typecheck · lint · test` (tax-engine 65) `· build` — hepsi yeşil.
- `playwright --list` temiz (92 test / 7 dosya).
- **CI'da doğrulanacak:** hero 5 genişlikte kart-başlık çakışması yok · scroll'da
  backdrop + kartlar hareket · `.text-scrim` altında kontrast (axe motion açık +
  reduced-motion) · reduced-motion'da backdrop donuk + parallax kapalı · Türkçe
  karakterler Syne'de + split-type sonrası düşmüyor · Lighthouse perf/LCP.

### Sonraki adım

- Kullanıcı/CI tarayıcı QA → `v5-hero` → `v2` merge.
- `main`'e ERKEN GEÇME.

---

## 0-Z. V4-AKIS KOŞUSU — 2026-09-07 (`v4-akis`, `v2`'den)

Ana sayfa **referans siteye** (futureoffinance.peachweb.io) sadık yeniden
inşa (bkz. `docs/V4-AKIS-PROMPT.md`). Altyapı (tax-engine / API / DB / form /
dağıtım) DEĞİŞMEDİ. 6 bölüm, her biri ayrı commit, her bölüm sonunda
`pnpm typecheck · lint · test · build` YEŞİL.

`babee19` (1) · `21c8077` (2) · `4fcf842` (3) · `2d44cb2` (4) · `3b0da41` (5) ·
`993a1d7` (6). **Koşu tamamlandı.**

### İçerik politikası (bu koşuya özel)

`CONTENT_IS_PLACEHOLDER = true` (`packages/config/src/site.ts`). Yer tutucu
metin `src/lib/data/placeholder/` altında ("YER TUTUCU — firma tarafından
değiştirilecek" başlıklı). **Tam liste + firma görevleri:
`docs/YER-TUTUCU-ICERIK.md`.** Üç istisna (yer tutucu bile olamaz): sahte
resmî içerik, gerçek şirket logosu, uydurma kişi/şirket adı — hiçbiri yok.
Vergi oranlarına dokunulmadı, `UnverifiedRatesNotice` kaldırılmadı.

### Bölümler

| # | Bölüm | Not |
|---|---|---|
| 1 | Hareket ritmi altyapısı | `lib/motion/config.ts` + `tokens.css`: TEK easing `ease.out` = expo.out `cubic-bezier(0.16,1,0.3,1)`; süre ölçeği üç değer (fast 200 / base 600 / scene 1200ms + count 1600); `distance.revealShift = 24` (tek yön); stagger 70ms. `scaleIn` kaldırıldı. `scrollConfig.ease` → `expo.out`. Lenis `lerp: 0.1`. |
| 2 | Ana sayfa referans sırasıyla | `components/home/` 10 bölüm: Hero (split-type KELİME + dört yüzen kart, GERÇEK veri: yükümlülük / TCMB USD-TRY / vergi yükü / yoğunluk) · SolutionsSection (canlı TaxBurdenPanel) · LogoMarquee (soyut BrandMarks) · FeatureTriad · **PinnedCapabilities** (GSAP pin, 01/02/03, crossfade; fallback = alt alta; `inert` ile klavye tuzağı yok) · ServicesQuad (9→4) · StatsRow (2013/9/7/9 gerçek) · TestimonialTriad (yer tutucu) · EngagementModels (fiyat yok) · ClosingCta. Footer + `ScrollPercent` layout'ta. `SplitHeading` `by="words"` + `id`. |
| 3 | Mevzuat ayrı sekmede | Ana sayfada mevzuat/haber bölümü YOK. `/mevzuat` hub'ında `CONTENT_IS_PLACEHOLDER` açıkken "editoryal taslak" bilgi bandı. 5 yazı `draft`, genel başlık; besleme kapalı (yedek uydurma yok). |
| 4 | Mikro etkileşimler | `--ease-out`/`--dur-fast`/`--dur-base` CSS değişkenleri; `.btn` / `.card` geçişleri bunlara bağlandı. `.btn-arrow` (hover'da kayar) hero+solutions+engagement+closing+RequestCta. `.link-underline` (soldan sağa) header/footer/breadcrumbs/mevzuat/iletişim. `.card-interactive` `:focus-within` de tetikler, -3px. RequestCta CTA'sı MagneticButton içinde. |
| 5 | Sayfa geçişleri | `RouteTransition` yeniden: perde yukarı çekilir (yeni sayfa alttan), üstünde başlık kısa görünür. ≤400ms (perde 320ms, `ease.inOut`). İlk sert yükte yok; reduced-motion'da hiç render yok. VT API yorumu bırakıldı. |
| 6 | İç sayfalar aynı ritme | hizmetler/sektörler hub listeleri `card card-interactive surface-glow` kartlara geçti; RelatedContent aynı dil; `.link-underline` metin bağlantılarına. Hesaplayıcı çalışma alanı yapısına dokunulmadı. |

### Bundle + doğrulama

- **Ana sayfa ilk yük JS 177 kB** (< 220 hedefi). three/recharts/gsap hâlâ
  ilk yükte değil (V3 Bölüm 7 tembel yükleme korunuyor).
- `pnpm typecheck · lint · test` (tax-engine 65) `· build` — hepsi yeşil.
- **e2e bu ortamda KOŞULMADI** (tarayıcı + `pnpm start` yok). `playwright
  --list`: yeni `e2e/v4-home.spec.ts` (12 test) + mevcut suite parse temiz.
  CI'da doğrulanacak: hero (başlık/CTA/yüzen kartlar), pinlenmiş bölüm
  reduced-motion fallback + klavye tuzağı yok, logo şeridi + ScrollPercent
  a11y ağacı dışında, axe sıfır ihlal (motion açık + reduced-motion).
  `accessibility.spec.ts` `/` taraması yeni ana sayfayı kapsıyor.
- Lighthouse bu ortamda koşulmadı; CI'da.

### Sonraki adım (V4 koşusu dışında)

- `v4-akis` → `v2` merge (QA sonrası).
- Firma: `docs/YER-TUTUCU-ICERIK.md` görevleri → `CONTENT_IS_PLACEHOLDER = false`.
- `motion` bundle küçültme (`LazyMotion`) hâlâ açık (V3 Bölüm 7 notu).
- `main`'e ERKEN GEÇME.

---

## 0-A. V3 SUNUM KATMANI KOŞUSU — 2026-09-07 (`v2-fx`)

Yalnızca görünen katman yeniden inşa ediliyor (bkz. `docs/V3-SUNUM-PROMPT.md`);
`tax-engine`, API route'ları, DB, form, dağıtım DEĞİŞMİYOR. 8 bölüm, her biri
ayrı commit, her bölüm sonunda `pnpm typecheck · lint · test · build` yeşil.

`a7e644b` (1) · `359d56d` (2) · `9a1268b` (3) · `878a685` (4) · `ca28e7b` (5) ·
`ad20fde` (6) · `1be2ec7` (7) · `f03e77e` (8). **Koşu tamamlandı.**

**Sıradaki:** `v2-fx` → `v2` merge (QA sonrası), `docs/PROJECT-STATUS.md` §6
kontrol listesi. `main`'e ERKEN GEÇİLMEZ (§0 YAPMA listesi + bölüm 4 kararları).

### Biten

| # | Bölüm | Not |
|---|---|---|
| 1 | Sanat yönetimi + görsel altyapı | **Prosedürel** — bu ortam Unsplash/Pexels indiremiyor. `SceneBackdrop` (SVG: concrete / geometric-shadow / document-grid / light-field, palet tokenlı), `TreatedImage` (duotone + grain, gerçek foto gelince kullanılır), `LazyLottie` (dosya gelince). `public/images/CREDITS.md` + `public/lottie/README.md` sanat yönü kurallarını taşıyor. **Gerçek foto/Lottie firma/sonraki adım.** |
| 2 | WebGL hero | R3F **shader alanı** seçildi (sıvı gradyan + noise, palet tokenlı). `HeroCanvas` karar katmanı: yalnızca ≥768px + WebGL + reduced-motion yok → `HeroScene` (`dynamic ssr:false`); aksi `HeroFallback` (statik CSS gradyan + grain). visibilitychange'de render durur. |
| 3 | Scroll + geçiş | `SmoothScroll` (Lenis; reduced-motion'da HİÇ başlamaz), `ScrollProgress` (üst çubuk), `RouteTransition` (perde; ilk sert yükte YOK — LCP), `SplitHeading` (split-type + Türkçe glif kontrolü: düşen karakter varsa revert). `lib/motion/scroll.ts` merkezî. |
| 4 | Ana sayfa sinematik akış | 8 sahne: hero → güven bandı → vergi takvimi → hizmetler → süreç → araçlar → sektörler → kapanış. `components/home/`: `SceneSection` (eyebrow + SplitHeading + lead + seçici `SceneBackdrop`), `ProcessScene`+`TrustBand` (pin YOK), `ServicesRail` (native overflow-x + ince ScrollTrigger drift), `SectorsGrid`, `ToolsShowcase` (araç listesi + canlı `TaxBurdenPanel`). Hero tek CTA'ya indi; `TaxCalendarPanel` hero'dan çıkıp kendi sahnesine geçti. |
| 5 | Araçlar çalışma alanı | `ToolWorkspace` + `ToolSelector` — 9 hesaplayıcı tek yüzey. Seçici APG tabs (roving tabindex, ok/Home/End), dar ekranda yatay kaydırılır, tuzak yok. Her aracın kendi URL'i: `history.pushState` → `/araclar/[slug]`, `popstate` senkron; sunucu `[slug]` sayfası metadata + HowTo/FAQ JSON-LD taşımayı sürdürür. Araç değişince `AnimatePresence` geçiş (reduced-motion: anında). `LedgerChart` — **araca özel** görsel kırılım (her hesaplayıcı `segments`'ini kendi `result.detail`'inden kurar; saf SVG/div, recharts yok; tümüyle `aria-hidden`, veri = `ResultLedger` sr-only steps tablosu); kur-cevirici hariç 8 araç. `RollingNumber` — sonuç değişince yeniden sayan sayaç (ResultLedger başlığı). `ToolCalculator` kaldırıldı. |
| 6 | İç sayfalara ana sayfa dili | `components/content/PageHero` — paylaşılan sayfa giriş sahnesi (seçici `SceneBackdrop` + `basis-ref` eyebrow + `SplitHeading` + lead + `scene-divider`). hizmetler/sektorler (hub+[slug]), kurumsal, mevzuat (hub+[slug]), sss, kariyer, referanslar, iletisim, **araclar hub** — hepsi `PageHero`'ya geçti; eski `ledger-rule` başlık bloğu kaldırıldı, içerik `Reveal`'a alındı. İletişim sayfası yeniden kuruldu (güvence listesi + iletişim bilgileri | kenar parıltılı kart içinde form). metadata/JSON-LD korundu. |
| 7 | Performans | `lib/motion/gsap-lazy.ts` (loadGsap / loadSplitType — `import()` chunk) + `lib/motion/useNearViewport.ts` (IO hook). `SplitHeading`/`ServicesRail`/`SmoothScroll` statik `gsap`/`@gsap/react`/`lenis` importlarını bıraktı; hepsi IO (veya mount) + `import()` ile tembel. `lib/motion/scroll.ts` yalnızca yapılandırma (registerScroll + revealOnScroll kaldırıldı). Recharts mount'u `TaxBurdenPanel` + `YearComparisonPanel`'de `useNearViewport` arkasında. `@next/bundle-analyzer` + `pnpm --filter @futuristax/web analyze`. **Ana sayfa ilk yük JS 237 → 188 kB (< 220 hedefi).** |
| 8 | Erişilebilirlik | `e2e/tools-workspace.spec.ts` (16 test): araç seçici APG tabs klavye (ok dairesel/Home/End/roving tabindex/aria-selected/odak), araç URL derin link + geri/ileri (popstate), `LedgerChart` sr karşılığı (figure aria-hidden → a11y ağacında yok; veri = ResultLedger sr-only adım tablosu), komut paleti çalışma alanından klavye akışı. `accessibility.spec.ts` `settleReveals` → `networkidle` bekliyor (SplitHeading GSAP tembel). `design-a11y.spec.ts` grafik testleri `scrollIntoViewIfNeeded()` (Recharts IO-ertelemeli). |

### Bundle — en ağır üç modül (analyzer, parsed)

1. **three** ~725 KB (+ `@react-three/fiber` 147) — yalnızca `HeroScene` chunk'ında
   (`dynamic ssr:false`); ilk yükte DEĞİL. Mobil / WebGL yok / reduced-motion → hiç yüklenmez.
2. **recharts** ~322 KB (+ `victory-vendor` 46, `decimal.js-light` 13) — grafik
   chunk'larında; Bölüm 7'de `IntersectionObserver` ile ertelendi (panel görünüre yaklaşınca).
3. **gsap** ~112 KB (+ `split-type` 11) — kendi `import()` chunk'ında; ilk yükte DEĞİL.

Not: **`motion` (~144 KB) ilk yükte kalıyor** — `Reveal`/`Counter`/`RollingNumber`/
`AnimatePresence`/`MagneticButton` yaygın. En büyük eager modül; ayrı bir küçültme
adımı (ör. `LazyMotion` + `domAnimation`) açık.

### Sayfa ilk yük JS (Bölüm 8 sonrası build)

ana sayfa **188** · `/araclar` 183 · `/araclar/[slug]` 178 · iç sayfalar (`PageHero`)
~148 · `iletisim` 173 · `kariyer`/`mevzuat`/`referanslar` 107 · shared 103 kB.

### Doğrulama (Bölüm 8 sonrası)

`pnpm typecheck · lint · test` (tax-engine 65) `· build` — hepsi yeşil.
**e2e bu ortamda KOŞULMADI** (tarayıcı + `pnpm start` yok). CI'da koşacak:
`playwright --list` = **80 test / 6 dosya**, parse temiz. CI'da doğrulanacak:
- `tools-workspace.spec.ts` yeni 16 test (yukarıda).
- `accessibility.spec.ts` axe sweep 15 rota — yeni sahneler + `PageHero` dâhil.
- Lighthouse CI (`lighthouserc.json`): bu koşuda çalıştırılamadı; `ANALYZE`
  raporu elde ama Lighthouse skoru CI'da.
- `RouteTransition` / `SmoothScroll` / `RollingNumber` / `SplitHeading`
  reduced-motion no-op yolu birim testli değil (e2e reduced-motion projesi eklenebilir).

### Sonraki adım (V3 koşusu dışında)

- `v2-fx` → `v2` merge; `docs/PROJECT-STATUS.md` §6 geçiş kontrol listesi.
- Gerçek fotoğraf + Lottie dosyaları (Bölüm 1 prosedürel bıraktı) — firma/sonraki adım.
- `motion` bundle küçültme (`LazyMotion`).
- `main`'e ERKEN GEÇME — §0 YAPMA + bölüm 4 cevap bekleyen kararlar.

---

## 0. TASARIM YÖNÜ DEĞİŞİMİ KOŞUSU — 2026-09-07 (`v2-tasarim`)

Yön değişti: "mali belge estetiği, değiştirilmez" **iptal**. Yeni yön Cirform
(AI Finance) referanslı modern fintech — koyu taban, ışıklı aksan, derinlik,
akışkan hareket, veri görselleştirme. `CLAUDE.md → "Tasarım yönü"` baştan yazıldı.

**Çalışma kopyası:** İç içe `…/FUTURISTAX/FUTURISTAX/` (kullanıcı seçimi —
bağımlılıklar kuruluydu). Parent `…/FUTURISTAX/` bir kopya klon olarak
`untracked` duruyor; ikisi de aynı remote/dal. Dal `v2-tasarim`, `v2`'den çıktı.

**Her bölüm:** `pnpm typecheck` + `pnpm test` (65) + `pnpm build` YEŞİL, ayrı commit.
`cffe16c` (1) · `e817eba` (2) · `349888c` (3) · `e776564` (4) · `4c7c73e` (5) ·
`d5e7983` (6) · `2e8162f` (7).

### Tam biten

| # | Bölüm | Not |
|---|---|---|
| 1 | Tasarım yönü + tokenlar | CLAUDE.md yeniden yazıldı. tokens.css yeni palet (canvas #07090D, accent #4D7CFF, signal #FF6B4A, positive #3DDC97); WCAG kontrast oranları Node betiğiyle hesaplandı, yoruma yazıldı — gövde metni her yüzeyde ≥ 4.5:1. Geriye dönük ad aliasları korundu. Açık tema korundu (azur #2C5BE0). |
| 2 | Görsel dil | `depth.css`: `.glass` (yalnızca sticky header), `body::before` gren dokusu (SVG feTurbulence, açık temada kapalı), ışık kaynağı gradyanları (menekşe yalnızca burada), `.surface-glow`, `.section-beam`, `.btn/.btn-primary/.btn-ghost` (8 kopya dizenin yerine, azur zemin + beyaz 5.15:1), `.card`. |
| 3 | Tipografi | **Display: Space Grotesk**, **Gövde: Familjen Grotesk** (ikisi de değişken), **Mono: IBM Plex Mono**. Türkçe glif doğrulaması: `curl` ile Google Fonts CSS `unicode-range` incelendi — 12 gerekli glif `latin`+`latin-ext` içinde; `next/font` alt küme yoksa build'i kırar. `--font-*-loaded` → tokens zinciri bağlandı (önceden bağlı değildi, site fallback fontla render oluyordu). |
| 4 | Hareket sistemi | `src/lib/motion/` (config + variants tek yerde). `Reveal*`, `Parallax`, `ScrollZoom`, `Counter` (tabular-nums korunur, layout kaymaz, sr aria-label), `MagneticButton` (reduced-motion + dokunmatik'te düz), `Skeleton`, `[locale]/template.tsx` sayfa geçişi (ilk yüklemede kapalı — LCP). Hepsinde `prefers-reduced-motion` guard. |

### Kısmen biten — alt öğeler eksik

| # | Yapıldı | YAPILMADI |
|---|---|---|
| 5 | Ana sayfa **Vergi Yükü Panosu** (Recharts, tema tokenlı renk, sr-only tablo eşleniği, tembel chart, UnverifiedRatesNotice). `lib/charts/burden.ts` saf toplama — yeni vergi mantığı yok. | 5.2 hesaplayıcı sonuçlarına dağılım grafiği (ResultLedger yanı) · 5.3 Vergi Takvimi zaman çizelgesi görünümü. Altyapı (`useChartColors`, tembel chart deseni) hazır. |
| 6 | **Yıl karşılaştırma** (`/araclar`): 2024/2025/2026 yan yana, Fark + % değişim, doğrulanmamış her yıl için UnverifiedRatesNotice, gruplu bar + sr tablo. | 6.2 senaryo karşılaştırma + URL serileştirme · 6.3 `/hizmetler` hizmet karşılaştırma matrisi. |
| 7 | **Komut paleti** (Cmd/Ctrl+K): native `<dialog>` (odak tuzağı/Esc), fuse.js, `normalizeTr` Türkçe normalizasyon ("sirket"→"şirket", birim testli), combobox/listbox ARIA, klavye tam. Header'da "Ara ⌘K" düğmesi. | 7.2 mevzuat merkezi kategori/tarih/etiket filtreleri + URL durumu · 7.3 hesaplayıcı hub mükellef tipi/konu filtresi. |

### Doğrulama — KAPATILDI (commit `fd66bab`, `4ed3a5b`, `d8cc3f5`)

- **`pnpm lint` YEŞİL.** `.gitattributes` (`* text=auto eol=lf`) eklendi, çalışma
  kopyası LF'e renormalize edildi; kalan gerçek biome uyarıları (format,
  organizeImports, a11y) giderildi veya öznitelik düzeyinde gerekçeli
  `biome-ignore` ile bastırıldı.
- **e2e YEŞİL** — `pnpm exec playwright test` (desktop + mobile, **63 test**):
  `hydration.spec.ts`, `accessibility.spec.ts` (17 sayfa × 2 proje, axe sıfır
  ihlal), yeni `design-a11y.spec.ts`, `contact-form.spec.ts`, `tax-calendar.spec.ts`.
- **Yeni bileşenler için axe + klavye testi EKLENDİ** (`e2e/design-a11y.spec.ts`):
  Vergi Yükü Panosu, Yıl Karşılaştırma, Komut Paleti axe; komut paletinin
  yalnızca klavyeyle tam akışı (aç/gez/seç/Esc + odak dönüşü).
- Bunları yeşile çıkarmak için gereken düzeltmeler için commit `d8cc3f5`
  gövdesine bak (öne çıkanlar: `template.tsx` kaldırıldı — aşağıda; gren dokusu
  fixed overlay → body background-image; recharts `accessibilityLayer={false}` +
  `inert`; Counter aria-label → sr-only; komut paleti `<button role=option>`).
- **`template.tsx` sayfa geçişi KALDIRILDI.** Framer Motion `motion.div` SSR'da
  `opacity:0` render ediyor ve modül-bayrak double-render'ı yüzünden animasyona
  geçemiyordu → içerik ~7 sayfada görünmez, axe color-contrast. Sayfa geçişi
  yeniden yapılmalı: içeriği ASLA gizlemeyen bir yaklaşım (üstte oynayan sweep,
  ya da yalnızca transform), gerçek rota değişiminde `AnimatePresence` ile;
  ilk yükte kapalı. Diğer 6 hareket özelliği (`Reveal`, `Parallax`, `ScrollZoom`,
  `Counter`, `MagneticButton`, `Skeleton`) yerinde.
- **`playwright.config.ts`**: `locale: 'tr-TR'` + `timezoneId: 'Europe/Istanbul'`.
  next-intl `localeDetection`, İngilizce tarayıcıda `/` → `/en` yönlendiriyordu;
  testler Türkçe siteyi (`/`) doğruluyor.
- **`accessibility.spec.ts`**: axe'den önce sayfa sonuna kaydırılıp `Reveal`
  (`whileInView`) animasyonları tetikleniyor — geçici `opacity:0` karesi değil
  nihai render denetleniyor.
- **`apps/web/.env.local`** (gitignored): `ci.yml` ile aynı `NEXT_PUBLIC_*`
  placeholder'ları eklendi; `contact-form.spec` yerelde koşuyor.
- **Lighthouse bu ortamda koşulmadı** (Chrome + `pnpm start` orchestration).
  `lighthouserc.json` eşikleri güncellendi (perf 0.85, LCP 2500ms, total-byte
  900000, script-size 340000). CI'da doğrulanmalı.

### Teknik notlar

- **recharts@^3.10.1** eklendi (v2 branch'i deprecated). Tembel chunk **~380 KB ham**
  (~110 KB gz), ilk yüke girmiyor ama ana sayfa panosu mount olunca yükleniyor.
  Optimizasyon adayı: chart mount'unu IntersectionObserver'a ertele (sr-only tablo
  zaten DOM'da, veri erişimi gecikmez) veya daha hafif kütüphane.
- **fuse.js@^7** eklendi; paylaşılan ilk yük JS 102→103 KB.
- İlk yük JS (Next "First Load JS"): ana sayfa 172 KB, `/araclar` 168 KB — hedef
  220 KB altında. "220 KB" brief'te bu metriği kastediyor; Lighthouse
  `resource-summary:script:size` recharts'ı da sayacağı için eşiği 340 KB.

### YAPMA listesi — uyum teyidi

- `main` dalına dokunulmadı. İş `v2-tasarim`'de.
- Vergi oranları değiştirilmedi, "doğrulanmış" işaretlenmedi.
- `UnverifiedRatesNotice` kaldırılmadı — yeni panolar da (`TaxBurdenPanel`,
  `YearComparisonPanel`) doğrulanmamış yıl için gösteriyor.
- `LEGAL_TEXTS_APPROVED` değiştirilmedi.
- Test gevşetilmedi (65 test aynen).
- `ui-ux-pro-max` skill scriptleri çalıştırılmadı; Anthropic `frontend-design`
  skill'i kullanıldı.
- Gradyan her yüzeye uygulanmadı: `.surface-glow` / `--gradient-beam` seçici.

---

## 1. Nerede duruyoruz

| # | Aşama | Durum |
|---|---|---|
| 1 | Temel — monorepo, vergi motoru, tasarım sistemi | ✅ |
| 2 | Yasal sayfalar, Turnstile, çerez onayı, lead veritabanı | ✅ |
| 3 | Dağıtım — Netlify, Neon, Resend, Upstash | ✅ |
| 4 | İçerik altyapısı + sayfalar (9 hizmet, 7 sektör, kurumsal, SSS, ref., kariyer) | ✅ |
| 5 | Vergi takviminde VUK Md. 18 resmî tatil kaydırması | ✅ |
| 6 | Araçlar — 9 hesaplayıcı, `/araclar/[slug]` | ✅ |
| 7 | Form dayanıklılığı — Turnstile yüklenemezse kilitleme yok | ✅ |
| 8 | Mevzuat merkezi — editoryal yazılar + resmî besleme altyapısı | ✅ (besleme inert, aşağı bak) |
| 9 | Teknik borç — next-intl, CSP (Report-Only), lint, e2e kapsamı | ✅ (CSP enforce ve e2e koşusu bekliyor) |
| 10 | Tasarım derinleştirme — defter motifi, Motion, durum dili | ✅ (aksan rengi önerisi onay bekliyor) |
| 11 | Geçiş — QA, Lighthouse, `tam-insa`/`v2` → `main` birleştirme | ⏳ |

**Doğrulama (hepsi yeşil):** `pnpm typecheck` · `pnpm lint` · `pnpm test`
(65 test) · `pnpm build`.

Bu koşuda üretilen commit'ler: `Bölüm 1` … `Bölüm 8`, her biri ayrı ve geri
dönülebilir bir noktada.

---

## 2. Çalışan altyapı

- **Barındırma:** Netlify. `netlify.toml` monorepo derlemesini yapılandırıyor.
- **Veritabanı:** Neon Postgres, Drizzle ORM. `leads`, `lead_access_log`.
- **E-posta:** Resend, `futuristax.com` doğrulandı.
- **Hız sınırı:** Upstash Redis — doğrulanmış istekte 10 dk'da 3; doğrulanmamış
  istekte 1 saatte 2 (ayrı prefix).
- **Bot koruması:** Cloudflare Turnstile (test anahtarlarıyla). Betik
  yüklenemezse form yine gönderilir, kayıt "doğrulanmamış" işaretlenir.
- **Kur:** TCMB günlük XML, sunucuda çekilir; erişilemezse sonuç gizlenir.
- **CSP:** middleware'de nonce üretilir, **Report-Only** olarak yayında
  (bkz. ADR 0004). Zorlayıcı moda geçiş ayrı adım.

Vergi motoru: **65 test**, satır/fonksiyon kapsamı ~%100.

---

## 3. Bu koşuda eklenenler (özet)

- `src/lib/data/*` — tipli, CMS'e taşınabilir içerik (hizmet/sektör/SSS/ekip/
  referans/mevzuat). Her kayıt slug + SEO + ilişki taşır. **Metinler TASLAK**
  (`draft: true`), somut oran/tutar/madde atfı yazılmadı.
- Rotalar: `/hizmetler(+/[slug])`, `/sektorler(+/[slug])`, `/kurumsal`, `/sss`,
  `/referanslar`, `/kariyer`, `/araclar/[slug]`, `/mevzuat(+/[slug])`. Her
  sayfada metadata + canonical + uygun JSON-LD. `sitemap.ts` dinamik.
- `packages/tax-engine/src/calendar/holidays.ts` — sabit resmî tatiller,
  `shiftToNextBusinessDay`, mali tatil işareti. `getUpcomingDeadlines` artık
  `statutoryDate` + `date` (kaydırılmış) döndürüyor.
- 8 yeni hesaplayıcı bileşeni + `ToolCalculator` + `fields.tsx` (ortak alanlar).
  Hesaplama mantığı yalnızca motorda.
- `src/lib/fetchers/legislation.ts` — RSS/Atom/JSON ayrıştırma, ISR, **yedeksiz**.
- `middleware.ts` + `src/lib/security/csp.ts` — nonce zinciri.
- `src/components/motion/Reveal.tsx` — scroll reveal, reduced-motion'da kapalı.
- `src/components/ui/StatusPanel.tsx` — boş/hata durumları için tek dil.
- `tokens.css` — `.ledger-margin` / `.ledger-paper` / `.ledger-grid` motifi.

---

## 4. Cevap bekleyen kararlar — UYDURULMAZ, SORULUR

Bunların hepsi bilerek eksik bırakıldı.

1. **Dinî bayram tatilleri (Aşama 5).**
   `packages/tax-engine/src/calendar/holidays.ts` →
   `RELIGIOUS_HOLIDAYS_BY_YEAR` 2024–2026 için `null`. Ramazan ve Kurban
   Bayramı tarihleri Resmî Gazete / Diyanet duyurusundan **doğrulanarak**
   girilmeli. Girilene kadar kaydırmaya katılmaz; takvim altbilgisi bunu
   kullanıcıya söylüyor. Beklenen biçim dosyanın yorumunda.

2. **Mali tatil (5604) kesin kuralı.** 1–20 Temmuz'a denk gelen süreler
   kaydırılmıyor, yalnızca `fiscalBreakCaution` ile işaretleniyor. Kesin
   "+7 gün" hesabı modellenmedi (yanlış kesin tarih üretmemek için).

3. **`LEGISLATION_FEED_URL` (Aşama 8).** Resmî duyuru beslemesi bir env
   değişkeniyle yapılandırılır (RSS/Atom veya JSON). **Yapılandırılana kadar
   `/mevzuat` sayfasındaki "Resmî duyurular" bölümü "şu an güncellenemiyor"
   gösterir — bu bilinçli.** GİB/Resmî Gazete HTML'ini kazıyan kırılgan bir
   scraper yazılmadı; stabil bir kaynak (kurumun kendi derleyicisi, bir RSS
   köprüsü) firma tarafından belirlenmeli.

4. **Aksan rengi (Aşama 10).** Mevcut `--color-ink: #4b7fd6` "jenerik SaaS
   mavisi" eleştirisini karşılamıyor. **Öneri (uygulanmadı, onay ister):**
   daha az doygun, mürekkebe yakın bir mavi — aday `#3f6ea8` veya Prusya
   mavisi yönünde `#2f5c8f`. Değiştirilirse `tokens.css`'teki TÜM kontrast
   oranları (metin, damga, onay) yeniden doğrulanmalı. Açık tema karşılığı da
   ayrıca seçilmeli.

5. **İçerik revizyonu.** 9 hizmet + 7 sektör + 5 mevzuat yazısı + kurumsal
   yaklaşım metni taslaktır. Firma gözden geçirecek; somut sayı/oran/tarih
   ekleyecekse mevzuat kaynağıyla.

6. **Referanslar.** `src/lib/data/testimonials.ts` bilinçli boş. Müşteri
   görüşü yalnızca yazılı yayın izniyle eklenir. `/referanslar` şu an
   `noindex`.

7. **Ekip.** `src/lib/data/team.ts` yalnızca kurucuyu içeriyor (bilgi
   `@futuristax/config`'ten). Diğer üyeler + biyografiler firmadan gelecek.

8. **İstatistik iddiaları.** "%98 başarı", "150+ müşteri" vb. hâlâ
   `unverifiedClaims.publish = false`; hiçbir sayfada render edilmiyor.
   TÜRMOB tanıtım kısıtları + ölçüm yöntemi teyidi bekliyor.

9. **Vergi oranları.** 2024/2025 yer tutucu, 2026 boş. **Ajan dokunmadı.**
   Firma revize edecek; `provenance.verified` yalnızca gerçek doğrulamadan
   sonra `true` yapılmalı.

10. **Yasal metinler.** `LEGAL_TEXTS_APPROVED = false`. KVKK/gizlilik/çerez
    metinleri hukukçu onayı bekliyor; ilgili sayfalar `noindex`.

### Tasarım koşusundan (2026-09-07, `v2-tasarim`)

11. **Açık tema — KARAR: KALIYOR.** (Kullanıcı onayladı.) Azur `#2C5BE0` ile,
    tüm kontrast oranları doğrulandı (`tokens.css` `@media light`).

12. **Kalan 6 alt öğe — öncelik firmadan bekleniyor.** Liste ve durum:
    - **5.2** ResultLedger yanına dağılım grafiği (indirilebilir vs KKEG, dilim
      dağılımı). Altyapı: `useChartColors`, `dynamic(ssr:false)` chart deseni,
      `inert`+sr-only tablo kalıbı hazır (`TaxBurdenCharts`'tan kopyalanır).
    - **5.3** Vergi Takvimi zaman çizelgesi görünümü (yıl boyu yükümlülük
      yoğunluğu, mükellef tipine göre filtre). Veri: `getUpcomingDeadlines`
      zaten `statutoryDate`+`date` döndürüyor.
    - **6.2** Senaryo karşılaştırma (2–3 senaryo: farklı ciro/gider/istisna;
      tabloda karşılaştırma; senaryolar URL'e serileştirilir — paylaşılabilir).
      `computeBurden` saf, `BurdenFields` ortak bileşen hazır; eksik olan
      çoklu-senaryo state + `useSearchParams` serileştirme.
    - **6.3** `/hizmetler` hub'ında etkileşimli hizmet karşılaştırma matrisi
      (hangi hizmet hangi ihtiyaca uyar). Veri: `SERVICES` +
      `relatedSectorSlugs`; yeni bir "ihtiyaç" ekseni tanımı gerekir (firma).
    - **7.2** Mevzuat merkezinde kategori/tarih aralığı/etiket filtreleri, filtre
      durumu URL'de. Veri: `LEGISLATION_ARTICLES` + `LEGISLATION_CATEGORY_LABELS`;
      makalelerde henüz "etiket" alanı yok (eklenmeli).
    - **7.3** Hesaplayıcı hub'ında mükellef tipi + konuya göre filtre. Veri:
      `TOOLS` (`ToolMeta`); mükellef tipi / konu alanı `ToolMeta`'ya eklenmeli.

13. **"Fark" sütunu renk eşlemesi — KULLANICI GERİ BİLDİRİMİYLE DÜZELTİLDİ**
    (commit `4ed3a5b`). Artış/azalış ▲/▼ ok + işaret + `sr-only` sözcük
    ("artış"/"azalış"/"değişim yok") ile — renk tek başına anlam taşımıyor
    (WCAG 1.4.1). `--signal` YALNIZCA mükellef için olumsuz kalemde: `costRow`
    olan satırda ödenen tutarın artışı. `--positive` artık kullanılmıyor.
    `ROWS`'a `costRow` bayrağı — ileride "matrah" gibi non-cost satır eklenirse
    artış olumsuz sayılmaz.

14. **Recharts ağırlığı — KARAR: KABUL.** (Kullanıcı onayladı.) Tembel chunk
    ~380 KB ham, ilk yüke girmiyor. Yine de 5.2/5.3'te chart mount'unu
    IntersectionObserver'a erteleme optimizasyonu açık (bkz. §5).

15. **Fontshare tercih ediliyorsa.** Clash Display / Satoshi gibi Fontshare
    aileleri seçilirse `fonttools` ile 12 Türkçe glif doğrulanıp `.woff2`
    dosyaları repoya eklenerek `next/font/local` ile self-host edilmeli. Bu
    koşuda Google (Space/Familjen Grotesk) seçildi çünkü glif tablosu bu ortamda
    programatik doğrulanamıyordu.

---

## 5. Açık teknik borçlar (bu koşudan sonra)

0. **Yeni bileşenler için axe + e2e (tasarım koşusu).** `TaxBurdenPanel`,
   `YearComparisonPanel`, `CommandPalette` için `e2e/accessibility.spec.ts`'e
   senaryo eklenmeli; `pnpm test:e2e` ve Lighthouse CI'da/yerelde koşulmalı.
   `pnpm lint` kanonik kopyada doğrulanmalı (bu iç içe kopyada CRLF nedeniyle
   önceden kırmızı). Ana sayfa panosu chart mount'u IntersectionObserver'a
   ertelenerek ilk yük düşürülebilir.


1. **CSP zorlayıcı moda geçiş.** Report-Only raporları toplanmalı (bir
   `report-to`/`report-uri` uç noktası gerekebilir); ihlal kalmadığına emin
   olununca `content-security-policy-report-only` → `content-security-policy`.
   `style-src 'unsafe-inline'` sonra sıkılaştırılabilir. Bkz. ADR 0004.

2. **e2e koşusu.** `e2e/hydration.spec.ts` (yeni) ve genişletilmiş
   `e2e/accessibility.spec.ts` (3 → 15 sayfa) bu ortamda ÇALIŞTIRILAMADI
   (tarayıcı + `pnpm start` gerekiyor). CI'da veya yerelde
   `pnpm test:e2e` ile doğrulanmalı. CSP Report-Only olduğu için hydration'ı
   engellemesi beklenmiyor.

3. **Lead `verification` sütunu.** Şu an `leads.attribution` jsonb içinde
   (`{ verification: 'verified' | 'unverified', verificationReason? }`).
   Birinci sınıf bir sütuna (drizzle migration) taşınabilir — bu ortamda
   `DATABASE_URL` olmadığı için migration üretilemedi.

4. **Statik render.** Tüm `[locale]` sayfaları dinamik (next-intl Server
   Component API'leri statik üretime izin vermiyor). `setRequestLocale` ile
   statik hâle getirilebilir — ayrı, kapsamlı bir iş.

5. **Ana sayfadaki `SERVICES` sabiti.** `src/app/[locale]/page.tsx` hâlâ 6
   hizmeti elle listeliyor; `src/lib/data`'daki `SERVICES` ile birleştirilebilir
   (bu koşuda imza sayfasını riske atmamak için dokunulmadı).

---

## 6. Geçiş öncesi kontrol listesi (Aşama 11)

- [ ] `pnpm dev` ile yerelde tüm rotaları gez.
- [ ] `pnpm test:e2e` — hydration + axe.
- [ ] Lighthouse (CI zaten yapılandırılmış).
- [ ] Cevap bekleyen kararların (bölüm 4) en az kritik olanları kapatılsın:
      dinî bayram tarihleri, aksan rengi kararı, içerik onayı.
- [ ] CSP zorlayıcı moda alınsın ve bir kez daha e2e.
- [ ] `tam-insa` → `v2`, sonra QA sonrası `v2` → `main`.
- [ ] **`main`'e alınmadan önce:** doğrulanmamış vergi oranlarının önizlemede
      görünmesi sorun değil; futuristax.com'da görünmesi başka bir şey.

---

## 7. Geçmişte kaybedilen zaman — tekrarlanmasın

- DNS Netlify'da yönetiliyor (Squarespace'te değil).
- `serverEnv()` tüm değişkenleri birden doğruluyordu → tembel doğrulama.
- `ci.yml`'a gerçek anahtar biçimli test değerleri → Netlify sır tarayıcısı.
- `drizzle-kit` `.env.local` okumaz → elle yükleyici.
- CSP nonce'u Next.js'e ulaşmayınca hydration hiç olmadı. "Görünmek" ≠
  "çalışmak". Bu koşuda zincir düzeltildi ama önce Report-Only.

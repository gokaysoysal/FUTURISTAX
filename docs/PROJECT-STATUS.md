# PROJE DURUMU — devam noktası

> **Her yeni oturumda önce bu dosyayı oku.** Kurallar ve mimari için `CLAUDE.md`.

**Son güncelleme:** 2026-09-07 — V3 SUNUM KATMANI koşusu (`v2-fx` dalı), Bölüm 4 bitti.
Önceki: TASARIM YÖNÜ DEĞİŞİMİ (`v2-tasarim`, `v2`'ye merge edildi) · Aşama 4–8 (`tam-insa`).
**Depo:** github.com/gokaysoysal/FUTURISTAX — çalışma dalı `v2`, aktif koşu dalı `v2-fx`
**Önizleme:** deploy-preview-1--futuristax.netlify.app
**Canlı site:** futuristax.com — hâlâ ESKİ sürüm (`main` dalı, `legacy/index.html`)

---

## 0-A. V3 SUNUM KATMANI KOŞUSU — 2026-09-07 (`v2-fx`)

Yalnızca görünen katman yeniden inşa ediliyor (bkz. `docs/V3-SUNUM-PROMPT.md`);
`tax-engine`, API route'ları, DB, form, dağıtım DEĞİŞMİYOR. 8 bölüm, her biri
ayrı commit, her bölüm sonunda `pnpm typecheck · lint · test · build` yeşil.

`a7e644b` (1) · `359d56d` (2) · `9a1268b` (3) · `878a685` (4) · `ca28e7b` (5).

### Biten

| # | Bölüm | Not |
|---|---|---|
| 1 | Sanat yönetimi + görsel altyapı | **Prosedürel** — bu ortam Unsplash/Pexels indiremiyor. `SceneBackdrop` (SVG: concrete / geometric-shadow / document-grid / light-field, palet tokenlı), `TreatedImage` (duotone + grain, gerçek foto gelince kullanılır), `LazyLottie` (dosya gelince). `public/images/CREDITS.md` + `public/lottie/README.md` sanat yönü kurallarını taşıyor. **Gerçek foto/Lottie firma/sonraki adım.** |
| 2 | WebGL hero | R3F **shader alanı** seçildi (sıvı gradyan + noise, palet tokenlı). `HeroCanvas` karar katmanı: yalnızca ≥768px + WebGL + reduced-motion yok → `HeroScene` (`dynamic ssr:false`); aksi `HeroFallback` (statik CSS gradyan + grain). visibilitychange'de render durur. |
| 3 | Scroll + geçiş | `SmoothScroll` (Lenis; reduced-motion'da HİÇ başlamaz), `ScrollProgress` (üst çubuk), `RouteTransition` (perde; ilk sert yükte YOK — LCP), `SplitHeading` (split-type + Türkçe glif kontrolü: düşen karakter varsa revert). `lib/motion/scroll.ts` merkezî. |
| 4 | Ana sayfa sinematik akış | 8 sahne: hero → güven bandı → vergi takvimi → hizmetler → süreç → araçlar → sektörler → kapanış. `components/home/`: `SceneSection` (eyebrow + SplitHeading + lead + seçici `SceneBackdrop`), `ProcessScene`+`TrustBand` (pin YOK), `ServicesRail` (native overflow-x + ince ScrollTrigger drift), `SectorsGrid`, `ToolsShowcase` (araç listesi + canlı `TaxBurdenPanel`). Hero tek CTA'ya indi; `TaxCalendarPanel` hero'dan çıkıp kendi sahnesine geçti. |
| 5 | Araçlar çalışma alanı | `ToolWorkspace` + `ToolSelector` — 9 hesaplayıcı tek yüzey. Seçici APG tabs (roving tabindex, ok/Home/End), dar ekranda yatay kaydırılır, tuzak yok. Her aracın kendi URL'i: `history.pushState` → `/araclar/[slug]`, `popstate` senkron; sunucu `[slug]` sayfası metadata + HowTo/FAQ JSON-LD taşımayı sürdürür. Araç değişince `AnimatePresence` geçiş (reduced-motion: anında). `LedgerChart` — **araca özel** görsel kırılım (her hesaplayıcı `segments`'ini kendi `result.detail`'inden kurar; saf SVG/div, recharts yok; tümüyle `aria-hidden`, veri = `ResultLedger` sr-only steps tablosu); kur-cevirici hariç 8 araç. `RollingNumber` — sonuç değişince yeniden sayan sayaç (ResultLedger başlığı). `ToolCalculator` kaldırıldı. |

### Kalan — V3-SUNUM-PROMPT bölümleri

- **6** Ana sayfadaki dili tüm iç sayfalara taşı (hizmet/sektör detay, kurumsal,
  mevzuat, SSS, iletişim). İletişim sayfası özellikle güçlü.
- **7** Performans: WebGL/Lottie/grafik hepsi `dynamic` + IntersectionObserver;
  görseller AVIF/WebP + blur; GSAP/Three yalnızca kullanan sayfada; bundle analizi
  + en ağır 3 modül raporu. `lighthouserc.json`: perf 0.75 / LCP 3000 / CLS 0.05 /
  a11y 1.0. **İlk yük JS şu an: ana sayfa 237 kB** (Bölüm 4'te 173→237: her
  SceneSection başlığı SplitHeading = GSAP ilk bundle'da; `ServicesRail` useGSAP;
  `ToolsShowcase`→`TaxBurdenPanel`); **`/araclar` 182, `/araclar/[slug]` 178 kB**
  (Bölüm 5: `AnimatePresence` + `RollingNumber` ilk bundle'da). 220 kB hedefinin
  üstünde — Bölüm 7'nin işi (GSAP/motion/grafik dynamic import + IO ertelemesi).
- **8** Erişilebilirlik (ESNEMEZ): tüm sayfalarda axe sıfır ihlal, reduced-motion
  tam, klavyeyle tüm akışlar (araç seçici, yatay rail, grafikler), pin klavye
  tuzağı yok, grafik sr-only tablo, Türkçe karakter split-type sonrası kontrol.

### Bölüm 4–5 doğrulaması

`pnpm typecheck · lint · test` (tax-engine 65) `· build` — hepsi yeşil.
**e2e bu ortamda koşulmadı** (tarayıcı + `pnpm start` gerekiyor). CI'da/yerelde
doğrulanmalı: yeni ana sayfa sahneleri axe/klavye; **araç seçici tam klavye akışı
(ok/Home/End, sekme→panel), `/araclar/[slug]` derin link + geri/ileri (`popstate`),
`LedgerChart` sr karşılığı, `RollingNumber` reduced-motion**. `RouteTransition` /
`SmoothScroll` / `RollingNumber` reduced-motion no-op yolu birim testli değil.

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

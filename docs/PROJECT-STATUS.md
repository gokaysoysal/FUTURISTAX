# PROJE DURUMU — devam noktası

> **Her yeni oturumda önce bu dosyayı oku.** Kurallar ve mimari için `CLAUDE.md`.

**Son güncelleme:** Aşama 4–8 tamamlandı (tek ajan koşusu, `tam-insa` dalı)
**Depo:** github.com/gokaysoysal/FUTURISTAX — çalışma dalı `v2`, ajan dalı `tam-insa`
**Önizleme:** deploy-preview-1--futuristax.netlify.app
**Canlı site:** futuristax.com — hâlâ ESKİ sürüm (`main` dalı, `legacy/index.html`)

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

---

## 5. Açık teknik borçlar (bu koşudan sonra)

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

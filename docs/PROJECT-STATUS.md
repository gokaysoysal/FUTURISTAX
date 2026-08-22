# PROJE DURUMU — devam noktası

> **Yeni bir oturuma başlarken önce bu dosyayı oku.** Nerede kalındığını, neyin
> neden böyle yapıldığını ve sıradaki işi burada bulursun. Her aşama sonunda
> güncellenir.

**Son güncelleme:** Aşama 2 sonu
**Depo:** futuristax — Next.js 15 monorepo (pnpm + Turborepo)
**Hedef:** futuristax.com'un tek dosyalık `index.html` prototipinin yerini almak

---

## 1. Bu proje neyi çözüyor

Mevcut canlı site tek bir `index.html` içinde ~5.000 satır. Tespit edilen ve
çözülmesi gereken sorunlar:

| # | Sorun | Durum |
|---|---|---|
| 1 | `submitForm()` hiçbir yere veri göndermiyor — tüm lead'ler kayboluyor | ✅ Çözüldü |
| 2 | `loadGibNews()` dil modeline **uydurma GİB duyurusu** ürettirip gerçek gibi yayınlıyor | ✅ Kaldırıldı |
| 3 | Anthropic API tarayıcıdan çağrılıyor, anahtar riski | ✅ Sunucuya taşınacak (Aşama 11) |
| 4 | `switchTab()` sahte SPA — tüm içerik tek URL'de, SEO yok | ✅ Gerçek routing |
| 5 | `user-scalable=no` — zoom engelli (WCAG 1.4.4) | ✅ Kaldırıldı |
| 6 | `cursor: none` — standart imleç yok | ✅ Kaldırıldı |
| 7 | Gövde metni %30 opaklık, kontrast ~3:1 (AA altı) | ✅ Tokenler AA doğrulandı |
| 8 | Altın fiyatı CoinGecko `tether-gold` kripto tokeninden | ✅ TCMB resmî XML |
| 9 | Vergi limitleri koda gömülü, yıl bazlı değil | ✅ `packages/tax-engine` |
| 10 | KVKK metni, çerez onayı yok | ⚠️ Taslak hazır, hukukçu onayı bekliyor |
| 11 | JSON-LD, sitemap, robots, OG yok | ✅ Eklendi |
| 12 | Cinzel Türkçe gliflerde yetersiz ("AKTIF MUSTERI") | ✅ Font değişti |

---

## 2. 12 aşamalık plan

| # | Aşama | Durum |
|---|---|---|
| 1 | Temel — monorepo, vergi motoru, tasarım sistemi, form API, takvim | ✅ Tamam |
| 2 | Yayına çıkılabilir çekirdek — yasal sayfalar, Turnstile, çerez onayı, lead DB | ✅ Tamam |
| 3 | İlk deploy — Vercel, Sentry, alan adı, CI yeşil | ⏭️ **Sıradaki** |
| 4 | Hizmet sayfaları — 9 hizmet ayrı URL, şema, CTA | ⏳ |
| 5 | Sektör + kurumsal — 7 sektör, Hakkımızda, Ekip, Referanslar, Kariyer, SSS | ⏳ |
| 6 | CMS — Sanity Studio, içerik tipleri, canlı önizleme, webhook | ⏳ |
| 7 | Mevzuat merkezi — blog, gerçek GİB/Resmî Gazete beslemesi, RSS | ⏳ |
| 8 | Hesaplayıcılar — kalan 8 araç, `/araclar/[slug]`, PDF, HowTo şeması | ⏳ |
| 9 | Takvim derinleşmesi — resmî tatil kaydırması, mali tatil, oran doğrulama | ⏳ |
| 10 | Tasarım sistemi — `packages/ui`, Storybook, hareket, görsel regresyon | ⏳ |
| 11 | Zekâ + çok dil — RAG chatbot, İngilizce, Cal.com | ⏳ |
| 12 | Ölçüm + QA — analitik taksonomisi, Lighthouse/axe tam geçiş | ⏳ |

---

## 3. Tartışmasız kurallar

Bunlar her aşamada geçerlidir; ihlal edilirse iş geri alınır.

1. **Uydurma resmî içerik üretilmez.** Mevzuat, tebliğ, duyuru, oran, tarih ya
   gerçek kaynaktan gelir ya hiç gösterilmez. Kaynak erişilemezse "şu an
   güncellenemiyor" durumu gösterilir, yedek uydurma değer üretilmez.
2. **API anahtarları asla istemciye gitmez.**
3. **WCAG 2.2 AA taban seviyedir.** Her PR'da axe, sıfır ihlal.
4. **Türkçe karakterler hiçbir metinde düşürülmez.**
5. **Vergi mantığı UI'dan ayrıdır ve testlidir.**
6. **Tek dosyalık çıktı üretilmez**; hiçbir dosya 300 satırı geçmez.
7. Her hesaplayıcı ve AI çıktısı sorumluluk reddi içerir.

---

## 4. Tasarım yönü (kararlaştırıldı, değiştirilmez)

Siyah + altın + Cinzel lüks estetiği **reddedildi**. Yerine **mali belge
estetiği**: resmî belge dili, defter çizgileri, tasdik mührü.

- **Palet:** mürekkep-grafit zemin (`#0d1013`), tasdik mavisi aksan (`#4b7fd6`),
  damga kırmızısı (`#d9705c`) **yalnızca** son tarih/KKEG uyarılarında,
  onay yeşili (`#5fb894`) olumlu kalemlerde. Açık tema de tanımlı.
- **Tipografi:** Newsreader (display) + Inter (gövde) + IBM Plex Mono (veri ve
  kanun maddesi göndermeleri). Üçü de tam Türkçe glif desteğine sahip.
- **Rakamlar:** her yerde `tabular-nums`.
- **İmza öğesi:** ana sayfadaki **Vergi Takvimi** — hero'da soyut slogan yerine
  ziyaretçinin aradığı bilgi: bir sonraki beyanname ne zaman. `.ics` indirilebilir.
- **Defter çizgileri yalnızca veri bağlamlarında** kullanılır, dekoratif değil.

---

## 5. Mimari özet

```
futuristax/
├── apps/web/              Next.js 15 App Router
├── packages/config/       Firma bilgileri + env şeması — TEK doğruluk kaynağı
├── packages/tax-engine/   Saf TS hesaplama motoru — 48 test, %100 satır kapsamı
└── docs/decisions/        ADR'ler
```

**`packages/tax-engine` sözleşmesi:** her hesaplayıcı `(input, rates) => Result`
imzasında saf fonksiyondur. Ağ erişimi yok, `Date.now()` yok, rastgelelik yok.
Referans tarih ve kur tablosu dışarıdan geçirilir. Her `RateSet` bir `provenance`
alanı taşır (`verified`, `source`, `checkedAt`); doğrulanmamış yıllarda UI
`UnverifiedRatesNotice` gösterir.

**Hazır hesaplayıcılar (motor tarafı):** KDV, kurumlar vergisi (asgari KV dahil),
gelir vergisi (ücret/ücret dışı ayrı tarife), binek araç gider kısıtı, binek araç
kira sınırı, SGK işveren maliyeti, kıdem tazminatı, TÜFE güncelleme, kur çevirimi.
**UI tarafı:** yalnızca binek araç gider kısıtı yapıldı; kalan 8'i Aşama 8'de.

---

## 6. Açık işler ve borçlar

Kod içinde `TODO(aşama-N)` olarak işaretli:

- **Vergi oranları doğrulanmamış.** 2024 ve 2025 tabloları yer tutucu;
  her kalem Resmî Gazete / GİB tebliğinden teyit edilmeli. 2026 hiç girilmedi
  (kasıtlı — `rates/2026.ts` içindeki açıklamaya bak).
- **Resmî tatil kaydırması yok.** VUK Md. 18 gereği son gün tatile denk gelirse
  süre uzar; takvim şu an ham kural tarihini döndürüyor. Bileşen altbilgisinde
  kullanıcıya bildiriliyor. Bkz. `docs/decisions/0003-holiday-shift.md`.
- **Yasal metinler taslak.** `LEGAL_TEXTS_APPROVED = false` olduğu sürece
  sayfalar `noindex` ve üstlerinde uyarı bandı var.
- **KVKK aktarım bölümü eksik** — kullanılan sağlayıcılar (Vercel, Resend, Neon,
  Cloudflare, Upstash) ve yurt dışı aktarım beyanı yazılmalı.

---

## 7. Kullanıcıdan cevap bekleyen iş kararları

Bunlar teknik değil; uydurulmamıştır ve sorulmadan doldurulmamalıdır.

1. **Doğrulanmamış istatistikler.** "%98 başarı oranı", "150+ aktif müşteri",
   "%30 vergi optimizasyonu" — ölçüm metodolojisi nedir? TÜRMOB reklam/tanıtım
   kısıtları açısından meslek odasıyla teyit edilmeli.
   Şu an `unverifiedClaims.publish = false`, yayınlanmıyor.
2. **CMS tercihi:** içeriği firma sahibi mi yönetecek (→ Sanity) yoksa
   geliştirici üzerinden mi (→ dosya tabanlı MDX yeterli)?
3. **Referanslar** için müşterilerden yazılı izin var mı?
4. **Mevcut site ne zaman kapanacak?** Alan adı geçiş planı.
5. **Hukukçu onayı** — KVKK ve çerez metinleri için.

---

## 8. Çalışma döngüsü

Konteyner oturumlar arasında sıfırlanır; dosyalar kalmaz. Bu yüzden:

1. Claude aşamayı bitirir, zip üretir.
2. Kullanıcı zip'i açıp repoya kopyalar ve **GitHub'a push eder.**
3. Repo Projeye bağlı olduğu için Claude bir sonraki oturumda kodu okuyabilir.
4. Yeni oturum bu dosyayla başlar.

**Push edilmezse o aşama kaybolur.**

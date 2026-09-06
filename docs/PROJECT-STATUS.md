# PROJE DURUMU — devam noktası

> **Her yeni oturumda önce bu dosyayı oku.** Kurallar ve mimari için `CLAUDE.md`.

**Son güncelleme:** Aşama 3 tamamlandı
**Depo:** github.com/gokaysoysal/FUTURISTAX — çalışma dalı `v2`
**Önizleme:** deploy-preview-1--futuristax.netlify.app
**Canlı site:** futuristax.com — hâlâ ESKİ sürüm (`main` dalı, `legacy/index.html`)

---

## 1. Nerede duruyoruz

| # | Aşama | Durum |
|---|---|---|
| 1 | Temel — monorepo, vergi motoru, tasarım sistemi | ✅ |
| 2 | Yasal sayfalar, Turnstile, çerez onayı, lead veritabanı | ✅ |
| 3 | Dağıtım — Netlify, Neon, Resend, Upstash | ✅ |
| 4 | İçerik sayfaları — 9 hizmet, 7 sektör, kurumsal, SSS, referanslar | ⏭️ |
| 5 | Araçlar — kalan 8 hesaplayıcı + takvimde resmî tatil kaydırması | ⏳ |
| 6 | CMS ve mevzuat — blog, gerçek GİB beslemesi | ⏳ |
| 7 | Cila — tasarım derinleştirme, CSP, lint, İngilizce | ⏳ |
| 8 | Geçiş — QA, Lighthouse, `v2` → `main` birleştirme | ⏳ |

Aşama 4-7 tek bir ajan koşusunda yapılacak: `docs/AJAN-KOSUSU.md`

---

## 2. Çalışan altyapı

- **Barındırma:** Netlify. `netlify.toml` monorepo derlemesini yapılandırıyor.
- **DNS:** Netlify DNS. Alan adı Squarespace'ten alınmış ama ad sunucuları
  Netlify'a devredilmiş — **DNS kaydı Squarespace panelinden değil, Netlify'dan
  eklenir.**
- **Veritabanı:** Neon Postgres, Drizzle ORM. `leads` ve `lead_access_log`
  tabloları oluşturuldu.
- **E-posta:** Resend, `futuristax.com` doğrulandı. Gönderen `MAIL_FROM`'dan.
- **Hız sınırı:** Upstash Redis — 10 dakikada 3 talep.
- **Bot koruması:** Cloudflare Turnstile (şu an test anahtarlarıyla).
- **CI:** GitHub Actions — typecheck, lint, test, build, e2e, Lighthouse.

Vergi motoru: **48 test geçiyor, satır ve fonksiyon kapsamı %100.**

---

## 3. Açık borçlar

1. **Vergi takviminde resmî tatil kaydırması yok.** VUK Md. 18 gereği son gün
   tatile denk gelirse süre ilk iş gününe uzar. Canlı önizlemede "Ba-Bs
   formları: 30 Ağustos 2026" göründü — o gün hem pazar hem Zafer Bayramı.
   Bkz. `docs/decisions/0003-holiday-shift.md`.

2. **Turnstile yüklenemezse form kilitleniyor.** Yedek yol gerekli.

3. **CSP kaldırıldı.** Nonce'u Next.js'e ulaştıramadığı için tüm istemci
   JavaScript'ini blokluyordu. `docs/decisions/0004-csp-nonce.md`.

4. **Vergi oranları doğrulanmamış.** 2024 ve 2025 yer tutucu, 2026 hiç
   girilmedi. **Bilinçli olarak erteleniyor** — firma inşa bitince revize
   edecek. Ajan bunlara dokunmayacak.

5. **`next-intl` uyarısı:** `getRequestConfig` içinde `await requestLocale`.

6. **Lint borcu.**

7. **Yasal metinler taslak.** `LEGAL_TEXTS_APPROVED = false`, sayfalar noindex.

8. **Tasarım karaktersiz.** Mali belge estetiği vaat edildi ama defter
   çizgileri, mühür motifi ve ızgara ekranda yok.

---

## 4. Cevap bekleyen iş kararları

Bunlar teknik değil; **uydurulmaz, sorulur.**

1. "%98 başarı oranı", "150+ aktif müşteri", "%30 vergi optimizasyonu" —
   ölçüm yöntemi? TÜRMOB reklam kısıtları açısından teyit gerekiyor.
   Şu an `unverifiedClaims.publish = false`.
2. CMS tercihi: Sanity mi, dosya tabanlı MDX mi?
3. Hizmet metinleri firmadan mı gelecek, taslak mı kalacak?
4. Referanslar için müşterilerden yazılı izin var mı?
5. KVKK ve çerez metinleri için hukukçu onayı.
6. Geçiş tarihi — `v2` ne zaman `main`'e alınacak?

---

## 5. Geçmişte kaybedilen zaman — tekrarlanmasın

- DNS'in Squarespace'te değil Netlify'da yönetildiği geç fark edildi
- `serverEnv()` tüm değişkenleri birden doğruluyordu; henüz kurulmamış
  servislerin anahtarları eksik diye iletişim formu çöküyordu
- `ci.yml` içine gerçek anahtar biçiminde test değerleri yazıldı; Netlify'ın
  sır tarayıcısı derlemeyi durdurdu
- `drizzle-kit` `.env.local` okumuyor; elle yükleyici eklendi
- CSP nonce'u Next.js'e ulaşmayınca hydration hiç gerçekleşmedi; sayfalar
  görünüyor ama hiçbir şey çalışmıyordu. "Görünmek" ile "çalışmak" farklıdır.

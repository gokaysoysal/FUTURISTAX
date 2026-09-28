# Aşama 3 — Dağıtım kurulumu

> Bu aşamanın sonunda yeni site bir önizleme adresinde canlı çalışacak.
> **Mevcut futuristax.com'a hiç dokunulmayacak.**

---

## Neden güvenli

Netlify şu an `main` dalını yayınlıyor ve orada eski `index.html` hâlâ kökte
duruyor. Biz yalnızca `v2` dalında çalışıyoruz. Netlify dal dağıtımlarını ayrı
adreslerde sunar. Üretim ancak `v2` → `main` birleştirmesi yapıldığında değişir
ve bunu Aşama 3'ün en sonunda, bilinçli olarak yapacağız.

---

## 1. Netlify — derleme ayarları

`netlify.toml` dosyası depoya eklendi; Netlify onu otomatik okuyacak. Ayrıca
panelden bir şeyi kontrol edin:

**Site configuration → Build & deploy → Build settings**

- "Base directory" **boş** olmalı. Dolu ise temizleyin — pnpm workspace
  bağımlılıkları ancak depo kökünden çözülür.
- Panelde ayrıca bir build command veya publish directory yazılıysa temizleyin;
  `netlify.toml` içindekiler geçerli olsun.

**Site configuration → Build & deploy → Branches and deploy contexts**

- Production branch: `main` (değiştirmeyin)
- Branch deploys: `v2` dalını ekleyin

---

## 2. Ortam değişkenleri

**Site configuration → Environment variables**

Aşağıdakileri ekleyin. Her biri için scope olarak en azından
"Deploy previews" ve "Branch deploys" seçili olsun.

### Şimdi gerekli (derleme için)

| Anahtar | Değer |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare'den (aşama 4) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `placeholder` (Aşama 6'da gerçekleşecek) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

### İletişim formunun çalışması için

| Anahtar | Nereden |
|---|---|
| `RESEND_API_KEY` | Resend paneli |
| `CONTACT_INBOX` | `info@futuristax.com` |
| `TURNSTILE_SECRET_KEY` | Cloudflare |
| `DATABASE_URL` | Neon bağlantı dizesi |
| `UPSTASH_REDIS_REST_URL` | Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash |

### Sonraki aşamalarda

`ANTHROPIC_API_KEY`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`,
`NEXT_PUBLIC_GA_ID` — Aşama 6 ve 11'de.

> **Sır olan değişkenler asla depoya yazılmaz.** Yalnızca Netlify panelinde
> tutulur. `.env.local` dosyanız da `.gitignore` içinde.

---

## 3. Neon — veritabanı

1. [neon.tech](https://neon.tech) üzerinde ücretsiz hesap açın
2. Yeni proje: `futuristax`, bölge olarak Frankfurt (en yakın)
3. Dashboard'dan **Connection string**'i kopyalayın (pooled olanı seçin)
4. Netlify'a `DATABASE_URL` olarak ekleyin
5. Yerelde `.env.local` dosyanıza da aynı değeri yazın, sonra:

```
pnpm --filter @futuristax/web db:generate
pnpm --filter @futuristax/web db:migrate
```

Bu, `leads` ve `lead_access_log` tablolarını oluşturur.

---

## 4. Cloudflare Turnstile — bot koruması

1. Cloudflare hesabınızda **Turnstile → Add site**
2. Domain: `futuristax.com` ve `netlify.app` ekleyin
3. Widget mode: **Managed**
4. Site key ve Secret key'i Netlify'a ekleyin

---

## 5. Resend — e-posta

1. [resend.com](https://resend.com) hesabı açın
2. **Domains → Add domain** → `futuristax.com`
3. Verilen **DKIM, SPF ve DMARC** kayıtlarını alan adınızın DNS panelinde
   oluşturun
4. Doğrulama tamamlanınca API key üretin, Netlify'a ekleyin

> DNS erişiminiz yoksa: Resend'in `onboarding@resend.dev` test adresi
> kullanılabilir ama yalnızca kendi hesabınıza mail atar. Geçici çözümdür,
> yayına uygun değildir.

---

## 6. Upstash — hız sınırı

1. [upstash.com](https://upstash.com) → Redis → Create database
2. Bölge: Frankfurt
3. **REST URL** ve **REST Token** değerlerini Netlify'a ekleyin

---

## 7. Sentry — hata izleme

1. [sentry.io](https://sentry.io) hesabı, yeni Next.js projesi
2. Kurulum sihirbazının verdiği DSN'i not edin
3. Aşama 3'ün kod tarafında bağlanacak

---

## Kabul kriterleri

Bu aşama şunlar sağlandığında biter:

- [ ] `v2` dal dağıtımı Netlify'da başarıyla derleniyor
- [ ] Önizleme adresinde ana sayfa açılıyor ve Vergi Takvimi görünüyor
- [ ] `/araclar` sayfasında hesaplayıcı çalışıyor
- [ ] `/api/calendar` `.ics` dosyası indiriyor
- [ ] İletişim formu gerçek bir e-posta gönderiyor ve Neon'a kayıt düşüyor
- [ ] GitHub Actions CI yeşil
- [ ] Lighthouse: 4 kategoride ≥ 95

## Geçiş (bu aşamanın en sonu)

Yukarıdakilerin hepsi tamamsa ve önizlemeyi gözünüzle onayladıysanız:

1. `v2` → `main` birleştirilir
2. Netlify üretim dağıtımı tetiklenir
3. futuristax.com yeni siteye geçer
4. Eski site `legacy/index.html` olarak repoda kalır

**Bu adımı acele etmeyin.** Önizlemede her şeyi tek tek gezip onaylamadan
birleştirmeyin.

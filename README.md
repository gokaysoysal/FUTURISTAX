# FuturistaX Advisory — Web Platformu

Mevcut tek dosyalık `index.html` prototipinin yerini alacak kurumsal web platformu.

---

> **Devam eden çalışma:** Nerede kalındığı, sıradaki iş ve açık kararlar için
> [`docs/PROJECT-STATUS.md`](docs/PROJECT-STATUS.md) dosyasına bakın.

## Durum

Bu depo **Aşama 2 sonu** durumundadır (12 aşamalık planın 2'si tamam). Aşağıdaki tablo
neyin hazır, neyin bekliyor olduğunu dürüstçe gösterir.

| Alan | Durum | Not |
|---|---|---|
| Monorepo yapısı (pnpm + Turborepo) | ✅ Hazır | |
| `packages/config` — tek doğruluk kaynağı | ✅ Hazır | Firma bilgileri, env şeması |
| `packages/tax-engine` — hesaplama motoru | ✅ Hazır | 9 hesaplayıcı, **48 test geçiyor, %100 satır kapsamı** |
| Vergi takvimi + `.ics` beslemesi | ✅ Hazır | Resmî tatil kaydırması eksik |
| Tasarım tokenları (koyu + açık tema) | ✅ Hazır | Tüm kontrastlar AA doğrulandı |
| İletişim API'si (doğrulama, rate limit, e-posta) | ✅ Hazır | DB kaydı eklenecek |
| TCMB kur servisi | ✅ Hazır | CoinGecko/kripto proxy kaldırıldı |
| CSP + güvenlik başlıkları | ✅ Hazır | Nonce tabanlı |
| Header / Footer / Ana sayfa / Araçlar / İletişim | ✅ Hazır | |
| CI pipeline + performans bütçesi | ✅ Hazır | Lighthouse eşikleri zorlanıyor |
| E2E + axe testleri | ✅ Hazır | |
| Turnstile widget bağlantısı | ✅ Hazır | İstemci + sunucu bağlandı |
| Lead veritabanı (Drizzle + Neon) | ✅ Hazır | KVKK rıza kanıt zinciri dahil |
| Çerez onay bandı | ✅ Hazır | Onaysız analitik yüklenmez |
| 404 / hata sınırı sayfaları | ✅ Hazır | |
| Kalan 8 hesaplayıcı sayfası | ⏳ Bekliyor | Motor hazır, sadece UI |
| CMS (Sanity) | ⏳ Faz 2 | |
| Hizmet/sektör alt sayfaları | ⏳ Faz 2 | |
| KVKK / gizlilik / çerez metinleri | ⚠️ Taslak | Sayfalar hazır, **hukukçu onayı bekliyor** — taslakken indekslenmiyor |
| RAG chatbot | ⏳ Faz 4 | |
| İngilizce içerik | ⏳ Faz 4 | İskelet hazır |

---

## Kurulum

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # değerleri doldurun
pnpm dev
```

Testler:

```bash
pnpm test          # birim testleri + kapsam
pnpm test:e2e      # Playwright + axe
pnpm typecheck
```

---

## Mimari kararlar

**Vergi mantığı UI'dan tamamen ayrı.** `packages/tax-engine` saf TypeScript'tir:
ağ erişimi yapmaz, tarih okumaz, rastgelelik içermez. Her hesaplayıcı
`(input, rates) => Result` imzasındadır. Bu sayede tamamı deterministik test
edilebilir ve oran değişikliği tek bir dosyadan yapılır.

**Oranlar kaynak bilgisiyle birlikte taşınır.** Her `RateSet` bir `provenance`
alanı içerir. Bir yılın değerleri resmî kaynaktan teyit edilmemişse
`verified: false` olur ve UI kullanıcıya görünür bir uyarı gösterir.
Doğrulanmamış veri hiçbir zaman doğruymuş gibi sunulmaz.

**Uydurma resmî içerik üretilmez.** Eski sitede GİB duyuru başlıkları bir dil
modeline ürettiriliyor ve gerçek duyuruymuş gibi listeleniyordu. Bu kaldırıldı.
Dış kaynak erişilemediğinde "şu an güncellenemiyor" durumu gösterilir.

**Sırlar sunucuda kalır.** Eski sitede Anthropic API'si doğrudan tarayıcıdan
çağrılıyordu. Tüm AI ve ücretli servis çağrıları artık API route üzerinden geçer.

---

## Cevap bekleyen sorular

Bu kalemler teknik değil iş kararıdır; uydurulmamıştır:

1. **Doğrulanmamış istatistikler.** "%98 başarı oranı", "150+ aktif müşteri",
   "%30 vergi optimizasyonu" iddialarının ölçüm metodolojisi nedir? TÜRMOB
   reklam/tanıtım kısıtları açısından meslek odanızla teyit edilmeli.
   Şu an `unverifiedClaims.publish = false` — yayınlanmıyor.
2. **CMS tercihi.** İçeriği kendiniz mi yöneteceksiniz (→ Sanity),
   yoksa geliştirici üzerinden mi (→ dosya tabanlı MDX yeterli olabilir)?
3. **Vergi oranları.** 2024 ve 2025 tabloları yer tutucudur. Her kalemin
   resmî kaynaktan teyidi gerekiyor. 2026 değerleri henüz girilmedi.
4. **Referanslar.** Mevcut sitedeki müşteri yorumları için yazılı izin var mı?
5. **KVKK metinleri.** Aydınlatma metni ve çerez politikası taslakları hukukçu
   onayından geçmeli; şablon metin kullanılmamalı.

---

## Yol haritası

Ayrıntılı faz planı için: `docs/architecture.md` ve kök dizindeki inşa şartnamesi.

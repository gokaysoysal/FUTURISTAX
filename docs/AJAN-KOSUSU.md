# Claude Code — tek koşu

> Kalan tüm inşa işi tek oturumda. Aşağıdaki bloğu olduğu gibi Claude Code'a
> yapıştırın.

---

## Önce hazırlık (5 dakika)

**1.** `claude-code-hazirlik.zip` içindeki `CLAUDE.md` ve `docs/PROJECT-STATUS.md`
dosyalarını depoya koyup push edin. Ajan bunları okuyacak.

**2.** Ayrı bir dalda çalışın:

```
git checkout v2
git pull
git checkout -b tam-insa
claude
```

**3.** Aşağıdaki promptu yapıştırın.

---

## PROMPT — bunu kopyalayın

```
Bu depoda büyük bir inşa turu yapacağız. Önce CLAUDE.md ve
docs/PROJECT-STATUS.md dosyalarını oku; kurallar, mimari, tasarım yönü ve
nerede kalındığı orada yazılı.

Sekiz bölüm halinde ilerle. HER BÖLÜM SONUNDA:
  pnpm typecheck && pnpm test && pnpm build
çalıştır, geçmesini sağla, sonra o bölümü ayrı bir commit olarak kaydet.
Bir bölüm kırmızıyken sonrakine geçme. Bu, bir şey ters giderse geri
dönebileceğimiz noktalar bırakır.

────────────────────────────────────────
BÖLÜM 1 — İçerik altyapısı

src/lib/data/ altında tipli içerik sabitleri kur: services.ts, sectors.ts,
faq.ts, team.ts, testimonials.ts. Yapıyı ileride CMS'e taşınabilecek şekilde
tasarla (her kayıt slug, seo alanları ve ilişkiler taşısın).

Her hizmet ve sektör için Türkçe taslak metin yaz: 1 paragraf özet, 3-5
alt başlıklı gövde, 3 SSS, ilgili hizmet/sektör bağlantıları. Metinler
gerçekçi ve mesleki olsun ama SOMUT SAYI, ORAN veya MEVZUAT ATIFI UYDURMA
— genel çerçeveden yaz. İçerik sonradan firma tarafından revize edilecek,
bunu bir yorum satırıyla belirt.

Hizmetler: vergi danışmanlığı, vergi denetimi ve risk analizi, finansal
danışmanlık, mali mevzuat uyumu, kurumsal raporlama, uluslararası
vergilendirme, kurumsal yapılandırma, yatırım teşvik yönetimi, bağımsız
denetim desteği.

Sektörler: imalat, inşaat ve gayrimenkul, bilişim ve yazılım, sağlık,
perakende ve e-ticaret, lojistik, hizmet ve danışmanlık.

────────────────────────────────────────
BÖLÜM 2 — Sayfalar

Şu rotaları oluştur:
  /hizmetler ve /hizmetler/[slug]   (hub + 9 sayfa)
  /sektorler ve /sektorler/[slug]   (hub + 7 sayfa)
  /kurumsal, /sss, /referanslar, /kariyer

Her sayfa: kendi metadata'sı, canonical, JSON-LD (Service,
BreadcrumbList, FAQPage), ilgili içerik bağlantıları ve CTA.
sitemap.ts'i dinamik yap, tüm yeni yolları kapsasın.

unverifiedClaims.publish false olduğu sürece doğrulanmamış istatistikleri
(%98 başarı oranı vb.) hiçbir sayfada render etme.

Mevcut tasarım tokenlarını kullan; yeni renk veya font ekleme.

────────────────────────────────────────
BÖLÜM 3 — Vergi takviminde resmî tatil kaydırması

Bu, canlı önizlemede fark edilen gerçek bir hata: takvim "Ba-Bs formları:
30 Ağustos 2026" gösteriyor, o gün hem pazar hem Zafer Bayramı.

packages/tax-engine içine Türkiye resmî tatil tablosu ekle:
- Sabit: 1 Ocak, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos,
  28 Ekim (yarım gün), 29 Ekim
- Dinî bayramlar yıla göre değişir. 2024-2026 tarihlerinden EMİN DEĞİLSEN
  veri dosyasında boş bırak, TODO yaz ve bana bildir. Uydurma.
- 1-20 Temmuz mali tatil (5604 sayılı Kanun)

shiftToNextBusinessDay(date) yardımcısı yaz — VUK Md. 18: son gün tatile
veya hafta sonuna denk gelirse süre takip eden ilk iş gününün sonuna uzar.

getUpcomingDeadlines bunu uygulasın. Kaydırma senaryoları için test yaz,
özellikle 30 Ağustos 2026.

TaxCalendarPanel altbilgisindeki "tatil kaydırması uygulanmamaktadır"
uyarısını kaldır. docs/decisions/0003-holiday-shift.md dosyasını "kapandı"
olarak güncelle.

────────────────────────────────────────
BÖLÜM 4 — Hesaplayıcılar

/araclar/[slug] rotası aç. Mevcut VehicleExpenseCalculator ve ResultLedger
desenini kullanarak sekiz hesaplayıcı daha üret: KDV, gelir vergisi,
kurumlar vergisi, binek araç kira sınırı, SGK işveren maliyeti, kıdem
tazminatı, TÜFE güncelleme, kur çevirici.

packages/tax-engine içindeki fonksiyonları kullan — YENİ HESAPLAMA MANTIĞI
YAZMA. Motor hazır ve testli.

Her hesaplayıcıya HowTo ve FAQPage şeması. Kur çevirici /api/rates
üzerinden TCMB verisini kullansın; servis erişilemezse "güncellenemiyor"
göster, uydurma kur üretme.

/araclar hub sayfasını tüm araçları listeleyecek şekilde güncelle.

────────────────────────────────────────
BÖLÜM 5 — Form dayanıklılığı

İletişim formunda bilinen bir sorun var: Turnstile yüklenemezse form
tamamen kilitleniyor ve kullanıcı yanıltıcı bir mesaj görüyor. Bir
danışmanlık sitesinde bu doğrudan lead kaybı demek.

Jeton alınamadığında form yine gönderilebilsin. Sunucu tarafında jetonsuz
gelen istekleri daha katı ele al: hız sınırını sıkılaştır, bal küpü ve
alan doğrulamasını koru, kaydı "doğrulanmamış" olarak işaretle.
Reddetme; işaretle.

────────────────────────────────────────
BÖLÜM 6 — Mevzuat merkezi

/mevzuat altında makale listesi, kategori filtresi ve detay sayfası kur.
İçerik şimdilik src/lib/data/ altında; CMS'e taşımaya hazır yapıda olsun.

Gerçek GİB / Resmî Gazete beslemesi ekle: server-side fetch + ISR
(revalidate 3600). Kaynak erişilemezse "şu an güncellenemiyor" durumu
göster.

UYARI: Bu projenin birinci kuralı, eski sitede bir dil modeline uydurma
GİB duyurusu ürettirilip gerçekmiş gibi yayınlanmasından doğdu. Besleme
çalışmadığında ASLA yedek içerik üretme.

────────────────────────────────────────
BÖLÜM 7 — Teknik borç temizliği

1. next-intl: getRequestConfig içinde locale yerine await requestLocale.

2. CSP'yi doğru kur. docs/decisions/0004-csp-nonce.md dosyasını oku —
   neden kaldırıldığı ve nasıl kurulacağı orada. next-intl middleware'i ile
   Next.js nonce mekanizmasını birleştir. Önce Content-Security-Policy-
   Report-Only ile yayınla.

   e2e/hydration.spec.ts testleri React'in gerçekten devreye girdiğini
   doğruluyor. CSP açıkken de geçmeliler — geçmiyorsa CSP yanlıştır,
   testi değil CSP'yi düzelt.

3. pnpm lint hatalarını temizle. Erişilebilirlik kurallarını bastırma,
   gerçekten düzelt.

4. Playwright kapsamını genişlet: yeni sayfalar için axe taraması ekle.

────────────────────────────────────────
BÖLÜM 8 — Tasarım derinleştirme

CLAUDE.md'de tanımlanan "mali belge estetiği" ekranda henüz karşılığını
bulmadı. Şu an site temiz ama karaktersiz: defter çizgileri, milimetrik
ızgara ve tasdik motifi yok, aksan rengi jenerik bir SaaS mavisine yakın.

Yap:
- Defter çizgilerini veri bağlamlarında görünür kıl (takvim, hesaplayıcı
  sonuç tablosu, karşılaştırma tabloları). Dekoratif kullanma.
- Sayfa yüklenme koreografisi ve scroll reveal ekle, Motion ile.
  prefers-reduced-motion altında tamamen kapansın.
- Boş durumlar ve hata durumları için tutarlı bir görsel dil.

Aksan rengini değiştirmek istersen ÖNCE öner, uygulama. Renk değişikliği
tasarım kararıdır ve onay ister.

────────────────────────────────────────
BİTİRİRKEN

- docs/PROJECT-STATUS.md dosyasını güncelle: ne yapıldı, ne kaldı.
- Emin olamadığın veya karar gerektiren her şeyi "cevap bekleyen kararlar"
  bölümüne yaz. Tahmin etme.
- Özet çıkar: hangi bölümler tamam, hangileri kısmen, nerede takıldın.

YAPMA:
- main dalına dokunma. Canlı site oradan yayınlanıyor.
- Vergi oranlarını değiştirme veya "doğrulanmış" işaretleme. Yer tutucu
  değerler bilinçli; firma sonradan revize edecek.
- UnverifiedRatesNotice bileşenini kaldırma veya bastırma.
- LEGAL_TEXTS_APPROVED değerini true yapma.
- Testleri geçsin diye gevşetme. Test kırmızıysa kodu düzelt.
```

---

## Koşu sırasında

Ajan izin isteyecek. "Accept all" moduna almak hızlandırır ama gözden
geçirmeyi zorlaştırır. Bölüm bölüm commit atacağı için kabul edilebilir bir
risk — ters giderse `git reset --hard` ile bir önceki bölüme dönersiniz.

Uzun sürecek. Arada durursa "devam et" demeniz yeterli.

## Koşu bittiğinde

```
pnpm dev
```

ile yerelde gezin. Sonra push edin, Netlify önizleme derlemesi çıksın.

Sonra bana gelin: ajanın özetini ve önizleme adresini paylaşın. Çıktıyı
dışarıdan bir gözle değerlendirir, nelerin eksik veya yanlış olduğunu
söylerim.

## Sonraya kalanlar

Bunlar bilinçli olarak erteleniyor:

| Konu | Ne zaman |
|---|---|
| Vergi oranlarının doğrulanması | İnşa bitince, firma tarafından |
| Hizmet metinlerinin revizyonu | İnşa bitince |
| İstatistik iddialarının teyidi | TÜRMOB açısından, yayından önce |
| KVKK metinlerinin hukukçu onayı | Yayından önce |
| CMS'e geçiş | İçerik netleşince |
| `v2` → `main` geçişi | Yukarıdakiler tamamlanınca |

**Geçişi erken yapmayın.** Doğrulanmamış vergi oranlarını önizlemede
göstermek sorun değil; futuristax.com'da göstermek başka bir şey.

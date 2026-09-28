# Claude Code — interaktif arka plan, ızgara temizliği, gerçek içerik

> Ajana: "docs/V10-ICERIK-ARKAPLAN.md dosyasını oku ve içindeki kod bloğunu uygula."

---

```
Sen kıdemli bir full-stack developer ve UI/UX tasarımcısısın. Üç iş var,
sırayla. Karar noktalarında bana sorma, en iyi kararı ver.

────────────────────────────────────────
İŞ 1 — Arka planı interaktif yap (mouse'a duyarlı)

V9'da kurulan ogl tabanlı Orb sahnesi scroll'a duyarlı çalışıyor ve
beğenildi. Şimdi mouse hareketine de tepki vermesi isteniyor.

1. claude-in-chrome ile şu an deploy-preview-1--futuristax.netlify.app
   adresini aç, mevcut sahneyi gözlemle.
2. Mouse imleci pozisyonunu (normalize edilmiş -1..1 veya 0..1) sahneye
   ikinci bir uniform/prop olarak ekle. Sahne imlece doğru hafifçe
   çekilsin veya bükülsün (magnetic/parallax hissi) — scroll'un verdiği
   ana hareketin ÜSTÜNE binen ikincil bir katman olsun, onu ezmesin.
3. Hareket sönümlü (damped lerp) olsun, imleç ani sıçramasında sahne
   de sıçramasın.
4. Dokunmatik cihazlarda (mouse yok) bu katman devre dışı kalsın,
   yalnızca scroll etkisi çalışsın.
5. prefers-reduced-motion: reduce altında mouse etkileşimi de kapansın.
6. claude-in-chrome ile kendi sitende mouse'u hareket ettirerek GÖZLE
   doğrula. Referans hâlâ https://futureoffinance.peachweb.io/ — ama
   birebir kopya değil, kendi imza hareketimiz olsun.

────────────────────────────────────────
İŞ 2 — Sahte ızgara çizgilerini kaldır

Mevzuat merkezi başlığının bulunduğu bölümde (ve muhtemelen diğer
sayfa başlıklarında) yatay ince çizgilerden oluşan bir ızgara deseni
görünüyor — istenmiyor, kaldırılacak.

1. SectionIntro veya benzer başlık bileşenini bul, arka planında
   ızgara/grid deseni üreten CSS'i (background-image ile tekrarlanan
   linear-gradient, veya ayrı bir .grid-overlay katmanı) tespit et.
2. TÜM sayfalarda kaldır — yalnızca mevzuat sayfasında değil, aynı
   bileşen her yerde kullanılıyorsa hepsinde.
3. Kaldırdıktan sonra claude-in-chrome ile en az 4 farklı sayfada
   (ana sayfa, mevzuat, hizmetler, iletişim) başlık bölgesinin temiz
   olduğunu GÖZLE doğrula.

────────────────────────────────────────
İŞ 3 — Gerçek içerikle doldur (tüm sayfalar)

Şu an sitede yer tutucu/taslak metin var. Bunun yerine firmanın kendi
yayınladığı GERÇEK içeriği kullan — aşağıda kaynağıyla birlikte veriyorum,
tekrar fetch etmene gerek yok, ama emin olmadığın bir noktada
https://www.futuristax.com adresini claude-in-chrome veya WebFetch ile
kontrol edebilirsin.

── FİRMA BİLGİLERİ ──
Marka: FuturistaX Advisory
Slogan: Strategic Tax & Financial Solutions / "Türkiye'nin Fütüristik
  Mali Danışmanlık Firması"
Kuruluş: 2013, Ankara
Adres: Gaziosmanpaşa Mah. Bülten Caddesi 72, Çankaya / Ankara
E-posta: info@futuristax.com
Telefon: +90 545 289 9838
Kurucu: Gökay Soysal — Vergi Danışmanı · Kurucu, SMMM / Vergi Danışmanı /
  Mali Denetçi. "Stratejik vergi planlaması, denetim ve mali mevzuat
  uyumu konularında 12+ yıl deneyimi. Kurumlar vergisi, KDV yapılandırması
  ve uluslararası vergilendirme alanlarında özelleşmiş çözümler."

── ZAMAN ÇİZELGESİ (kurumsal sayfada kullan) ──
2013 — Kuruluş: Ankara'da bağımsız vergi danışmanlığı ofisi olarak
  faaliyete başlandı. İlk müşteriler KOBİ segmentinden edindi.
2016 — Genişleme: Kurumsal müşteri portföyü oluşturuldu. Finansal
  danışmanlık ve uyum hizmetleri portföye eklendi.
2020 — Dijital Dönüşüm: Dijital vergi çözümleri ve uzaktan danışmanlık
  modeli hayata geçirildi. E-arşiv entegrasyon hizmetleri başlatıldı.
2023 — FuturistaX Markası: Yeniden markalama süreciyle FuturistaX
  Advisory kimliği oluşturuldu.

── 9 HİZMET (mevcut hizmet listesiyle eşleştir, sırayı koru) ──
1. Vergi Danışmanlığı — İşletmenizin faaliyet yapısına ve sektör
   dinamiklerine uygun, teknik açıdan güçlü vergi stratejileri.
   Kurumlar vergisi, gelir vergisi ve KDV planlaması dahildir.
2. Vergi Denetimi & Risk — Olası mali riskleri önceden tespit eden,
   mevzuata tam uyumlu yapı oluşturma. Vergi incelemelerine hazırlık
   ve itiraz süreçleri yönetimi.
3. Finansal Danışmanlık — Karar alma süreçlerini güçlü analitik
   zemine oturtarak finansal operasyonlarda verimliliği maksimize
   ediyoruz. Nakit akışı ve bütçe yönetimi dahildir.
4. Mali Mevzuat Uyumu — Değişen regülasyonlar karşısında şirketinizin
   güncel ve uyumlu kalmasını sağlayarak cezai riskleri minimize
   ediyoruz.
5. Kurumsal Raporlama — Uluslararası standartlarda (TFRS/IFRS)
   finansal raporlama ve detaylı değerlendirme süreçleri.
6. Stratejik Yapılandırma — Şirket birleşmeleri, devir işlemleri ve
   kurumsal yapılandırmada vergi odaklı optimum çözümler. KVK Madde 19
   kapsamlı hizmet.
7. Uluslararası Vergilendirme — Yurt dışı yatırım ve işlemler için
   çifte vergilendirmeyi önleme anlaşmaları kapsamında danışmanlık.
   Transfer fiyatlandırması belgelendirme.
8. SGK & İşçi Mevzuatı — Sosyal güvenlik prim teşvikleri, işçilik
   maliyeti optimizasyonu ve iş hukuku uyum süreçlerinde bütünleşik
   danışmanlık.
9. Yatırım Teşvik Yönetimi — Hazine ve Maliye Bakanlığı teşvik
   belgelerinin alınması, uygulanması ve denetimi. KDV istisnası,
   vergi indirimi ve sigorta primi desteği süreçleri.

── SEKTÖRLER — DİKKAT: 8 SEKTÖR, ÖNCEKİ VARSAYIM 7'YDİ ──
CLAUDE.md ve mevcut kodda 7 sektör varsayılmıştı. Gerçek kaynakta 8
sektör var. Kodu buna göre genişlet, sektör sayısını her yerde
(StatsRow, rakamlar bölümü dahil) 8 olarak güncelle.
1. Teknoloji & Bilişim — Ar-Ge indirimleri, teknokent istisnaları ve
   yazılım ihracatı vergi süreçlerinde uzman rehberlik. (Ar-Ge,
   Teknokent)
2. Üretim & Sanayi — Yatırım teşvik belgesi uygulamaları, KDV iadeleri
   ve ihracat vergi avantajlarının etkin yönetimi. (Teşvik, KDV İadesi)
3. E-Ticaret & Perakende — Uluslararası vergilendirme, dijital hizmet
   vergisi ve lojistik maliyet analizi. Marketplace komisyon
   vergilemesi. (DVHB, B2C)
4. Gayrimenkul & İnşaat — Yıllara sâri inşaat onarım işleri, değer
   artış kazançları ve KDV istisnaları. Proje bazlı maliyet
   muhasebesi. (İnşaat, KDV)
5. Finans & Sermaye Piyasaları — Yatırım araçlarının vergilendirilmesi,
   fon yapılandırması ve BIST işlem vergi optimizasyonu. (BIST, Fon)
6. Sağlık & Eczacılık — Hastane ve klinik gelir-gider optimizasyonu,
   hekim ortaklık yapıları ve tıbbi cihaz ithalat vergi planlaması.
   (Sağlık, Klinik)
7. Tarım & Gıda — Tarımsal üretim istisnalarından yararlanma, çiftçi
   muafiyetleri ve agro-sanayi yatırım teşvikleri. (İstisna, Agro)
8. Enerji & Çevre — Yenilenebilir enerji yatırımları, YEKA teşvikleri
   ve karbon vergisi hazırlık süreçleri danışmanlığı. (Yenilenebilir,
   ESG)

── SSS (İki kategoride, /sss sayfasında kullan) ──
Vergi & Danışmanlık:
Q: Vergi danışmanı ile mali müşavir arasındaki fark nedir?
A: Serbest Muhasebeci Mali Müşavir (SMMM), işletmelerin günlük
   muhasebe kayıtlarını tutar, beyannameleri düzenler ve resmi
   bildirimleri yapar. Vergi danışmanı ise vergi yükünü yasal
   çerçevede minimize eden stratejiler geliştirir: kurumlar vergisi
   yapılandırması, KDV planlaması, teşvik optimizasyonu ve
   uluslararası vergi anlaşmalarından yararlanma bunların başında
   gelir. FuturistaX Advisory her iki hizmeti tek çatı altında
   sunarak müşterilerine hem uyum hem de optimizasyon avantajı sağlar.
Q: Kurumlar vergisi beyannamesi ne zaman verilir?
A: Kurumlar vergisi beyannamesi, hesap döneminin kapandığı ayı izleyen
   dördüncü ayın 1-25. günleri arasında verilir. Takvim yılı esasını
   kullanan kurumlar için bu süre 1–25 Nisan arasıdır. Özel hesap
   dönemi kullananlar (Temmuz–Haziran dönemi gibi) beyannameyi Ekim
   ayında vermek zorundadır.
Q: KDV iadesi süreci nasıl işler?
A: KDV iadesi; ihracat, indirimli oranlı teslimler ve kısmi tevkifat
   gibi işlemlerden kaynaklanabilir. GİB İnteraktif Vergi Dairesi
   üzerinden başvuru yapılır. 10.000 TL altı iadeler teminat/rapor
   aranmaksızın mahsuben yapılabilir. Nakden iadeler için YMM tasdik
   raporu veya vergi inceleme raporu zorunludur.
Q: Transfer fiyatlandırması nedir?
A: Transfer fiyatlandırması, kurumların ilişkili kişilerle (ortaklar,
   bağlı şirketler, yöneticiler) gerçekleştirdiği işlemlerin emsallere
   uygunluk ilkesi çerçevesinde fiyatlandırılmasıdır. KVK Madde 13
   uyarınca yurt içi ilişkili kişi işlemlerinde yıllık 1 milyon TL,
   yurt dışı işlemlerde ise 500.000 TL üzerindeki tutarlar için
   belgeleme hazırlanması zorunludur.

Teşvik & Ar-Ge:
Q: Ar-Ge indirimi kimler için geçerlidir?
A: Ar-Ge indirimi GVK Madde 89/9 ve KVK Madde 10/1-a kapsamında
   uygulanır. Ar-Ge Merkezi kuran firmalar (en az 30 tam zamanlı
   Ar-Ge personeli şartı aranır) harcamalarının %100'ünü vergi
   matrahından indirebilir. Teknokent (TGB) bünyesindeki firmalar da
   aynı imkândan yararlanır.
Q: Yatırım teşvik belgesi nasıl alınır?
A: Yatırım teşvik belgesi, Sanayi ve Teknoloji Bakanlığı'na bağlı
   E-TUYS sistemi üzerinden online başvuru ile alınır. Başlıca
   destekler: makine-teçhizat alımlarında KDV istisnası, ithal
   makinelerde gümrük vergisi muafiyeti, kurumlar vergisi indirimi
   (%40-100 arası yatırıma katkı oranına göre), SGK işveren payı
   desteği ve faiz desteğidir.
Q: Teknokent istisnası nasıl uygulanır?
A: 4691 sayılı Teknoloji Geliştirme Bölgeleri Kanunu kapsamında
   Teknokent firmaları önemli avantajlardan yararlanır: TGB'de elde
   edilen yazılım, tasarım ve Ar-Ge kazançları 31.12.2028 tarihine
   kadar kurumlar/gelir vergisinden istisnadır.
Q: İlk görüşme gerçekten ücretsiz mi?
A: Evet, tamamen ücretsizdir. İlk görüşmede uzman danışmanımız
   şirketinizin mevcut vergi yapısını, risk alanlarını ve
   optimizasyon fırsatlarını değerlendirir. Görüşme yaklaşık 45-60
   dakika sürer ve yüz yüze ya da video konferans yoluyla
   gerçekleştirilebilir.

── KANUN BİLGİ BANKASI (mevzuat merkezinde bağlantı listesi olarak) ──
5520 Sayılı Kanun — Kurumlar Vergisi Kanunu
  → mevzuat.gov.tr/mevzuat?MevzuatNo=5520&MevzuatTur=1&MevzuatTertip=5
193 Sayılı Kanun — Gelir Vergisi Kanunu
  → mevzuat.gov.tr/mevzuat?MevzuatNo=193&MevzuatTur=1&MevzuatTertip=4
3065 Sayılı Kanun — Katma Değer Vergisi Kanunu
  → mevzuat.gov.tr/mevzuat?MevzuatNo=3065&MevzuatTur=1&MevzuatTertip=5
213 Sayılı Kanun — Vergi Usul Kanunu
  → mevzuat.gov.tr/mevzuat?MevzuatNo=213&MevzuatTur=1&MevzuatTertip=4
6102 Sayılı Kanun — Türk Ticaret Kanunu
  → mevzuat.gov.tr/mevzuat?MevzuatNo=6102&MevzuatTur=1&MevzuatTertip=5

── UYGULAMA NOTU ──
Bu içerik firmanın kendi yayınladığı gerçek metindir, sen üretmedin —
doğrudan kopyala/uyarla, uydurma. Ama şu rakamlar ("150+ aktif müşteri",
"%98 başarı oranı", "%28 ortalama vergi optimizasyonu", "%82 uzun dönem
ilişki") projenin önceki turlarında TÜRMOB reklam kısıtları açısından
"doğrulanmamış" diye işaretlenmişti. Firma sahibi bu sefer kaynağı kendisi
verdiği için KULLAN, ama packages/config/src/site.ts içindeki
unverifiedClaims yapısını kaldırma — sadece publish alanını bu içerik
için true yapmayı düşün ve docs/PROJECT-STATUS.md'ye "bu rakamlar firma
sahibi tarafından kaynak gösterilerek onaylandı" notu düş.

Referanslar (testimonials) bölümünde de gerçek isim/unvanlar var (Cenk
Yavuz, Esra Yıldız, Murat Kaya) — bunlar da kaynak siteden geliyor,
kullan, "Örnek Müşteri A" gibi yer tutucularla değiştirme.

────────────────────────────────────────
DOĞRULAMA (atlama)

claude-in-chrome ile:
- Ana sayfa, hizmetler, sektörler, mevzuat, SSS, iletişim, kurumsal
  sayfalarını gez
- Işgara çizgilerinin hiçbir yerde kalmadığını doğrula
- Mouse hareketiyle arka planın tepki verdiğini doğrula
- 8 sektörün doğru sayıda ve doğru içerikle göründüğünü doğrula
- Türkçe karakterlerin bozulmadığını doğrula
- Mobilde (390px) de tekrarla

pnpm typecheck && pnpm test && pnpm build yeşil olsun.
docs/PROJECT-STATUS.md güncelle. Commit, v2'ye push.

YAPMA:
- main dalına dokunma
- tax-engine, API, veritabanı şemasını değiştirme
- Vergi Yükü Panosu hatasıyla ilgilenme (ayrı, bilinen bir sorun)
- Vergi oranlarını değiştirme
- Testleri gevşetme
```

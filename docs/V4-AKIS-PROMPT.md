# Claude Code — ana sayfa referansa sadık yeniden inşa

> `git checkout v2 && git pull && git checkout -b v4-akis`
>
> Ajana tek satır: "docs/V4-AKIS-PROMPT.md dosyasını oku ve içindeki kod
> bloğunu uygula."

---

```
Ana sayfayı referans siteye SADIK kalarak yeniden inşa ediyoruz.
Altyapıya dokunmuyoruz: tax-engine, API, veritabanı, form aynen kalıyor.

REFERANS: https://futureoffinance.peachweb.io/
WebFetch ile incele. Bölüm sırasını, ritmini, tipografik hiyerarşisini ve
hareket desenlerini birebir örnek al.

İÇERİK POLİTİKASI — bu koşuya özel:
Firma sahibi gerçek içeriği SONRA girecek. Şimdilik yer tutucu metin,
yer tutucu istatistik ve yer tutucu referans KULLANABİLİRSİN. Amaç
düzenin ve kalitenin oturması.

Ama yer tutucu içerik TEK BİR BAYRAĞIN arkasında toplanacak:
  packages/config/src/site.ts içine CONTENT_IS_PLACEHOLDER = true ekle.
  Tüm yer tutucu içerik src/lib/data/placeholder/ altında toplansın ve
  her dosyanın başında "YER TUTUCU — firma tarafından değiştirilecek"
  yorumu olsun.
Böylece gerçek içerik gelince neyin değişeceği tek bakışta bulunur.

ÜÇ İSTİSNA — bunlar yer tutucu bile olamaz:
1. Sahte GİB duyurusu / tebliğ / sirküler başlığı üretme. Mevzuat
   sayfasındaki yazılar genel editoryal başlıklar olsun, resmî duyuru
   taklidi değil. (Bu proje tam olarak o hatadan doğdu.)
2. Gerçek şirket logosu kullanma (referansta Disney, Prada var — o
   şablonun dolgusu, telif sorunu). Logo şeridi için soyut SVG marka
   işaretleri üret.
3. Referans yorumlarında icat edilmiş kişi/şirket adı kullanma.
   Bunun yerine "Örnek Müşteri A · İmalat sektörü" biçimini kullan —
   düzende aynı görünür, sonradan değiştirmesi kolaydır.

Vergi oranlarına dokunma, UnverifiedRatesNotice'ı kaldırma.

────────────────────────────────────────
BÖLÜM 1 — Hareket ritmi altyapısı

Referansın kalitesi efekt çeşitliliğinden değil, DİSİPLİNDEN geliyor.
Merkezî sistem kur: src/lib/motion/

- Tek easing ailesi (expo.out türevleri), her yerde aynısı
- Süre ölçeği: hızlı 200ms / normal 600ms / sahne 1200ms
- Stagger sabiti: 60-80ms
- Tüm reveal'lar aynı yönden, aynı mesafeden (24px alttan + opaklık)

Farklı bölümlerde farklı easing veya farklı yön KULLANMA.

Lenis lerp ~0.1. prefers-reduced-motion altında hiç başlatma.

────────────────────────────────────────
BÖLÜM 2 — Ana sayfa bölümleri (referans sırasıyla)

Referanstaki sırayı koru, içeriği FuturistaX'e uyarla:

1. HERO
   Büyük display başlık (Türkçe), alt başlık, iki CTA. Başlığın
   etrafında 4 yüzen kart — mevcut WebGL sahnesinin önünde. Kartlar
   imleçle parallax yapsın, sürekli yavaş sürüklensin. Kartlarda gerçek
   veri olsun: sıradaki beyanname tarihi, güncel kur, bir hesaplama
   sonucu.
   Başlık split-type ile kelime kelime girsin. TÜRKÇE KARAKTERLERİN
   (ı, İ, ğ, ş, ç, ö, ü) bölünmede bozulmadığını kontrol et.

2. ÇÖZÜMLER
   Etiket + büyük başlık + iki buton + açıklama + geniş pano görseli.
   Pano olarak gerçek bir dashboard bileşeni render et (hesaplama
   sonucu + grafik), statik resim değil.

3. LOGO ŞERİDİ
   Sonsuz yatay kayan şerit. Soyut SVG marka işaretleri üret (gerçek
   şirket logosu değil). Üstünde "Çalıştığımız sektörler" etiketi.

4. ÖZELLİKLER
   Üç kart, her birinde görsel + başlık + kısa açıklama.
   Karşılığı: Vergi planlaması / Mevzuat uyumu / Risk analizi

5. TEMEL YETENEKLER — PİNLENMİŞ BÖLÜM (imza hareket)
   Referansın en güçlü deseni. GSAP ScrollTrigger ile:
   - Bölüm viewport'a pinlenir
   - Solda içerik blokları sırayla değişir, sağda görsel değişir
   - 01 / 02 / 03 numaralandırma sayaç gibi ilerler
   - Altta ince ilerleme göstergesi
   Üç adım: Analiz → Yapılandırma → Sürekli takip

   KLAVYE: pin klavye kullanıcısını hapsetmesin, Tab ile çıkılabilsin.
   reduced-motion altında pin kalksın, bloklar alt alta dizilsin.

6. HİZMETLER
   Dört kart, ikon/vektör görselli. Mevcut 9 hizmeti dört gruba topla.

7. RAKAMLAR
   Dört büyük sayaç. Görünüre girince sayarak animasyon.
   GERÇEK veriler kullan: kuruluş yılı 2013, 9 hizmet, 7 sektör,
   9 hesaplama aracı. Yüzde uydurmana gerek yok — gerçek sayılar zaten
   var ve daha inandırıcı.

8. REFERANSLAR
   Üç kart. "Örnek Müşteri A · İmalat sektörü" biçiminde, avatar yerine
   soyut geometrik işaret. Metinler yer tutucu.

9. ÇALIŞMA MODELİ (referanstaki fiyat tablosunun karşılığı)
   Üç kart, aynı görsel düzen. Fiyat yerine kapsam: tek seferlik
   danışmanlık / sürekli mutabakat / proje bazlı yapılandırma.
   Her kartta dört madde ve bir CTA. Fiyat yazma.

10. KAPANIŞ CTA
    Büyük başlık + iki buton.

11. FOOTER + sağ altta scroll ilerleme yüzdesi

────────────────────────────────────────
BÖLÜM 3 — Mevzuat ve haberler ayrı sekmede

Ana sayfada mevzuat/haber bölümü OLMASIN. Bunlar /mevzuat altında:
- Makale listesi, kategori filtresi, detay sayfası
- 5-6 yer tutucu editoryal yazı (genel başlıklar, resmî duyuru taklidi
  değil)
- Gerçek besleme altyapısı hazır dursun ama şimdilik kapalı

────────────────────────────────────────
BÖLÜM 4 — Mikro etkileşimler

Referansta tutarlı biçimde var, hepsini uygula:
- Butonlarda ok ikonu, hover'da sağa kayar
- Kartlarda hover'da yükselme + kenar parıltısı
- Bağlantılarda alt çizgi soldan sağa açılır
- Sağ altta scroll ilerleme yüzdesi
- Birincil butonlarda hafif manyetik çekim

Hepsi Bölüm 1'deki easing ve süre ölçeğini kullansın.

────────────────────────────────────────
BÖLÜM 5 — Sayfa geçişleri

Rota değişiminde perde geçişi: mevcut sayfa maskelenerek çıkar, yeni
sayfa altından açılır. View Transitions API varsa onu kullan, yoksa
Motion ile yedek. Geçiş sırasında sayfa başlığı kısa süre görünsün.

Geçiş 400ms'i geçmesin. reduced-motion altında geçiş yok.

────────────────────────────────────────
BÖLÜM 6 — Diğer sayfalar

Ana sayfadaki dili tüm sayfalara taşı: hizmet ve sektör detayları,
kurumsal, araçlar, mevzuat, SSS, iletişim. Aynı SectionIntro kalıbı,
aynı ritim.

Hesaplayıcı çalışma alanı zaten kuruldu — yapısına dokunma, sadece yeni
görsel dile uyarla.

────────────────────────────────────────
BİTİRİRKEN

- pnpm typecheck && pnpm test && pnpm build yeşil
- axe sıfır ihlal, klavye akışları test edilmiş
- Ana sayfa ilk yük JS 220 kB altında
- docs/PROJECT-STATUS.md ve CLAUDE.md güncelle
- YER TUTUCU İÇERİK LİSTESİ çıkar: hangi dosyada ne var, firma neyi
  değiştirecek. docs/YER-TUTUCU-ICERIK.md olarak yaz.

YAPMA:
- main dalına dokunma
- tax-engine, API, veritabanı şemasını değiştirme
- Vergi oranlarını değiştirme veya doğrulanmış işaretleme
- UnverifiedRatesNotice'ı kaldırma
- Sahte GİB duyurusu veya tebliğ başlığı üretme
- Gerçek şirket logosu kullanma
- Referanslarda icat edilmiş kişi/şirket adı kullanma
- Fiyat yazma
- Testleri gevşetme
```

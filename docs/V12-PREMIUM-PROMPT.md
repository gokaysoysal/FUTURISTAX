# Claude Code — V12: yumuşak sahne + premium tipografi ve yüzeyler

> Ajana: "docs/V12-PREMIUM-PROMPT.md dosyasını oku ve içindeki kod bloğunu uygula."

---

```
Sen kıdemli bir tasarım mühendisisin. İki iş, sırayla: (A) arka plan
sahnesinin keskin kenarlarını yumuşat, (B) sitenin tipografisini ve
yüzeylerini çok premium bir seviyeye çıkar. İçerik ve sayfa yapısı
DEĞİŞMEZ; yalnızca sunum. Karar noktalarında bana sorma.

════════════════════════════════════════
BÖLÜM 0 — Hazırlık ve "önce" görüntüleri

1. git checkout v2 && git pull && git checkout -b v12-premium
   git tag v2-oncesi-v12 && git push origin v2-oncesi-v12
2. Değişiklikten ÖNCE ekran görüntüsü al (Playwright, sahneyi V11'de
   olduğu gibi yakalayabildin): ana sayfa en üst, %25, %50, %75, en alt;
   ayrıca /hizmetler, /araclar, /iletisim. 1440 ve 390 genişlik.
   docs/qa/onceki/ altına kaydet.
3. Mevcut e2e/axe sonucunu kaydet (kırmızı test listesi). Sonunda
   kırmızı sayısı ARTMAYACAK; dokunduğun bileşenlerle ilgili kontrast
   hatalarını düzelt.
4. docs/qa/ altında başka sitenin (referans) karelerini içeren hiçbir
   görsel commit edilmeyecek; gerekirse .gitignore'a ekle.

════════════════════════════════════════
BÖLÜM 1 — Dört skill'i kullan (kurallarıyla)

Kurulu skill'ler: design-dna, frontend-design, design-taste-frontend,
scrollcraft. Önce dördünün SKILL.md dosyalarını oku, ne yaptıklarını
docs/TASARIM-KARARLARI.md'ye 3-4 cümleyle yaz, sonra uygula.

- design-taste-frontend: ayarları DESIGN_VARIANCE=4 (yapı sabit),
  MOTION_INTENSITY=6, VISUAL_DENSITY=3 (ferah, premium) yap. Skill'de
  adlar farklıysa karşılığını kullan.
- design-dna: futureoffinance.peachweb.io için çalıştır (Playwright
  MCP yoksa ekran görüntüleri + WebFetch ile elle analiz et). Çıkan
  tipografi, boşluk ve yüzey İLKELERİNİ kullan; kod, asset, metin
  kopyalama. CLAUDE.md'ye ekleyeceği bölüm mevcut kuralları EZMESİN.
- scrollcraft: scroll'un anlamlı olması ve "tasarım tabanı" (okunur
  kontrast, ritim) ilkelerini uygula. Sayfa dilbilgisini/bölüm sırasını
  DEĞİŞTİRME; imza hareket bu sitede zaten var (arka plan sahnesi +
  Vergi Takvimi), yeni imza icat etme, mevcut olanı incelt. Skill'in
  röportaj adımlarını bu prompta bakarak KENDİN cevapla.
- frontend-design: genel kalite ve "şablon gibi durmama" için.

Skill'ler bu prompttaki kurallarla çelişirse BU PROMPT kazanır
(palet, sayfa yapısı, erişilebilirlik, performans bütçesi, uydurma
içerik yasağı).

GÜVENLİK: Bu skill'ler üçüncü taraf. Yalnızca talimat metinlerini
(SKILL.md ve referans .md dosyaları) kullan. İçlerindeki çalıştırılabilir
script'leri (.py .cjs .sh .js), önce okuyup zararsız olduğunu görmeden
çalıştırma; ağa çıkan, dosya silen, paket kuran hiçbirini çalıştırma.

════════════════════════════════════════
BÖLÜM 2 — Arka planı yumuşat (küre ve oval)

Ekran görüntüsünde gördüğüm sorunlar: büyük kürenin kenarı basamaklı
(pikselli), silüet çok keskin, orta panelde açık gri dikdörtgen bloklar
ve solda soluk yatay bantlar var.

1. ARTEFAKTLARI BUL VE KALDIR: bloklar ve bantlar; olası sebepler:
   kuantizasyon/hassasiyet, gren örneklemesi, düşük iç çözünürlüğün
   CSS ile büyütülmesi. Masaüstünde iç çözünürlük ölçeği 1 olsun
   (DPR üst sınırı 1.5; düşük ölçek yalnızca mobilde).
2. KENAR YUMUŞATMA: silüetleri smoothstep ile analitik olarak yumuşat
   (piksel türevine göre genişlik, ör. fwidth), min. 2-3px besleme.
3. YUMUŞAK IŞIK: kenar ışığını genişlet ve şiddetini ~%25 kıs; sert
   çizgi yerine geniş, üstel sönümlü bir hale ekle.
4. HAFİF DALGALANMA: iki kürenin silüetinde çok yavaş, düşük genlikli
   dalga (yarıçapın %1.5-3'ü, periyot 12-20 sn). Reduced-motion'da kapalı.
5. IŞIK SÜZMESİ: 2-3 yumuşak, çapraz (~-25°) ışık huzmesi, opaklık
   <= 0.10, bulanık kenarlı; fare ve scroll ile çok yavaş sürüklensin.
6. Scroll yolu, fare tepkisi, gren, vinyet ve performans korunur.
   Metin okunabilirliği bozulmasın (bileşik parlaklık <= 0.15 kuralı).

════════════════════════════════════════
BÖLÜM 3 — Tipografi (premium)

Gözlem: başlıklar ağır ve geniş (Syne), hiyerarşi düz; etiket/başlık/
gövde ritmi zayıf.

- Aile sayısı en fazla 2 + mono. Mevcut Syne + Familjen Grotesk +
  IBM Plex Mono'yu koruyabilir veya daha iyisini seçebilirsin. Aday
  fikirler (HEPSİ Türkçe glif doğrulaması gerektirir): Geist, Manrope,
  Bricolage Grotesque, Hanken Grotesk, Instrument Serif, Fraunces.
- ZORUNLU DOĞRULAMA: ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü. subsets: latin +
  latin-ext. Şu kelimeleri gerçekten render edip kontrol et:
  "İhtiyaca", "yükümlülük", "dönüştürüyoruz", "Çalışma", "Şirket".
- Display: bir ağırlık hafiflet (örn. 600→500), tracking -0.02/-0.03em,
  satır aralığı 1.02-1.1, text-wrap: balance, ölçek clamp() ile, büyük
  boyut kontrastı. Gövde 17-18px, satır aralığı ~1.65, satır uzunluğu
  60-68ch. Etiketler mono, büyük harf, ~0.14em aralık. Rakamlar
  tabular-nums.
- Ölçeği tek yerde tanımla (tokens.css), bileşenler yalnızca token
  kullansın. Font yükü: next/font, değişken, swap, yalnızca gerekli
  ağırlıklar; toplam font <= ~120 kB.

════════════════════════════════════════
BÖLÜM 4 — Yüzeyler ve premium detay

Gözlem: bölüm başlığı sert bir dikdörtgen kutu içinde ("İhtiyaca göre
üç biçim"); kartlar opak ve düz; butonlar düz mavi.

- 3 kademeli cam sistemi (token): yarı saydam dolgu (0.35 / 0.5 /
  0.65) + blur (12 / 18 / 28px) + 1px ince kenar (beyaz ~%9) + üst
  kenarda iç ışık + hafif iç gölge; tutarlı köşe yarıçapları.
- SERT DİKDÖRTGEN SCRIM'LERİ KALDIR: metin arkasına kenarları
  yumuşak (maskelenmiş radial) bir zemin koy. Bileşik parlaklık <= 0.15
  ve 4.5:1 kontrast korunur; en parlak sahne evresinde (p≈0.6) ölç.
- Kartlar: hover'da 3-4px yükselme + imleci izleyen ince kenar
  parıltısı (yalnızca pointer:fine). Reduced-motion'da kapalı.
- Butonlar: birincil = hafif gradyanlı, üst iç ışık, yumuşak parıltı;
  ikincil = cam. Görünür focus halkası.
- İnce ayraçlar (kenarları sönen), tutarlı dikey ritim (8/16/24/40/
  64/96/160), üst menü cam ve scroll'da yoğunlaşır (mevcut is-scrolled).
- Renk paleti kararlı: lacivert zemin + azur aksan. Skill'ler "indigo
  gradyan yasağı" gibi kurallar getirirse palet DEĞİŞMEZ, kullanım
  inceltilir.

════════════════════════════════════════
BÖLÜM 5 — Hareket

scrollcraft ilkeleriyle bölüm girişlerini incelt: tek easing ailesi,
tek yön, tek mesafe (mevcut lib/motion), kademeli reveal. Yeni ağır
kütüphane ekleme. Reduced-motion'da her şey son hâlinde, klavye akışı
ve odak sırası bozulmaz.

════════════════════════════════════════
BÖLÜM 6 — Tüm sayfalara yay, hata avı

- Değişiklikleri token ve ortak bileşenlerde yap (SectionIntro, Card,
  Button, Header, Footer); sayfa başına yama yapma.
- ARANACAK HATA: ana sayfadaki referans kartlarından birinde (Cenk Yavuz
  kartı) alıntı metni görünmüyor, kart boş. Reveal animasyonu içeriği
  gizli bırakıyor olabilir. İçerik animasyondan bağımsız olarak HER
  ZAMAN görünür olmalı (JS/animasyon başarısız olsa bile).

════════════════════════════════════════
BÖLÜM 7 — Doğrulama (atlama)

- BÖLÜM 0'daki aynı görünümleri "sonra" olarak yakala
  (docs/qa/sonraki/). Yan yana önce/sonra sayfası kur, ekran görüntüsünü
  docs/qa/premium-karsilastirma.png olarak kaydet.
- Bölüm 2 için: silüet kenarları yumuşak mı, blok/bant artefaktı yok mu,
  1.0 ve 2.0 DPR'de kontrol et. Bölüm 3 için: Türkçe kelimeler doğru
  basılıyor mu.
- Kontrastı sayılarla raporla (en kötü evre). axe ve typecheck, lint,
  build, testler yeşil olmalı (turbo.exe engelliyse paketleri ayrı
  çalıştır). İlk yük JS <= 220 kB.
- DÜRÜSTLÜK: Görüntü alamadığın veya göremediğin hiçbir şeyi "doğru
  görünüyor" diye raporlama; hangi kareleri kullanıcının kontrol
  etmesi gerektiğini yaz.

════════════════════════════════════════
BİTİRİRKEN

docs/PROJECT-STATUS.md ve CLAUDE.md'nin tasarım bölümünü güncelle
(yeni tipografi ve yüzey sistemi). Bölüm bölüm commit; her şey yeşilse
v2'ye merge et, push et.

YAPMA:
- main dalına dokunma
- içerik, sayfa yapısı, tax-engine, API, veritabanı değişmez
- Vergi Yükü Panosu hatasıyla ilgilenme (ayrı, bilinen bir sorun)
- Uydurma metin, rakam veya referans ekleme
- Testleri gevşetme, erişilebilirliği bastırma
- Skill script'lerini incelemeden çalıştırma
- Git geçmişini yeniden yazma, force-push yapma
```

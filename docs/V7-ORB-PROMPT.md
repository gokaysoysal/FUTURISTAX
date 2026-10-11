# Claude Code — arka plan sahnesini tek küreye sadeleştirme

> Ajana: "docs/V7-ORB-PROMPT.md dosyasını oku ve içindeki kod bloğunu uygula."

---

```
Mevcut arka plan sahnesini (V5'te kurulan layout-level canvas) referans
görsele göre sadeleştiriyoruz. Yeni sistem kurmuyoruz, mevcut sahneyi
ayarlıyoruz.

REFERANS: https://futureoffinance.peachweb.io/
Görsel özellik: koyu lacivert zemin üstünde TEK bir parlayan küre/orb,
ince halka deseniyle çevrili, yumuşak iç ışıma. Küre hero'da net ve
belirgin; aşağı inince küçülüp soluklaşıyor ama zeminin koyu tonu ve
hafif doku bölümler arasında KESİNTİSİZ devam ediyor. Efekt sakin ve
tek odaklı — çok sayıda parçacık veya karmaşık desen yok.

Bu, önceki turlarda kurulan çok parametreli sahnenin tersine, DAHA AZ
ve DAHA ODAKLI bir görsel dil. Sadeleştir, çoğaltma.

════════════════════════════════════════
BÖLÜM 1 — Sahneyi sadeleştir

Mevcut components/backdrop/ içindeki sahneyi gözden geçir:

1. Tek bir ana odak noktası olsun: hero'da merkezi/üst bölgede duran,
   yumuşak glow'lu bir küre veya shader alanı. Çevresinde ince, düşük
   opaklıklı halka/orbit çizgileri (referanstaki gibi).

2. İkincil öğeleri (fazla parçacık, çoklu ışık kaynağı, yoğun desen)
   azalt veya kaldır. Sahne "dolu" değil "sakin ve odaklı" hissettirsin.

3. Küre, scroll ilerledikçe:
   - Boyutça küçülsün ve opaklığı düşsün (hero'dan çıkarken)
   - Konumu yukarı/arkaya kaysın (parallax derinlik hissi)
   - Tamamen kaybolmasın — çok düşük opaklıkta, arka planda "iz" gibi
     kalsın, sonraki bölümlerde zeminin tonuna karışsın

4. Zemin rengi ve doku SÜREKLİLİK göstersin: bölümler arası sert renk
   sıçraması olmasın, aynı koyu lacivert aile içinde çok yumuşak
   geçişler (mevcut damped lerp sistemini kullan, sadece hedef
   parametreleri sadeleştir).

════════════════════════════════════════
BÖLÜM 2 — Akışkanlık ayarı

Referanstaki "her şey birbirine akıyor" hissi için:

1. Lenis lerp değerini gözden geçir — çok sert hissediyorsa biraz
   yumuşat (0.08-0.1 aralığında dene).

2. Bölüm geçişlerinde sahne parametrelerinin ANİ değişmediğini
   doğrula — damped lerp'in gerçekten her frame'de küçük adımlarla
   ilerlediğini, sıçrama yapmadığını kontrol et.

3. Küre ile hero metni arasındaki z-sıralamasını kontrol et: küre
   metnin net arkasında kalsın, hiçbir noktada üstüne binmesin.

════════════════════════════════════════
BÖLÜM 3 — Doğrulama (atlama)

pnpm build && pnpm start ile üretim modunda AÇ ve gerçekten gez.

- Hero'da küre net ve odaklı mı, yoksa hâlâ karmaşık/dağınık mı
- Scroll'da küçülme ve soluklaşma yumuşak mı, sıçrama var mı
- Metin her noktada okunabilir mi (scrim ve kontrast korunmuş mu)
- Ana sayfa ilk yük JS 220 kB altında mı
- Konsol hatasız mı

Sonra typecheck && test && build, commit, push.

YAPMA:
- main dalına dokunma
- tax-engine, API, veritabanı şemasını değiştirme
- Vergi Yükü Panosu hesaplama mantığına dokunma (ayrı, kritik bir
  hata zaten düzeltiliyor — bu prompt yalnızca görsel/arka plan içindir)
- Vergi oranlarını değiştirme
- Testleri gevşetme
```

# Claude Code — arka plan sahnesi: referansa birebir yakın, tek prompt, otonom

> Ajana: "docs/V8-BACKDROP-FINAL.md dosyasını oku ve içindeki kod bloğunu uygula."

---

```
Sen kıdemli bir full-stack developer ve UI/UX tasarımcısısın. Tek görevin:
sitenin arka plan sahnesini, referans siteye GÖRSEL OLARAK MÜMKÜN OLDUĞUNCA
YAKIN hale getirmek. Bu konu dışında hiçbir şeye dokunma — bilinen başka
hatalar var, onlarla ilgilenme, bu prompt yalnızca arka plan sahnesi içindir.

OTONOMİ: Karar gerektiren teknik noktalarda bana sorma, en iyi mühendislik
kararını kendin ver ve uygula. Kullanıcı ürünü bitmiş hâliyle görmek
istiyor, ara onay beklemiyor. İstisna: geri alınamaz bir veri kaybı riski
varsa dur, aksi halde ilerle.

REFERANS: https://futureoffinance.peachweb.io/
KENDİ SİTEN: https://deploy-preview-1--futuristax.netlify.app/

────────────────────────────────────────
ADIM 0 — Gerçekten GÖR (claude-in-chrome kullan)

Chrome uzantısı artık kurulu. Onu kullan — WebFetch ile HTML okumak
yetmez, sahneyi GÖRMEN gerekiyor:

1. claude-in-chrome ile referans siteyi aç, hero'dan footer'a kadar
   YAVAŞÇA scroll et. Her aşamada ne gördüğünü not et: arka plandaki
   objenin şekli, rengi, konumu, opaklığı, scroll ile nasıl değiştiği.
   Mümkünse ekran görüntüleri al ve kendi notlarına referans olarak
   kaydet.
2. Sayfanın kaynağını incele (DevTools → Elements/Sources): canvas
   var mı, SVG mi, CSS animasyon mu? Kullanılan kütüphaneyi (three.js,
   ogl, pixi, CSS-only) tespit etmeye çalış.
3. Kendi sitenin aynı adresini aç, aynı şekilde scroll et. Şu anki
   hâliyle referanstan nasıl farklı olduğunu net biçimde tespit et
   (mevcut sahne muhtemelen ya hiç görünmüyor ya da referanstaki
   netlik/odaktan uzak).
4. Bu gözlemi docs/BACKDROP-GOZLEM.md olarak kısaca yaz: referansta ne
   gördün, kendi sitende ne gördün, fark ne.

Bu adımı atlama. Görmeden inşa etmek tahmin olur.

────────────────────────────────────────
ADIM 1 — Mimariyi teşhis et ve düzelt

Önceki turlarda kurulan components/backdrop/ sistemini incele:
- Sahne gerçekten DOM'a mount oluyor mu?
- Canvas boyutu, z-index, opaklık değerleri doğru mu?
- Bir üst katman (arka plan rengi, başka bir div) sahneyi örtüyor mu?
- Konsol hatası var mı (Playwright veya claude-in-chrome ile kontrol et)?

Sorunu kökünden bul ve düzelt. Yama üstüne yama yapma; gerekiyorsa
sahneyi temiz baştan kur.

────────────────────────────────────────
ADIM 2 — Sahneyi referansa göre inşa et

ADIM 0'daki gözlemine dayanarak:

1. TEK, NET, ODAKLI bir görsel öğe — referanstaki gibi. Aşırı parçacık,
   çoklu ışık kaynağı veya karmaşık desen yok.

2. SCROLL SENKRONİZASYONU — bu işin kalbi:
   - Lenis'in scroll ilerlemesini (0-1 normalize) sahneye gerçek
     zamanlı besle.
   - Sahne parametreleri (konum, boyut, opaklık, renk sıcaklığı, kamera
     derinliği) scroll pozisyonuna DOĞRUDAN bağlı olsun — kullanıcı
     scroll'u durdurunca sahne de durmalı, geri sarınca sahne de geri
     gitmeli. Bağımsız bir zamanlayıcıyla oynamasın.
   - Geçişler damped lerp ile yumuşak olsun (ani sıçrama yok) ama
     GECİKME hissi vermeyecek kadar duyarlı olsun.

3. Her ana bölüm (hero, çözümler, temel yetenekler, hizmetler,
   rakamlar, kapanış) kendi hedef sahne parametrelerini tanımlasın.
   Bölümler arası geçiş yumuşak olsun, sahne asla tamamen kaybolmasın.

4. RENK VE IŞIK: mevcut tema tokenlarını (azur/menekşe aksan) kullan,
   referanstaki ton sıcaklığını (mavi-mor spektrum) hedefle.

────────────────────────────────────────
ADIM 3 — Görsel varlıklar (gerekiyorsa)

Sahne yalnızca prosedürel shader/WebGL ile yeterince zengin
görünmüyorsa:
1. Anthropic'in frontend-design skill'ini kullan (kurulu).
2. Ek doku/görsel gerekiyorsa Unsplash/Pexels'ten uygun, telifsiz
   varlık seç — soyut, düşük doygunluklu, insan yüzü içermeyen (mimari
   detay, cam/beton doku, gece ışık izleri). public/images/ altına
   indir, CREDITS.md'ye kaynağı yaz.
3. Gerçek şirket görseli, logo veya tanınabilir marka kullanma.

────────────────────────────────────────
ADIM 4 — Performans ve yedekler (esnemez)

- prefers-reduced-motion: reduce → sahne donar, scroll'a tepki vermez,
  statik bir kareye düşer
- WebGL desteklenmiyorsa → CSS gradyan yedeği
- Sekme arka plandayken render dur (visibilitychange)
- devicePixelRatio max 2, mobilde karmaşıklık düşür
- Ana sayfa ilk yük JS 220 kB altında kalsın
- Metin okunabilirliği: her bölümde scrim/kontrast korunsun, gövde
  metni 4.5:1 altına düşmesin

────────────────────────────────────────
ADIM 5 — Görsel doğrulama (atlama, en kritik adım)

claude-in-chrome ile kendi sitende AYNI scroll turunu tekrar yap:
1. Hero'dan footer'a yavaşça scroll et, sahnenin her adımda tepki
   verdiğini GÖZLE doğrula.
2. Referans ile yan yana zihinsel karşılaştır: netlik, odak, hareket
   hissi yakın mı?
3. Metin okunabilirliğini her bölümde kontrol et.
4. Mobil genişlikte (390px) de aynı turu yap.
5. Konsol hatasız olmalı.

Tatmin olmadıysan ADIM 2'ye dön ve ayarla. Kendi başına iterate et,
sonuçtan emin olmadan bitirme.

────────────────────────────────────────
BİTİRİRKEN

pnpm typecheck && pnpm test && pnpm build yeşil olsun.
docs/PROJECT-STATUS.md güncelle: ne yapıldı, referansla karşılaştırma
sonucu, hangi kararları neden verdin.
Commit at, v2'ye push et.

YAPMA:
- main dalına dokunma
- tax-engine, API, veritabanı şemasını değiştirme
- Vergi Yükü Panosu veya başka bir hesaplama hatasıyla ilgilenme —
  bu prompt yalnızca arka plan sahnesi içindir
- Gerçek şirket logosu/görseli kullanma
- Testleri gevşetme
- "Yeterince iyi" deyip ADIM 5'i atlama
```

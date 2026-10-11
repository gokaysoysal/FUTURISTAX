# FAZ 6 — GÖRSEL KİMLİK: Karakter Çeşitliliği, Silah Tasarımı, Animasyon Kalitesi

Oyun akıcı ve oynanabilir. Bu faz tamamen **görsel kalite ve çeşitlilik** üzerine: karakterler, silahlar, animasyon hissi, HUD ve genel grafik.

---

## KORUMA KURALLARI — bunlar gevşemiyor

Dün çözülen akıcılık sorunu bu fazın en büyük riski. Daha fazla karakter ve materyal eklemek onu geri getirebilir.

**Dokunma:** hareket, kamera, ADS/zoom, fare hissi, pointer lock, fizik, çarpışma, silah istatistikleri ve nadirlik mimarisi, animasyon state machine'in **davranışı**.

**Akıcılık kapısı — sayılarla:**

| Metrik | Alt sınır |
|---|---|
| Ortalama FPS (sabit benchmark) | ≥ 85 |
| %1 low (hareket halinde, 30 sn) | ≥ 43 |
| En uzun kare | ≤ 80 ms |
| Maç ortası shader derlemesi | **0** |
| Karakter sarsıntısı (medyan) | ≤ 1 px |

Bu sayılardan biri bozulursa o değişikliği geri al. Her adımdan sonra ölç, `BASELINE.md`'ye işle.

**Shader uyarısı (kritik):** Yeni her materyal yeni bir shader demek, yeni shader maç ortası derleme takılması demek — bunu dün sıfırladın. Eklediğin **her** materyal ön derleme (warmup) yoluna girecek. Maç ortası derleme sayısı 0 kalmazsa iş bitmemiştir.

**GC uyarısı:** Kare başına çöp üretimi kesilmişti. Yeni kod sıcak yolda nesne yaratmayacak.

**Bana soru sorma.** Karar ver, `docs/DECISIONS.md`'ye yaz, devam et.

---

## FİKRİ MÜLKİYET — net sınır

Kullanıcı örnek olarak "ninja kaplumbağa" ve "power rangers" dedi. Bunlar **tescilli karakterler, kopyalanmayacak.** İsimleri, yüz tasarımları, renk şemaları, logoları, slogan ve pozları kullanılmayacak.

Serbest olan: **arketip.** Kabuklu bir dövüşçü, renk kodlu kasklı bir ekip, hayalet — bunlar türün ortak dili. Bu arketiplerden **tamamen özgün** karakterler tasarla: kendi oranların, kendi palet ve kostüm detayların, kendi isimlerin. Sonuç hiçbir mevcut karakterle karıştırılmamalı.

Hayalet, iskelet, robot, astronot gibi jenerik figürler zaten serbest.

---

## İŞ 1 — Modüler karakter sistemi (mimari, önce bu)

Her karakteri ayrı modelleme. Draw call, shader ve bakım maliyeti patlar.

**Kur:**

* **Tek iskelet, tek animasyon seti.** Tüm karakterler aynı rig'i ve aynı pozları kullanır — böylece çalışan animasyon davranışı hiç değişmez.
* **Değişebilir parça katmanı:** kafa/maske, gövde/kostüm, aksesuar (pelerin, kask tepeliği, kuyruk), siluet eklentileri. Karakter = parça kombinasyonu + materyal.
* **Paylaşılan materyal:** mümkün olduğunca tek materyal + renk/doku atlası. Karakter başına yeni shader üretme.
* **Karakter başına bütçe:** ≤ 4 draw call, ≤ 3000 üçgen. Aşarsan sadeleştir.
* Karakter tanımları config'de (`shared/config/characters.ts`), kodda değil. Yeni karakter eklemek veri eklemek olsun.

**Takım rengi okunabilirliği (zorunlu):** TDM'de mavi/kırmızı ayrımı **anında** okunmalı. Karakter ne kadar farklı olursa olsun, takım rengi her karakterde **aynı bölgede, geniş ve yüksek kontrastlı** olacak. Uzaktan, hareket halinde, siper arkasından bakıldığında bile karışmamalı. Gri tonlamalı ekran görüntüsüyle de test et.

---

## İŞ 2 — Karakter kadrosu

6–8 özgün karakter tasarla. Hepsi **siluetten** ayırt edilsin — mesafeden bakınca kim olduğu anlaşılmalı.

Yön verici arketipler (birebir uyma, kendi yorumunu kat):

* **Hayalet** — yarı saydam gövde, alttan dağılan tül/duman eteği, süzülen idle duruşu
* **Kabuklu dövüşçü** — sırtında kalın kabuk, bandana yerine kendi tasarımın, güçlü omuz silueti
* **Kask ekibi** — tam yüz kapatan vizörlü kask, renk kodlu zırh panelleri, kendi vizör şeklin
* **Robot** — açılı metal plakalar, parlayan göz çizgisi, mekanik eklem detayı
* **Astronot** — yuvarlak kask, hortumlar, sırt ünitesi
* **İskelet/maskeli** — kemik maske, uzun kapüşon
* Kalanları sen tasarla; her biri farklı bir siluet ailesinden olsun (yuvarlak / köşeli / uzun / geniş)

Her karaktere özgün isim ver. Oyuncu ana menüden seçebilsin, botlara deterministik dağıtılsın.

**Karakter kişiliği:** her karakterin idle duruşu ve yürüyüş ritmi hafifçe farklılaşsın (aynı animasyon seti, farklı zamanlama/genlik çarpanı). Aynı pozlar, farklı karakter hissi — ucuz ve etkili.

---

## İŞ 3 — Silah tasarımı

Şu an silahlar birbirine çok benziyor. Hedef: **eline alınca ve yerde görünce ne olduğu anında anlaşılsın.**

* **Siluet önce gelir.** Her sınıf farklı bir siluet ailesi: taramalı (uzun gövde, orta namlu), sniper (ince uzun namlu + belirgin dürbün), pompalı (kalın kısa gövde, çift namlu veya pompa kolu), SMG (kompakt, kısa), tabanca (küçük, kabza ağırlıklı).
* **Sınıf içi varyantlar da ayrılsın.** Aynı sınıftaki üç silah farklı şarjör biçimi, namlu ağızlığı, dipçik, nişangah detayıyla ayrışsın. Sadece renk değiştirme.
* **Nadirlik malzemede okunsun:** gri sade metal → altın değerli kaplama ve ışıltı. Siluet değişmesin, oyuncu neyle karşı karşıya olduğunu anlasın.
* Yerdeki silah da aynı netlikte okunsun; ışık sütunu rengi nadirliği versin.
* Silah başına ≤ 2 draw call, ≤ 1500 üçgen.

---

## İŞ 4 — Animasyon kalitesi

"Fortnite animasyon kalitesi" teknik olarak şu demek — bunları uygula:

* **Anticipation ve follow-through:** her aksiyon öncesinde küçük bir hazırlık, sonrasında sönümlenen bir devam hareketi. Ateş ederken silah geri teper ve yavaşlayarak toparlar; zıplarken önce çömelme olur.
* **Ağırlık hissi:** iniş anında ezilme (squash), ağır silahta daha yavaş çevirme, koşudan durmaya geçişte hafif savrulma.
* **Hızlı geçişler:** pozlar arası geçiş kısa ve net olsun (0.08–0.15 s), uzun yumuşak lerp değil. Tepkisellik akıcılıktan önce gelir.
* **İkincil hareket:** pelerin, kuyruk, hortum gibi aksesuarlar prosedürel sarkma/salınımla gecikmeli takip etsin. Fizik motoruna bağlama, basit yay-sönüm yeter.
* **Silah bazlı ritim:** reload süresi ve animasyon temposu silahın ağırlığına göre farklılaşsın.
* **Ölüm ve isabet tepkisi** okunaklı olsun: isabet alınca kısa bir sarsılma, ölümde yöne göre devrilme.

Davranışı değiştirme — bu bir **cila** katmanı. Kontrol tepkisi ve zamanlama hissi bozulmayacak.

---

## İŞ 5 — HUD ve ekipman barı

Mevcut bar işlevsel ama karakterden yoksun.

* Slot çerçeveleri, seçili slot vurgusu ve geçiş hareketi oyunun dünyasına ait bir dil konuşsun
* Silah ikonları gerçek silah siluetini yansıtsın — slota bakınca ne olduğu anlaşılsın
* Nadirlik rengi + renksiz ikinci ipucu (kademe noktaları) korunacak
* Mermi, reload, tüketilebilir sayıları küçük boyutta bile yüksek kontrastlı
* Can/kalkan barları, kill feed, hasar sayıları, hitmarker aynı tasarım diline çekilsin
* Karakter seçimi için ana menüye sade bir ekran

`docs/ART_DIRECTION.md` token setine uy; gerekiyorsa token setini genişlet ve dokümanı güncelle. Jenerik "yuvarlak kart + gradient + yumuşak gölge" görünümünden kaçın.

---

## İŞ 6 — Genel grafik

Nerede kazanç varsa oraya yatır: aydınlatma ve gölge kalitesi, materyal zenginliği, çevre çeşitliliği, atmosferik derinlik, efektler (namlu alevi, isabet partikülü, iz, toz).

Dış kaynak serbest: ücretsiz **CC0/MIT** varlık ve kütüphane kullanabilirsin. Giriş/üyelik/API anahtarı isteyen kaynak yok. CC-BY kabul (atıf şart), CC-BY-SA ve NC yok. URL'leri indirmeden önce doğrula. Hepsini `docs/ASSET_CREDITS.md`'ye işle. İndirilen modeller gltf-transform ile sıkıştırılsın, dokular KTX2'ye çevrilsin.

---

## DOĞRULAMA

| # | Kontrol |
|---|---|
| 1 | 6–8 karakter, hepsi siluetten ayırt ediliyor, hiçbiri mevcut bir tescilli karaktere benzemiyor |
| 2 | Takım rengi gri tonlamalı testte bile okunuyor |
| 3 | Her silah sınıfı ve sınıf içi varyantlar görsel olarak ayrışıyor |
| 4 | Animasyon cilası uygulandı, kontrol tepkisi değişmedi |
| 5 | Akıcılık kapısındaki beş metrik de tutuyor — özellikle maç ortası shader derlemesi **0** |
| 6 | Karakter ≤ 4 draw call / 3000 üçgen, silah ≤ 2 / 1500 |
| 7 | BR ve TDM baştan sona oynanabiliyor |
| 8 | `npm run ci` yeşil |
| 9 | Önce/sonra görseller `docs/evidence/phase-6/` altında; tüm karakterler ve tüm silahlar yan yana |

Bitince tek rapor: eklenenler, ölçüm tablosu (önce/sonra, beş metrik), kullanılan dış kaynaklar ve lisansları, devreden borçlar, `phase-6` etiketi, ve test adımları.

Her maddeyi kendi gözünle doğrula — "kod doğru görünüyor" kabul değil.

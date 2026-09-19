# QA Kontrol Listesi — v9-hazir-bilesen → v2 merge sonrası

> Bu liste `pnpm typecheck/test/build` yeşil olsa da tarayıcıda gözle
> doğrulanması gereken maddeleri içerir (WebGL piksel doğrulaması bu ortamda
> otomatik yapılamadı — ham WebGL probe ile dolaylı doğrulandı, bkz.
> `docs/PROJECT-STATUS.md` §0-T). Arka plan sahnesi artık elle yazılan bir
> shader değil, vetted açık kaynak bir bileşenden (react-bits `Orb`, `ogl`)
> uyarlandı — gerçek tarayıcıda scroll sırasında canlı davranışı hiç
> görülemedi, bu yüzden aşağıdaki ilk madde özellikle önemli.

- [ ] **Orb sahnesi:** Hero'da arka planda net kenarlı, tek bir küre
      görmelisin — gövdesi yumuşak koyu-mavi gradyanlı, kenarında belirgin,
      parlak bir "sırt ışığı" (arkadan aydınlatılmış hissi) olmalı; dağınık
      bulut, ayrık bir halka çizgisi veya birden çok parçacık GÖRMEMELİSİN.
      Scroll ettikçe küre yumuşakça küçülüp yukarı kaymalı, ton soğuk maviden
      sıcak menekşe/mercana dönmeli, sıçrama olmamalı; sayfa sonunda (kapanış
      bölümü) küre çok küçük/soluk olsa da tamamen kaybolmamalı.
- [ ] **Vergi Yükü Panosu tutarı:** Ana sayfadaki "Çözümler" bölümündeki canlı
      Vergi Yükü Panosu'nda grafik ve altındaki rakamlar (ekran okuyucu
      tablosuyla birlikte) boş/NaN/yer tutucu görünmeden gerçek hesaplanmış
      tutarları göstermeli ve doğrulanmamış oran varsa uyarı notu görünmeli.
- [ ] **Mobil görünüm:** Sayfayı dar ekranda (telefon genişliği) açtığında
      yatay kaydırma çubuğu çıkmamalı, tüm bölümler tek sütuna düzgün
      yığılmalı ve metinler taşmadan okunabilir olmalı.
- [ ] **Hero'da kart çakışması:** Hero başlığındaki metinle yüzen veri
      kartları (yükümlülük / kur / vergi yükü / yoğunluk) hiçbir ekran
      genişliğinde üst üste binmemeli, kartlar başlık sütununun dışında veya
      CTA'nın altında düzgün konumlanmalı.

# QA Kontrol Listesi — v7-orb → v2 merge sonrası

> Bu liste `pnpm typecheck/test/build` yeşil olsa da tarayıcıda gözle
> doğrulanması gereken maddeleri içerir (WebGL piksel doğrulaması bu ortamda
> otomatik yapılamadı, bkz. `docs/PROJECT-STATUS.md` §0-V).

- [ ] **Orb sahnesi:** Hero'da arka planda dağınık/çok parçacıklı bir bulut
      yerine tek, net odaklı bir küre ve onun etrafında ince, hafif dalgalı bir
      halka görmelisin; scroll ettikçe küre yumuşakça küçülüp soluklaşmalı,
      sıçrama olmamalı ve sayfa sonunda (kapanış bölümü) küre tamamen
      kaybolmadan hafif bir iz olarak kalmalı.
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

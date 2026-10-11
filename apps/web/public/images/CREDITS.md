# Görsel kaynakları ve lisanslar

Bu dosya her görsel için kaynağı ve lisansı kayıt altına alır. **Görsel eklerken
buraya satır ekle.** Kaynağı belirsiz görsel siteye girmez.

## Sanat yönü (V3 sunum katmanı)

**YASAK:** el sıkışan takım elbiseliler, gülümseyen ofis ekibi, laptop başında poz,
hesap makinesi + para yığını, "ok yukarı" grafik klişesi.

**KULLAN:** brütalist/modernist mimari detay, cam ve beton doku, makro belge/kâğıt
dokusu, uzun pozlu şehir gecesi, geometrik gölge deseni, Ankara mimarisi, arşiv/dosya
rafı soyut çekim. Tercihen tek renkli / düşük doygunluk — palete boyanabilsin.

**İşleme:** ham stok görsel kullanılmaz. `TreatedImage` bileşeni duotone (palet
rengi + `mix-blend-mode`) + grain uygular. Böylece stok "stok gibi" durmaz.

## Kayıtlar

| Dosya | Konu | Kaynak | Lisans | İndirme tarihi |
|---|---|---|---|---|
| _(henüz gerçek foto yok — prosedürel SceneBackdrop kullanılıyor)_ | | | | |

<!--
Örnek satır:
| beton-cephe-01.avif | Brütalist cephe detayı | Unsplash — <fotoğrafçı>, <foto URL> | Unsplash License (ücretsiz, atıf gerekmez ama yapıldı) | 2026-09-07 |
-->

## Prosedürel yedekler (kod içinde, dosya değil)

`src/components/media/SceneBackdrop.tsx` — SVG üretimli sahne zeminleri
(`concrete`, `geometric-shadow`, `document-grid`, `light-field`). Palet
tokenlarına bağlı, çözünürlükten bağımsız, lisans/atıf gerektirmez. Gerçek
fotoğraflar geldikçe ilgili `<SceneBackdrop>` çağrıları `<TreatedImage>` ile
değiştirilir.

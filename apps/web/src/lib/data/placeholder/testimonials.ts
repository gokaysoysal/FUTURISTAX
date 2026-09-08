// YER TUTUCU — firma tarafından değiştirilecek.
//
// GERÇEK müşteri görüşü YALNIZCA yazılı yayın izniyle eklenir (bkz.
// src/lib/data/testimonials.ts — asıl kaynak, bilinçli boş). Buradaki kayıtlar
// SADECE ana sayfa düzeni içindir: ad yerine "Örnek Müşteri X · <sektör>",
// avatar yerine soyut geometrik işaret. Uydurma kişi/şirket adı YOK.
// Döküm: docs/YER-TUTUCU-ICERIK.md

export const placeholderTestimonials = [
  {
    key: 'a',
    label: 'Örnek Müşteri A',
    sector: 'İmalat sektörü',
    quote:
      'Yükümlülük takibi bize bağlı olmaktan çıktı; her dönem ne yapılacağı ' +
      'önceden belli oluyor. Kararları artık sayıya bakarak veriyoruz.',
  },
  {
    key: 'b',
    label: 'Örnek Müşteri B',
    sector: 'Bilişim ve yazılım',
    quote:
      'Bir pozisyon alınırken dayanağının yazılı bırakılması, sonraki dönemde ' +
      'gündeme gelen sorularda çok işe yaradı.',
  },
  {
    key: 'c',
    label: 'Örnek Müşteri C',
    sector: 'İnşaat ve gayrimenkul',
    quote:
      'Proje bazlı çalışmada vergi ve finans etkisini önden modellemek, ' +
      'yatırım kararını netleştirdi.',
  },
] as const;

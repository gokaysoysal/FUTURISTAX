// YER TUTUCU — firma tarafından değiştirilecek.
//
// Ana sayfa bölüm metinleri. Düzen ve kalite otursun diye taslak yazıldı;
// SOMUT oran / tutar / mevzuat atfı YOK (genel çerçeve). `CONTENT_IS_PLACEHOLDER`
// bayrağı `false` olunca bu dosya gerçek metinlerle değiştirilir.
// Satır satır döküm: docs/YER-TUTUCU-ICERIK.md

export const heroContent = {
  eyebrow: "Ankara · 2013'ten beri",
  /** split-type kelime kelime girer — Türkçe glif kontrolü SplitHeading'de */
  title: 'Vergiyi yönetilebilir bir kaleme dönüştürüyoruz',
  subtitle:
    'FuturistaX Advisory; şirketlere vergi, finans ve uyum süreçlerinde danışmanlık verir. ' +
    'Yükümlülüklerinizi takip etmekle başlar, kalıcı bir mali yapı kurmakla sürdürürüz.',
  primaryCta: { label: 'Görüşme talep et', href: '/iletisim' },
  secondaryCta: { label: 'Hesaplama araçları', href: '/araclar' },
} as const;

export const solutionsContent = {
  eyebrow: 'Çözümler',
  title: 'Karmaşık vergi işini öngörülebilir kılıyoruz',
  body:
    'Yükümlülük takibini, senaryo hesaplamalarını ve raporlamayı tek bir çalışma düzenine ' +
    'bağlarız. Kararlarınızı tahminle değil, hesabın nasıl çıktığını görerek verirsiniz.',
  primaryCta: { label: 'Görüşme talep et', href: '/iletisim' },
  secondaryCta: { label: 'Panoyu incele', href: '/araclar' },
} as const;

/** ÖZELLİKLER — üç kart. Karşılığı: planlama / uyum / risk. */
export const featureTriad = [
  {
    key: 'planlama',
    title: 'Vergi planlaması',
    body:
      'Yıl içi senaryoları önden çalışır, nakit akışına etkisini gösteririz; ' +
      'karar anında sürpriz olmaz.',
  },
  {
    key: 'uyum',
    title: 'Mevzuat uyumu',
    body:
      'Değişen düzenlemeleri süreçlerinize çeviririz; beyan ve bildirim takvimi ' +
      'kimseye bağlı kalmadan işler.',
  },
  {
    key: 'risk',
    title: 'Risk analizi',
    body:
      'İnceleme ihtimali olan alanları erken işaretler, alınan her pozisyonun ' +
      'dayanağını yazılı bırakırız.',
  },
] as const;

/** TEMEL YETENEKLER — pinlenmiş bölüm. Üç adım. */
export const capabilitySteps = [
  {
    n: '01',
    title: 'Analiz',
    body:
      'Mevcut yapıyı, açık yükümlülükleri ve risk alanlarını çıkarırız. ' +
      'Çıktı: önceliklendirilmiş bir tablo ve net bir başlangıç noktası.',
  },
  {
    n: '02',
    title: 'Yapılandırma',
    body:
      'Süreçleri, yükümlülük takvimini ve raporlama düzenini kurarız. ' +
      'Tekrar eden iş azalır, sorumluluk sınırları netleşir.',
  },
  {
    n: '03',
    title: 'Sürekli takip',
    body:
      'Düzenli danışmanlık, mevzuat takibi ve karar desteğiyle yapıyı ayakta ' +
      'tutarız; değişiklik geldiğinde önden haber verir, birlikte planlarız.',
  },
] as const;

/** HİZMETLER — 9 hizmet dört gruba toplandı (kartlar `getService` ile bağlanır). */
export const serviceGroups = [
  {
    key: 'vergi',
    title: 'Vergi danışmanlığı',
    body: 'Kurumlar ve gelir vergisi planlaması, KDV ve uluslararası vergilendirme.',
    serviceSlugs: ['vergi-danismanligi', 'uluslararasi-vergilendirme'],
  },
  {
    key: 'denetim',
    title: 'Denetim ve risk',
    body: 'İnceleme hazırlığı, risk analizi ve bağımsız denetim desteği.',
    serviceSlugs: ['vergi-denetimi', 'bagimsiz-denetim-destegi'],
  },
  {
    key: 'finans',
    title: 'Finans ve raporlama',
    body: 'Nakit akışı ve bütçe analitiği, TFRS/IFRS uyumlu kurumsal raporlama.',
    serviceSlugs: ['finansal-danismanlik', 'kurumsal-raporlama'],
  },
  {
    key: 'yapi',
    title: 'Uyum ve yapılandırma',
    body: 'Mevzuat uyumu, kurumsal yapılandırma ve yatırım teşvik yönetimi.',
    serviceSlugs: ['mevzuat-uyumu', 'kurumsal-yapilandirma', 'yatirim-tesvik-yonetimi'],
  },
] as const;

/** ÇALIŞMA MODELİ — referanstaki fiyat tablosunun karşılığı. FİYAT YOK. */
export const engagementModels = [
  {
    key: 'tek-seferlik',
    title: 'Tek seferlik danışmanlık',
    summary: 'Belirli bir soru ya da karar için sınırlı kapsamlı çalışma.',
    points: [
      'Tek konu, tanımlı kapsam',
      'Yazılı görüş ve gerekçe',
      'Gerekli hesaplamalar ve senaryolar',
      'Uygulama için kısa yol haritası',
    ],
    cta: { label: 'Görüşme talep et', href: '/iletisim' },
    featured: false,
  },
  {
    key: 'surekli',
    title: 'Sürekli mutabakat',
    summary: 'Düzenli aralıklarla yürüyen danışmanlık ilişkisi.',
    points: [
      'Yükümlülük takvimi takibi',
      'Dönemsel değerlendirme toplantıları',
      'Mevzuat değişikliklerinde önden uyarı',
      'Karar anında hızlı erişim',
    ],
    cta: { label: 'Görüşme talep et', href: '/iletisim' },
    featured: true,
  },
  {
    key: 'proje',
    title: 'Proje bazlı yapılandırma',
    summary: 'Yeniden yapılanma, birleşme ya da yatırım gibi tanımlı bir proje.',
    points: [
      'Proje ekibi ve zaman çizelgesi',
      'Vergi ve finans etkisi modellemesi',
      'Kurum içi ekiplerle koordinasyon',
      'Kapanışta devir ve dokümantasyon',
    ],
    cta: { label: 'Görüşme talep et', href: '/iletisim' },
    featured: false,
  },
] as const;

export const closingCta = {
  title: 'Vergi yükünüzü birlikte haritalayalım',
  body: 'İlk görüşme ücretsizdir ve bağlayıcı değildir. Yüz yüze ya da çevrim içi.',
  primaryCta: { label: 'Görüşme talep et', href: '/iletisim' },
  secondaryCta: { label: 'Hizmetleri gör', href: '/hizmetler' },
} as const;

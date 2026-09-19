import type { Faq } from './types';

/**
 * Genel SSS — /sss sayfasında ve FAQPage şemasında kullanılır.
 *
 * Hizmet ve sektör sayfalarının kendi SSS'leri ilgili kayıtlarda tutulur;
 * burası firmanın çalışma biçimine dair site geneli sorulardır.
 *
 * "Vergi & Danışmanlık" ve "Teşvik & Ar-Ge" kategorileri GERÇEK İÇERİKTİR —
 * www.futuristax.com'dan (V10, kaynak doğrulandı). Somut oran, tutar ve
 * mevzuat madde atıfları firmanın kendi yayınladığı metinden geliyor,
 * uydurma değil. "Gizlilik ve veri" kategorisi ise çalışma biçimine dair
 * genel, taslak bir bilgilendirmedir.
 */

export interface FaqCategory {
  slug: string;
  title: string;
  items: readonly Faq[];
}

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    slug: 'vergi-ve-danismanlik',
    title: 'Vergi & Danışmanlık',
    items: [
      {
        question: 'Vergi danışmanı ile mali müşavir arasındaki fark nedir?',
        answer:
          'Serbest Muhasebeci Mali Müşavir (SMMM), işletmelerin günlük muhasebe kayıtlarını ' +
          'tutar, beyannameleri düzenler ve resmi bildirimleri yapar. Vergi danışmanı ise vergi ' +
          'yükünü yasal çerçevede minimize eden stratejiler geliştirir: kurumlar vergisi ' +
          'yapılandırması, KDV planlaması, teşvik optimizasyonu ve uluslararası vergi ' +
          'anlaşmalarından yararlanma bunların başında gelir. FuturistaX Advisory her iki ' +
          'hizmeti tek çatı altında sunarak müşterilerine hem uyum hem de optimizasyon avantajı ' +
          'sağlar.',
      },
      {
        question: 'Kurumlar vergisi beyannamesi ne zaman verilir?',
        answer:
          'Kurumlar vergisi beyannamesi, hesap döneminin kapandığı ayı izleyen dördüncü ayın ' +
          '1-25. günleri arasında verilir. Takvim yılı esasını kullanan kurumlar için bu süre ' +
          '1–25 Nisan arasıdır. Özel hesap dönemi kullananlar (Temmuz–Haziran dönemi gibi) ' +
          'beyannameyi Ekim ayında vermek zorundadır. Beyanname GİB e-Beyanname sistemi ' +
          'üzerinden elektronik ortamda gönderilir; vergi, beyanname verme süresi içinde ödenir. ' +
          '2024 yılından itibaren standart kurumlar vergisi oranı %25 olarak uygulanmaktadır.',
      },
      {
        question: 'KDV iadesi süreci nasıl işler?',
        answer:
          'KDV iadesi; ihracat, indirimli oranlı teslimler ve kısmi tevkifat gibi işlemlerden ' +
          'kaynaklanabilir. GİB İnteraktif Vergi Dairesi üzerinden başvuru yapılır. 10.000 TL ' +
          'altı iadeler teminat/rapor aranmaksızın mahsuben yapılabilir. Nakden iadeler için YMM ' +
          'tasdik raporu veya vergi inceleme raporu zorunludur. Hızlandırılmış İade Sistemi ' +
          '(HİS) kapsamındaki mükellefler süreci önemli ölçüde kısaltabilir; iade süreci ' +
          'ortalama 1-3 ay sürmekle birlikte eksik belge durumunda uzayabilir.',
      },
      {
        question: 'Transfer fiyatlandırması nedir?',
        answer:
          'Transfer fiyatlandırması, kurumların ilişkili kişilerle (ortaklar, bağlı şirketler, ' +
          'yöneticiler) gerçekleştirdiği işlemlerin emsallere uygunluk ilkesi çerçevesinde ' +
          'fiyatlandırılmasıdır. KVK Madde 13 uyarınca yurt içi ilişkili kişi işlemlerinde ' +
          'yıllık 1 milyon TL, yurt dışı işlemlerde ise 500.000 TL üzerindeki tutarlar için ' +
          'belgeleme hazırlanması zorunludur. Eksik veya hatalı belgelendirme durumunda örtülü ' +
          'kazanç dağıtımı hükümleri devreye girer ve %50 vergi ziyaı cezası uygulanabilir.',
      },
    ],
  },
  {
    slug: 'tesvik-ve-ar-ge',
    title: 'Teşvik & Ar-Ge',
    items: [
      {
        question: 'Ar-Ge indirimi kimler için geçerlidir?',
        answer:
          'Ar-Ge indirimi GVK Madde 89/9 ve KVK Madde 10/1-a kapsamında uygulanır. Ar-Ge Merkezi ' +
          'kuran firmalar (en az 30 tam zamanlı Ar-Ge personeli şartı aranır) harcamalarının ' +
          '%100’ünü vergi matrahından indirebilir. Teknokent (TGB) bünyesindeki firmalar da aynı ' +
          'imkândan yararlanır. Nitelikli Ar-Ge personelinin ücretleri gelir vergisi ' +
          'stopajından, Ar-Ge amaçlı makine-teçhizat alımları ise KDV’den istisna tutulabilir. ' +
          'Destekten yararlanmak için Sanayi ve Teknoloji Bakanlığı’na başvuru gereklidir.',
      },
      {
        question: 'Yatırım teşvik belgesi nasıl alınır?',
        answer:
          'Yatırım teşvik belgesi, Sanayi ve Teknoloji Bakanlığı’na bağlı E-TUYS sistemi ' +
          'üzerinden online başvuru ile alınır. Başlıca destekler: makine-teçhizat alımlarında ' +
          'KDV istisnası, ithal makinelerde gümrük vergisi muafiyeti, kurumlar vergisi indirimi ' +
          '(%40-100 arası yatırıma katkı oranına göre), SGK işveren payı desteği ve faiz ' +
          'desteğidir. Bölgesel teşvik uygulamalarında yatırım yapılan ilin gelişmişlik ' +
          'durumuna göre (1-6. bölge) destek oranları değişir; 6. bölge en kapsamlı destekleri ' +
          'sunar.',
      },
      {
        question: 'Teknokent istisnası nasıl uygulanır?',
        answer:
          '4691 sayılı Teknoloji Geliştirme Bölgeleri Kanunu kapsamında Teknokent firmaları ' +
          'önemli avantajlardan yararlanır: TGB’de elde edilen yazılım, tasarım ve Ar-Ge ' +
          'kazançları 31.12.2028 tarihine kadar kurumlar/gelir vergisinden istisnadır. Bu ' +
          'kazançlara ilişkin KDV de istisna kapsamındadır. TGB’de çalışan Ar-Ge ve tasarım ' +
          'personelinin ücretleri 31.12.2028’e kadar gelir vergisi ve damga vergisinden ' +
          'muaftır. Yurt dışına yapılan yazılım ihracatında ayrıca %50 kurumlar vergisi ' +
          'indirimi de uygulanır.',
      },
      {
        question: 'İlk görüşme gerçekten ücretsiz mi?',
        answer:
          'Evet, tamamen ücretsizdir. İlk görüşmede uzman danışmanımız şirketinizin mevcut ' +
          'vergi yapısını, risk alanlarını ve optimizasyon fırsatlarını değerlendirir. Görüşme ' +
          'yaklaşık 45-60 dakika sürer ve yüz yüze ya da video konferans yoluyla ' +
          'gerçekleştirilebilir. Değerlendirme sonucunda size özel bir danışmanlık teklifi ' +
          'sunulur.',
      },
    ],
  },
  {
    slug: 'gizlilik',
    title: 'Gizlilik ve veri',
    items: [
      {
        question: 'Paylaştığımız mali veriler nasıl korunuyor?',
        answer:
          'Tüm çalışma gizlilik yükümlülüğü altında yürütülür. Verileriniz yalnızca ' +
          'danışmanlık kapsamında kullanılır, üçüncü taraflarla paylaşılmaz.',
      },
      {
        question: 'İletişim formundan gönderdiğimiz bilgiler ne oluyor?',
        answer:
          'Form verileri yalnızca talebinizi değerlendirmek için işlenir. Ayrıntılar KVKK ' +
          'aydınlatma metninde açıklanmıştır.',
      },
    ],
  },
];

/** Tüm SSS'lerin düz listesi — FAQPage şeması ve arama için. */
export const GENERAL_FAQS: readonly Faq[] = FAQ_CATEGORIES.flatMap((c) => c.items);

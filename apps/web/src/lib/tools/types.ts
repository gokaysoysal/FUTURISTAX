import type { Faq } from '@/lib/data';

/**
 * Hesaplama araçları kaydı — SEO metni, HowTo adımları ve SSS'ler.
 *
 * Hesaplama MANTIĞI burada YOKTUR; `packages/tax-engine` içinde, saf ve testli.
 * Bu katman yalnızca sunum ve şema verisidir. Bileşen eşlemesi `ToolWorkspace`
 * içinde slug'a göre yapılır. Her araç kendi dosyasında — CMS'e taşınabilir.
 *
 * Metinler TASLAKTIR; somut oran/tutar yazılmadı — oranlar motordan gelir ve
 * doğrulanmamışsa sonuç bloğunda uyarı bandı gösterilir.
 */
export interface ToolMeta {
  slug: string;
  title: string;
  /** Hub kartı ve kısa başlık */
  short: string;
  description: string;
  /** Sayfa giriş paragrafı */
  intro: string;
  /** Yasal dayanak etiketi */
  basis: string;
  howTo: { name: string; steps: readonly string[] };
  faqs: readonly Faq[];
  order: number;
}

/** Birden fazla araçta tekrar eden SSS'ler. */
export const COMMON_FAQS = {
  binding: {
    question: 'Sonuç bağlayıcı mı?',
    answer:
      'Hayır. Bu araç genel bilgilendirme amaçlıdır ve mali müşavirlik hizmeti yerine geçmez. ' +
      'Kesin hesap için bizimle görüşün.',
  },
  rates: {
    question: 'Kullanılan oranlar güncel mi?',
    answer:
      'Oranlar seçtiğiniz vergi yılına göre motordan gelir. Bir yılın değerleri resmî kaynaktan ' +
      'doğrulanmadıysa sonuç bloğunda bir uyarı bandı görürsünüz.',
  },
} as const;

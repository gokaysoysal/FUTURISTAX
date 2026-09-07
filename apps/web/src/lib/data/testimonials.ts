import type { Testimonial } from './types';

/**
 * Müşteri referansları / görüşleri.
 *
 * ⚠️ ŞU AN BOŞ — ve bilinçli olarak boş.
 *
 * Eski sitedeki müşteri görüşlerinin gerçekliği ve yayın izni teyit edilmedi.
 * Bu projenin birinci kuralı uydurma içerik üretmemektir; bir referans ya
 * gerçek bir müşteriden yazılı izinle gelir ya da hiç gösterilmez.
 *
 * "Referanslar için müşterilerden yazılı izin var mı?" sorusu açık bir iş
 * kararıdır (bkz. docs/PROJECT-STATUS.md — "cevap bekleyen kararlar").
 *
 * İzinli görüşler geldiğinde bu diziye eklenecek. `publishableTestimonials()`
 * yalnızca `consentToPublish === true` olanları döndürür; izinsiz bir kayıt
 * yanlışlıkla eklense bile UI'da render edilmez.
 */
export const TESTIMONIALS: readonly Testimonial[] = [];

/** Yalnızca yazılı yayın izni olan görüşler. UI bu listeyi kullanır. */
export function publishableTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.consentToPublish).sort((a, b) => a.order - b.order);
}

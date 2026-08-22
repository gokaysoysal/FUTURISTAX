import { z } from 'zod';

/**
 * İletişim formu şeması.
 *
 * Aynı şema hem istemcide (react-hook-form) hem sunucuda (API route) kullanılır.
 * Sunucu istemciye güvenmez; doğrulama her iki tarafta da çalışır.
 */
export const contactTopics = [
  'vergi-danismanligi',
  'finansal-danismanlik',
  'yatirim-tesvikleri',
  'uluslararasi-vergilendirme',
  'kurumsal-yapilandirma',
  'diger',
] as const;

export type ContactTopic = (typeof contactTopics)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Adınızı ve soyadınızı yazın.')
    .max(120, 'Ad soyad en fazla 120 karakter olabilir.'),

  email: z.string().trim().toLowerCase().email('Geçerli bir e-posta adresi yazın.'),

  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s()-]{10,20}$/, 'Telefon numarasını kontrol edin.')
    .optional()
    .or(z.literal('')),

  company: z.string().trim().max(160).optional().or(z.literal('')),

  topic: z.enum(contactTopics, { errorMap: () => ({ message: 'Bir konu seçin.' }) }),

  message: z
    .string()
    .trim()
    .min(20, 'Talebinizi biraz daha ayrıntılı yazın — en az 20 karakter.')
    .max(4000, 'Mesaj en fazla 4000 karakter olabilir.'),

  /** KVKK açık rıza — zorunlu, işaretlenmeden gönderim yapılamaz. */
  kvkkConsent: z.literal(true, {
    errorMap: () => ({ message: 'Devam etmek için aydınlatma metnini onaylayın.' }),
  }),

  /** Bot tuzağı: gerçek kullanıcı bu alanı görmez, boş kalmalıdır. */
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Sunucu tarafında ek olarak Turnstile jetonu beklenir. */
export const contactRequestSchema = contactSchema.extend({
  turnstileToken: z.string().min(1, 'Doğrulama tamamlanmadı.'),
});

export const TOPIC_LABELS: Record<ContactTopic, string> = {
  'vergi-danismanligi': 'Vergi danışmanlığı',
  'finansal-danismanlik': 'Finansal danışmanlık',
  'yatirim-tesvikleri': 'Yatırım teşvikleri',
  'uluslararasi-vergilendirme': 'Uluslararası vergilendirme',
  'kurumsal-yapilandirma': 'Kurumsal yapılandırma',
  diger: 'Diğer',
};

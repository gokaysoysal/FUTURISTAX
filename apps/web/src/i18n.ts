import { getRequestConfig } from 'next-intl/server';

const LOCALES = ['tr', 'en'] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'tr';

/**
 * next-intl 3.22+ : `getRequestConfig` içindeki `locale` parametresi
 * kullanımdan kaldırıldı; yerine `await requestLocale` çözülür. Dönen
 * yapılandırma her zaman geçerli bir `locale` içermelidir.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = LOCALES.includes(requested as Locale)
    ? (requested as Locale)
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Europe/Istanbul',
  };
});

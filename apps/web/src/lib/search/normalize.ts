/**
 * Türkçe arama normalizasyonu.
 *
 * Amaç: "sirket" yazan kullanıcı "şirket"i bulsun. Aksan ve Türkçe'ye özgü
 * harfler ASCII karşılıklarına indirgenir; hem dizin metni hem sorgu aynı
 * fonksiyondan geçer.
 *
 *   şirket / şırket / SIRKET  →  "sirket"
 *   İ (tr-lower) → i,  I (tr-lower) → ı → i
 */
const MAP: Record<string, string> = {
  ı: 'i',
  ş: 's',
  ğ: 'g',
  ç: 'c',
  ö: 'o',
  ü: 'u',
  â: 'a',
  î: 'i',
  û: 'u',
};

const COMBINING = /\p{Diacritic}/gu;
const TR_LETTERS = /[ışğçöüâîû]/g;
const NON_ALNUM = /[^a-z0-9\s]+/g;

export function normalizeTr(input: string): string {
  return input
    .toLocaleLowerCase('tr-TR')
    .replace(TR_LETTERS, (ch) => MAP[ch] ?? ch)
    .normalize('NFD')
    .replace(COMBINING, '')
    .replace(NON_ALNUM, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

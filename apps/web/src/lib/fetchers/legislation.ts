/**
 * Resmî mevzuat / duyuru beslemesi.
 *
 * ⚠️ BU PROJENİN BİRİNCİ KURALI: Eski sitede GİB duyuruları bir dil modeline
 * ürettiriliyor ve gerçekmiş gibi yayınlanıyordu. Burada YEDEK/UYDURMA içerik
 * ASLA üretilmez. Besleme kaynağı yoksa, erişilemezse veya boşsa fonksiyon
 * hata fırlatır; çağıran taraf "şu an güncellenemiyor" durumunu gösterir.
 *
 * Kaynak `LEGISLATION_FEED_URL` ile yapılandırılır (RSS/Atom veya JSON dizi).
 * Yapılandırılana kadar bölüm boş görünür — bu, kuralın gereğidir.
 */

export interface OfficialAnnouncement {
  title: string;
  url: string;
  /** ISO 8601 tarih; ayrıştırılamazsa boş string */
  date: string;
}

export class LegislationFetchError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'LegislationFetchError';
  }
}

function stripTags(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function toIso(raw: string): string {
  if (!raw) return '';
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? '' : new Date(parsed).toISOString().slice(0, 10);
}

/** RSS/Atom veya JSON gövdesini normalize eder. Tanınmazsa boş dizi döner. */
export function parseAnnouncementFeed(body: string): OfficialAnnouncement[] {
  const trimmed = body.trimStart();

  // JSON: [{ title, url|link, date|publishedAt }]
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      const list = Array.isArray(parsed)
        ? parsed
        : Array.isArray((parsed as { items?: unknown[] })?.items)
          ? (parsed as { items: unknown[] }).items
          : [];
      return list
        .map((entry) => {
          const item = entry as Record<string, unknown>;
          const title = typeof item.title === 'string' ? item.title : '';
          const url =
            typeof item.url === 'string'
              ? item.url
              : typeof item.link === 'string'
                ? item.link
                : '';
          const date =
            typeof item.date === 'string'
              ? item.date
              : typeof item.publishedAt === 'string'
                ? item.publishedAt
                : '';
          return { title: title.trim(), url: url.trim(), date: toIso(date) };
        })
        .filter((item) => item.title && item.url);
    } catch {
      return [];
    }
  }

  // RSS <item> / Atom <entry>
  const blocks = trimmed.match(/<(item|entry)\b[\s\S]*?<\/\1>/g) ?? [];
  return blocks
    .map((block) => {
      const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const linkMatch =
        block.match(/<link[^>]*href="([^"]+)"/i) ?? block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const dateMatch =
        block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) ??
        block.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i) ??
        block.match(/<published[^>]*>([\s\S]*?)<\/published>/i);
      return {
        title: titleMatch ? stripTags(titleMatch[1] ?? '') : '',
        url: linkMatch ? stripTags(linkMatch[1] ?? '') : '',
        date: dateMatch ? toIso(stripTags(dateMatch[1] ?? '')) : '',
      };
    })
    .filter((item) => item.title && item.url);
}

/**
 * Güncel resmî duyuruları getirir. Kaynak yoksa/erişilemezse/boşsa HATA
 * fırlatır — çağıran taraf durumu gösterir, yedek içerik ÜRETMEZ.
 */
export async function fetchOfficialAnnouncements(limit = 8): Promise<OfficialAnnouncement[]> {
  const url = process.env.LEGISLATION_FEED_URL;
  if (!url) {
    throw new LegislationFetchError(
      'Resmî besleme kaynağı (LEGISLATION_FEED_URL) yapılandırılmadı.',
    );
  }

  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: 3600, tags: ['legislation'] },
      headers: { Accept: 'application/rss+xml, application/atom+xml, application/json' },
    });
  } catch (error) {
    throw new LegislationFetchError('Resmî besleme kaynağına ulaşılamadı.', { cause: error });
  }

  if (!response.ok) {
    throw new LegislationFetchError(`Resmî besleme kaynağı ${response.status} döndü.`);
  }

  const items = parseAnnouncementFeed(await response.text());
  if (items.length === 0) {
    throw new LegislationFetchError('Resmî beslemede kullanılabilir kayıt bulunamadı.');
  }

  return items.slice(0, limit);
}

import { db, schema } from '@/db/client';
import { LEGAL_VERSIONS } from '@/lib/legal/versions';
import { TOPIC_LABELS, contactRequestSchema } from '@/lib/validation/contact';
import { serverEnv, site } from '@futuristax/config';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * İletişim formu endpoint'i.
 *
 * Eski sitede `submitForm()` yalnızca bir toast gösteriyordu ve hiçbir yere veri
 * göndermiyordu — gelen her talep kayboluyordu. Bu route o hatayı kapatır.
 *
 * Akış: doğrula → bot kontrolü → hız sınırı → kaydet → bildir → onayla
 *
 * DAYANIKLILIK: Turnstile jetonu alınamazsa (CF betiği yüklenmedi, ağ engeli,
 * kullanıcı erken gönderdi) istek REDDEDİLMEZ. Jetonsuz istek daha katı hız
 * sınırına tabi tutulur, bal küpü ve alan doğrulaması korunur, kayıt
 * `attribution.verification = 'unverified'` ile işaretlenir. Bir danışmanlık
 * sitesinde kilitlenen form doğrudan lead kaybıdır.
 */

export const runtime = 'nodejs';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Doğrulanmış istek: aynı kişiden 10 dakikada en fazla 3 talep
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  prefix: 'contact',
  analytics: true,
});

// Jetonsuz / doğrulanamayan istek: belirgin biçimde daha sıkı.
const strictRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, '1 h'),
  prefix: 'contact-unverified',
  analytics: true,
});

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error('[contact] Turnstile doğrulaması yapılamadı', error);
    return false;
  }
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

/** Hata yanıtları özür dilemez; ne olduğunu ve ne yapılacağını söyler. */
function fail(message: string, status: number, fieldErrors?: Record<string, string[]>) {
  return NextResponse.json({ ok: false, message, fieldErrors }, { status });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  // Ortam değişkenleri en başta ve KORUMALI okunur. Eksik yapılandırma
  // yüzünden route çökerse istemci JSON yerine HTML hata sayfası alır ve
  // "bağlantı kurulamadı" gibi yanıltıcı bir mesaj görür.
  let env: ReturnType<typeof serverEnv>;
  try {
    env = serverEnv();
  } catch (error) {
    console.error('[contact] yapılandırma eksik', error);
    return fail(
      `Form şu anda yapılandırma nedeniyle çalışmıyor. Lütfen doğrudan ${site.contact.email} adresine yazın ya da ${site.contact.phoneDisplay} numarasını arayın.`,
      503,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail('İstek gövdesi okunamadı. Formu yeniden gönderin.', 400);
  }

  const parsed = contactRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return fail(
      'Bazı alanlar eksik veya hatalı. İşaretli alanları düzeltip yeniden gönderin.',
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const data = parsed.data;

  // Bal küpü doluysa istek bir bottan geliyor. Sessizce başarılı dön —
  // bota hangi kontrole takıldığını söylemeyiz.
  if (data.website) {
    return NextResponse.json({ ok: true, message: 'Talebiniz alındı.' });
  }

  // Bot kontrolü: jeton varsa doğrula. Jeton yoksa veya doğrulanamazsa istek
  // REDDEDİLMEZ — "doğrulanmamış" olarak işaretlenir ve sıkı sınıra girer.
  const hasToken = data.turnstileToken.length > 0;
  const humanVerified = hasToken
    ? await verifyTurnstile(env.TURNSTILE_SECRET_KEY, data.turnstileToken, ip)
    : false;
  const verificationReason = humanVerified
    ? undefined
    : hasToken
      ? 'turnstile-failed'
      : 'turnstile-missing';

  const limiter = humanVerified ? ratelimit : strictRatelimit;
  const { success: withinLimit } = await limiter.limit(ip);
  if (!withinLimit) {
    const phone = site.contact.phoneDisplay;
    return fail(
      humanVerified
        ? `Kısa sürede çok fazla talep gönderildi. 10 dakika sonra tekrar deneyin ya da doğrudan ${phone} numarasını arayın.`
        : `Kısa sürede çok fazla doğrulanmamış talep alındı. Sayfayı yenileyip güvenlik doğrulamasının yüklenmesini bekleyin ya da doğrudan ${phone} arayın.`,
      429,
    );
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const topicLabel = TOPIC_LABELS[data.topic];

  // Önce kalıcı kayıt, sonra bildirim. E-posta servisi çökse bile talep kaybolmaz.
  let leadId: string;
  try {
    const [inserted] = await db()
      .insert(schema.leads)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        topic: data.topic,
        message: data.message,
        consentAt: new Date(),
        consentPolicyVersion: LEGAL_VERSIONS.kvkkNotice,
        sourceIp: ip,
        userAgent: request.headers.get('user-agent'),
        // Bot kontrolü sonucu kayıtta işaretlenir — reddetmiyoruz, işaretliyoruz.
        attribution: {
          verification: humanVerified ? 'verified' : 'unverified',
          ...(verificationReason ? { verificationReason } : {}),
        },
      })
      .returning({ id: schema.leads.id });

    if (!inserted) throw new Error('Kayıt oluşturulamadı.');
    leadId = inserted.id;
  } catch (error) {
    console.error('[contact] kayıt başarısız', { ip, error });
    return fail(
      `Talebiniz kaydedilemedi. Lütfen birkaç dakika sonra tekrar deneyin ya da ${site.contact.email} adresine yazın.`,
      500,
    );
  }

  try {
    await resend.emails.send({
      from: env.MAIL_FROM,
      to: env.CONTACT_INBOX,
      replyTo: data.email,
      subject: `Yeni danışmanlık talebi — ${topicLabel} — ${data.name}`,
      text: [
        `Ad Soyad : ${data.name}`,
        `E-posta  : ${data.email}`,
        `Telefon  : ${data.phone || '—'}`,
        `Şirket   : ${data.company || '—'}`,
        `Konu     : ${topicLabel}`,
        `Doğrulama: ${humanVerified ? 'DOĞRULANDI' : `DOĞRULANMADI (${verificationReason})`}`,
        '',
        'Mesaj:',
        data.message,
        '',
        `Kayıt no: ${leadId}`,
        `IP: ${ip}`,
        `Zaman: ${new Date().toISOString()}`,
      ].join('\n'),
    });

    await resend.emails.send({
      from: env.MAIL_FROM,
      to: data.email,
      subject: 'Talebiniz bize ulaştı',
      text: [
        `Sayın ${data.name},`,
        '',
        `${topicLabel} konusundaki talebiniz ekibimize iletildi.`,
        'En geç bir iş günü içinde size dönüş yapacağız.',
        '',
        'Acil bir konuysa doğrudan ulaşabilirsiniz:',
        `Telefon: ${site.contact.phoneDisplay}`,
        `E-posta: ${site.contact.email}`,
        '',
        site.brand.name,
      ].join('\n'),
    });

    return NextResponse.json({ ok: true, message: 'Talebiniz alındı.' });
  } catch (error) {
    // Kayıt başarılı, yalnızca bildirim gitmedi. Kullanıcıya başarı döneriz —
    // talep kaydedildi; eksik olan bizim iç bildirimimiz. Hata izlemeye düşer.
    console.error('[contact] bildirim gönderilemedi, kayıt mevcut', { leadId, error });
    return NextResponse.json({ ok: true, message: 'Talebiniz alındı.' });
  }
}

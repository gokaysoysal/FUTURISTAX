'use client';

import { TurnstileWidget } from '@/components/consent/TurnstileWidget';
import {
  type ContactInput,
  TOPIC_LABELS,
  contactSchema,
  contactTopics,
} from '@/lib/validation/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

/**
 * Danışmanlık talep formu.
 *
 * Eski sitede bu form hiçbir yere veri göndermiyordu. Bu sürüm gerçekten
 * gönderir, hataları erişilebilir biçimde bildirir ve KVKK açık rızası
 * alınmadan gönderime izin vermez.
 */

type Status = { kind: 'idle' | 'sending' } | { kind: 'sent' | 'failed'; message: string };

export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [turnstileToken, setTurnstileToken] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    if (!turnstileToken) {
      setStatus({
        kind: 'failed',
        message: 'Güvenlik doğrulaması henüz tamamlanmadı. Birkaç saniye bekleyip tekrar deneyin.',
      });
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, turnstileToken }),
      });
      const body = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok || !body.ok) {
        setStatus({ kind: 'failed', message: body.message });
        return;
      }

      reset();
      setTurnstileToken('');
      setStatus({
        kind: 'sent',
        message: 'Talebiniz alındı. En geç bir iş günü içinde dönüş yapacağız.',
      });
    } catch {
      setStatus({
        kind: 'failed',
        message: 'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.',
      });
    }
  }

  const fieldClass =
    'w-full border border-[var(--color-rule)] bg-[var(--color-sunken)] px-3 py-2.5 ' +
    'text-[length:var(--text-sm)] text-[var(--color-text)] focus:border-[var(--color-ink)] focus:outline-none';

  const labelClass = 'mb-1.5 block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]';
  const errorClass = 'mt-1.5 text-[length:var(--text-xs)] text-[var(--color-stamp)]';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Bal küpü — ekran okuyuculardan ve görünümden gizli, botlar doldurur */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="website">Bu alanı boş bırakın</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Ad soyad <span className="text-[var(--color-stamp)]">*</span>
        </label>
        <input
          id="name"
          className={fieldClass}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className={errorClass} role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-posta <span className="text-[var(--color-stamp)]">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={fieldClass}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className={errorClass} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            className={fieldClass}
            autoComplete="tel"
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
          {errors.phone && (
            <p id="phone-error" className={errorClass} role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="topic" className={labelClass}>
          Konu <span className="text-[var(--color-stamp)]">*</span>
        </label>
        <select
          id="topic"
          className={fieldClass}
          defaultValue=""
          aria-invalid={Boolean(errors.topic)}
          aria-describedby={errors.topic ? 'topic-error' : undefined}
          {...register('topic')}
        >
          <option value="" disabled>
            Konu seçin
          </option>
          {contactTopics.map((topic) => (
            <option key={topic} value={topic}>
              {TOPIC_LABELS[topic]}
            </option>
          ))}
        </select>
        {errors.topic && (
          <p id="topic-error" className={errorClass} role="alert">
            {errors.topic.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Talebiniz <span className="text-[var(--color-stamp)]">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          className={fieldClass}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className={errorClass} role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="kvkkConsent"
          type="checkbox"
          className="mt-1 size-4 accent-[var(--color-ink)]"
          aria-invalid={Boolean(errors.kvkkConsent)}
          aria-describedby={errors.kvkkConsent ? 'kvkk-error' : undefined}
          {...register('kvkkConsent')}
        />
        <label
          htmlFor="kvkkConsent"
          className="text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
        >
          Kişisel verilerimin{' '}
          <a href="/kvkk" className="text-[var(--color-ink)] underline underline-offset-2">
            aydınlatma metni
          </a>{' '}
          kapsamında işlenmesine onay veriyorum.
        </label>
      </div>
      {errors.kvkkConsent && (
        <p id="kvkk-error" className={errorClass} role="alert">
          {errors.kvkkConsent.message}
        </p>
      )}

      <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} />

      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className="w-full bg-[var(--color-ink)] px-6 py-3 text-[length:var(--text-sm)] font-medium text-white transition-colors hover:bg-[var(--color-ink-strong)] disabled:opacity-60"
      >
        {status.kind === 'sending' ? 'Gönderiliyor…' : 'Talebi gönder'}
      </button>

      <div aria-live="polite" className="min-h-6">
        {status.kind === 'sent' && (
          <p className="border-l-2 border-[var(--color-approved)] bg-[var(--color-approved-soft)] px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-text)]">
            {status.message}
          </p>
        )}
        {status.kind === 'failed' && (
          <p
            role="alert"
            className="border-l-2 border-[var(--color-stamp)] bg-[var(--color-stamp-soft)] px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-text)]"
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}

'use client';

import Script from 'next/script';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile — görünmez bot doğrulaması.
 *
 * reCAPTCHA yerine tercih edildi: kullanıcıya bulmaca çözdürmez, kişisel veri
 * toplamaz ve KVKK açısından daha temiz bir konumda durur.
 *
 * DAYANIKLILIK: Betik yüklenemez veya widget hata verirse `onUnavailable`
 * çağrılır. Form bunu bir kilit sebebi olarak DEĞİL, "jetonsuz gönder" sinyali
 * olarak kullanır — sunucu jetonsuz isteği daha katı ele alır.
 *
 * Jeton süresi dolarsa (yaklaşık 5 dakika) widget otomatik yenilenir.
 */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

interface Props {
  siteKey: string;
  onToken: (token: string) => void;
  /** Betik/işlem başarısız olduğunda — form jetonsuz göndermeye izin verir. */
  onUnavailable?: () => void;
}

/** Betik bu süre içinde yüklenmezse doğrulamayı "erişilemez" sayarız. */
const LOAD_TIMEOUT_MS = 12_000;

export function TurnstileWidget({ siteKey, onToken, onUnavailable }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const domId = useId();

  const render = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'auto',
      language: 'tr',
      callback: (token: string) => onToken(token),
      'expired-callback': () => {
        onToken('');
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      },
      'error-callback': () => {
        onToken('');
        onUnavailable?.();
      },
    });
  }, [siteKey, onToken, onUnavailable]);

  useEffect(() => {
    if (ready) render();
    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [ready, render]);

  // Yükleme zaman aşımı: betik hiç hazır olmazsa formu kilitli bırakmayız.
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => {
      if (!widgetIdRef.current) onUnavailable?.();
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [ready, onUnavailable]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setReady(true)}
        onError={() => onUnavailable?.()}
      />
      <div ref={containerRef} id={domId} />
    </>
  );
}

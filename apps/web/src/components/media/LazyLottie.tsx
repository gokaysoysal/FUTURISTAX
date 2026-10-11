'use client';

import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

/**
 * Tembel Lottie — bir kavramı anlatırken kullanılır, süs olarak değil.
 *
 * - `lottie-react` yalnızca görünüre girince mount edilir (`dynamic(ssr:false)`
 *   + IntersectionObserver). Bileşen `src`'yi kendisi fetch eder.
 * - `prefers-reduced-motion: reduce` → oynatma YOK, ilk kare donuk.
 * - Varsayılan `aria-hidden`; anlamlıysa `label` ver → `role="img"`.
 *
 * `src`: `/lottie/xxx.json` (public altında). Dosya yoksa lottie-react sessiz
 * kalır; layout kaymaz (kutu yüksekliği `className` ile sabitlenmeli).
 */
const Lottie = dynamic(() => import('lottie-react').then((m) => m.Lottie), { ssr: false });

export function LazyLottie({
  src,
  label,
  loop = true,
  className = '',
}: {
  src: string;
  label?: string;
  loop?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {inView ? (
        <Lottie
          src={src}
          loop={reduce ? false : loop}
          autoplay={!reduce}
          segment={reduce ? [0, 0] : undefined}
        />
      ) : null}
    </div>
  );
}

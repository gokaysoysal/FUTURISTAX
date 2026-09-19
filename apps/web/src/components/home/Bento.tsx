import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Bento ızgara yardımcıları (V6 — referans cilası).
 *
 * Referanstaki asimetrik "bir kahraman kutu + destek kutuları" düzeni için
 * paylaşılan iki bileşen. `Bento` kademeli reveal grubunu (`RevealGroup`)
 * sarar; `BentoTile` her hücreyi `card` + `surface-glow` ile kurar ve span
 * sınıflarını grid öğesine (`RevealItem`) geçirir.
 *
 * `<lg` altında ızgara tek/çift sütuna iner; asimetrik span'ler `lg`+ için.
 * reduced-motion guard'ı `Reveal` bileşenlerinde.
 */

export function Bento({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <RevealGroup className={`grid gap-4 ${className}`.trim()}>{children}</RevealGroup>;
}

type TileProps = {
  children: ReactNode;
  /** grid öğesine giden span sınıfları, ör. "lg:col-span-2 lg:row-span-3" */
  span?: string;
  /** iç kabuğa eklenecek sınıflar (featured vurgusu vb.) */
  className?: string;
  /** verilirse kutu bir <Link> olur */
  href?: string;
  as?: 'article' | 'figure' | 'div';
  interactive?: boolean;
  glow?: boolean;
};

export function BentoTile({
  children,
  span = '',
  className = '',
  href,
  as: Tag = 'article',
  interactive = true,
  glow = true,
}: TileProps) {
  const shell = [
    'card',
    interactive ? 'card-interactive' : '',
    glow ? 'surface-glow' : '',
    'flex h-full flex-col gap-4 p-6',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RevealItem className={span}>
      {href ? (
        <Link href={href} className={shell}>
          {children}
        </Link>
      ) : (
        <Tag className={shell}>{children}</Tag>
      )}
    </RevealItem>
  );
}

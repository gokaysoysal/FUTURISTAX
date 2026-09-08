import NextImage, { type ImageProps } from 'next/image';

/**
 * İşlenmiş görsel — next/image + duotone + grain (art.css `.treated`).
 *
 * Ham stok fotoğraf kullanılmaz; bu sarmalayıcı görseli gri tonlayıp palet
 * rengine boyar. AVIF/WebP'yi next/image otomatik üretir.
 *
 * - `alt`: anlamlıysa yaz, dekoratifse `alt=""` geç (zorunlu, ImageProps).
 * - `sizes`: layout'a göre ver; verilmezse `fill` görselleri tüm genişliği ister.
 * - `tone`: duotone rengi — accent (varsayılan) | signal | neutral.
 */
export function TreatedImage({
  tone = 'accent',
  className = '',
  wrapperClassName = '',
  ...props
}: ImageProps & {
  tone?: 'accent' | 'signal' | 'neutral';
  wrapperClassName?: string;
}) {
  const toneClass =
    tone === 'signal' ? 'treated--signal' : tone === 'neutral' ? 'treated--neutral' : '';
  return (
    <span className={`treated block ${toneClass} ${wrapperClassName}`.trim()}>
      <NextImage
        {...props}
        className={className}
        // Yer tutucu bulanıklık verilmemişse yumuşak bir renk yer tutucu.
        placeholder={props.placeholder ?? (props.blurDataURL ? 'blur' : 'empty')}
      />
    </span>
  );
}

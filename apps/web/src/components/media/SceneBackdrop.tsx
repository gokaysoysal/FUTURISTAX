/**
 * Prosedürel sahne zemini — gerçek fotoğraf gelene kadar görsel boşluğu
 * doldurur. Tamamı SVG: çözünürlükten bağımsız, palet tokenlarına bağlı
 * (`currentColor` = --color-accent, art.css `.scene-backdrop`), lisans/atıf
 * gerektirmez. Dekoratif — `aria-hidden`, `pointer-events: none`.
 *
 * Sanat yönü: brütalist/modernist — beton doku, geometrik gölge, belge
 * ızgarası, ışık alanı. Kurumsal klişe yok.
 *
 * Filtre id'leri variant başına sabit; aynı sayfada birden çok kopya olsa
 * bile filtreler özdeş olduğu için görsel fark yok.
 */
type Variant = 'concrete' | 'geometric-shadow' | 'document-grid' | 'light-field';

const VIEWBOX = '0 0 1200 800';

function Concrete() {
  return (
    <svg viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="sb-concrete" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.02"
            numOctaves="3"
            seed="7"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.85 0" />
        </filter>
      </defs>
      <rect width="1200" height="800" fill="currentColor" opacity="0.035" />
      <rect width="1200" height="800" filter="url(#sb-concrete)" opacity="0.5" />
      <g stroke="currentColor" strokeWidth="1" opacity="0.1" fill="none">
        <path d="M0 180 L1200 118" />
        <path d="M0 566 L1200 640" />
        <path d="M336 0 L372 800" />
      </g>
    </svg>
  );
}

function GeometricShadow() {
  return (
    <svg viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="sb-geo-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="26"
            stdDeviation="34"
            floodColor="currentColor"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
      <g fill="currentColor" filter="url(#sb-geo-shadow)">
        <polygon points="120,-40 760,-40 560,520 -60,520" opacity="0.06" />
        <polygon points="820,120 1320,60 1320,700 700,760" opacity="0.05" />
        <polygon points="240,440 660,400 720,900 180,900" opacity="0.04" />
      </g>
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.14" fill="none">
        <polygon points="120,-40 760,-40 560,520 -60,520" />
      </g>
    </svg>
  );
}

function DocumentGrid() {
  return (
    <svg viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="sb-doc-grid" width="40" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 27.5 H40" stroke="currentColor" strokeWidth="1" opacity="0.09" />
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#sb-doc-grid)" />
      <g fill="currentColor">
        <rect x="80" y="96" width="220" height="10" opacity="0.14" />
        <rect x="80" y="124" width="150" height="10" opacity="0.1" />
        <rect x="900" y="600" width="180" height="10" opacity="0.12" />
        <rect x="80" y="640" width="90" height="90" opacity="0.05" />
      </g>
      <line x1="60" y1="60" x2="60" y2="740" stroke="currentColor" strokeWidth="2" opacity="0.2" />
    </svg>
  );
}

function LightField() {
  return (
    <svg viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="sb-lf-a" cx="18%" cy="0%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sb-lf-b" cx="92%" cy="88%" r="65%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sb-lf-a)" />
      <rect width="1200" height="800" fill="url(#sb-lf-b)" />
      <g stroke="currentColor" strokeWidth="2" opacity="0.08" fill="none">
        <path d="M-100 700 Q400 300 1300 260" />
        <path d="M-100 780 Q500 420 1300 360" />
      </g>
    </svg>
  );
}

const VARIANTS: Record<Variant, () => React.ReactElement> = {
  concrete: Concrete,
  'geometric-shadow': GeometricShadow,
  'document-grid': DocumentGrid,
  'light-field': LightField,
};

export function SceneBackdrop({
  variant = 'light-field',
  className = '',
}: {
  variant?: Variant;
  className?: string;
}) {
  const Shape = VARIANTS[variant];
  return (
    <div aria-hidden="true" className={`scene-backdrop ${className}`.trim()}>
      <Shape />
    </div>
  );
}

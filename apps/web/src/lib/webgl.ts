/** WebGL desteği var mı — test bağlamı açıp kapatır. İstemci tarafı. */
export function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * :root'tan bir renk tokenini `#rrggbb` olarak çözer. WebGL üniformları
 * paleti buradan alır — sahne kendi rengini getirmez.
 */
export function readColorToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** `#rrggbb` → WebGL üniforma verilecek 0..1 RGB üçlüsü. Geçersizse fallback lacivert. */
export function hexToRgb(hex: string): [number, number, number] {
  const trimmed = hex.trim();
  if (!/^#[0-9a-f]{6}$/i.test(trimmed)) return [0.04, 0.05, 0.15];
  const int = Number.parseInt(trimmed.slice(1), 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

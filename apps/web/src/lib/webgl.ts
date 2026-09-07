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

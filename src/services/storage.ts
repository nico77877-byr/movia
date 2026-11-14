/** Preferencias locales de la interfaz (no son datos de negocio). */
export function readLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
export function writeLS<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* almacenamiento no disponible */ }
}
export function removeLS(key: string): void {
  try { localStorage.removeItem(key); } catch { /* almacenamiento no disponible */ }
}

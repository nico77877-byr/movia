import { CIUDADES } from '../config/catalogos';
import type { LatLng } from '../types';

const R = Math.PI / 180;
export const coords = (ciudad: string): LatLng | undefined => CIUDADES[ciudad];

export function distanciaKm(a: LatLng, b: LatLng): number {
  const h = Math.sin(((b[0] - a[0]) * R) / 2) ** 2 + Math.cos(a[0] * R) * Math.cos(b[0] * R) * Math.sin(((b[1] - a[1]) * R) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
/** Distancia estimada por carretera: línea recta × 1,3. El servidor puede recalcularla. */
export function routeKm(o: string, d: string): number {
  const a = coords(o), b = coords(d);
  return a && b ? Math.round(distanciaKm(a, b) * 1.3) : 0;
}
/** Rumbo en grados (0 = norte) de a hacia b. */
export const rumbo = (a: LatLng, b: LatLng) => (Math.atan2((b[1] - a[1]) * Math.cos(a[0] * R), b[0] - a[0]) / R + 360) % 360;
export const kmRuta = (r: LatLng[]) => r.slice(1).reduce((s, p, i) => s + distanciaKm(r[i], p), 0);

/** Separa una ruta en lo ya recorrido y lo que falta, según la posición actual. */
export function dividirRuta(ruta: LatLng[], pos: LatLng) {
  let idx = 0, mejor = Infinity;
  ruta.forEach((p, i) => { const d = distanciaKm(p, pos); if (d < mejor) { mejor = d; idx = i; } });
  return { hecha: [...ruta.slice(0, idx + 1), pos] as LatLng[], resto: [pos, ...ruta.slice(idx + 1)] as LatLng[] };
}

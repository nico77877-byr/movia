import { coords, dividirRuta, kmRuta } from '../services/geo';
import type { Envio, LatLng } from '../types';

const VELOCIDAD_PROMEDIO_KMH = 50;

/** Trazado del envío: el que entrega el servidor o, si no hay, una línea origen → destino. */
export const rutaDe = (e: Envio): LatLng[] =>
  e.ruta && e.ruta.length > 1 ? e.ruta : [coords(e.o), coords(e.d)].filter((p): p is LatLng => Boolean(p));

export function kmRestantes(e: Envio): number {
  const ruta = rutaDe(e);
  return Math.round(kmRuta(e.estado === 'En tránsito' && e.pos ? dividirRuta(ruta, e.pos).resto : ruta));
}
export const etaMin = (e: Envio) => Math.max(1, Math.round((kmRestantes(e) / VELOCIDAD_PROMEDIO_KMH) * 60));

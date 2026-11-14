import type { Load } from '../types';

export const money = (n: number) => '$ ' + n.toLocaleString('es-CO');
export const when = (l: Pick<Load, 'date' | 'time'>) =>
  new Date(l.date + 'T12:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) + ' · ' + l.time;
export const errorMsg = (e: unknown, fallback = 'Ocurrió un error inesperado') => (e instanceof Error ? e.message : fallback);

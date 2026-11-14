import { leer } from './http';
import type { Resumen } from '../types';

/** Indicadores del panel de administración. `null` si aún no hay base de datos. */
export const obtenerResumen = () => leer<Resumen | null>('/admin/resumen', null);

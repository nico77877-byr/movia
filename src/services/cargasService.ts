import { api, leer } from './http';
import type { Load, NuevaCarga } from '../types';

export const listarCargas = () => leer<Load[]>('/cargas', []);
export const crearCarga = (c: NuevaCarga) => api.post<Load>('/cargas', c);
export const ofertar = (cargaId: string, valor: number) => api.post<void>(`/cargas/${encodeURIComponent(cargaId)}/ofertas`, { valor });

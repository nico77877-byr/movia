import { api, leer } from './http';
import type { Trip } from '../types';

export const listarViajes = () => leer<Trip[]>('/viajes', []);
export const avanzarViaje = (id: string) => api.patch<Trip>(`/viajes/${encodeURIComponent(id)}/avanzar`);

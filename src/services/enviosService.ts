import { api, leer } from './http';
import type { Envio, NuevoEnvio } from '../types';

/** Envíos del usuario autenticado; incluye la posición en vivo del vehículo. */
export const listarEnvios = () => leer<Envio[]>('/envios', []);
export const crearEnvio = (e: NuevoEnvio) => api.post<Envio>('/envios', e);

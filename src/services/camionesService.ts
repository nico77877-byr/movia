import { leer } from './http';
import type { Truck } from '../types';

export const listarCamiones = () => leer<Truck[]>('/camiones', []);

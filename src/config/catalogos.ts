import type { Body, LatLng } from '../types';

export const CIUDADES: Record<string, LatLng> = {
  Duitama: [5.827, -73.034], Tunja: [5.535, -73.367], Sogamoso: [5.714, -72.93], 'Bogotá': [4.711, -74.072],
  'Chiquinquirá': [5.619, -73.818], Paipa: [5.78, -73.117], Villavicencio: [4.142, -73.627], 'Zipaquirá': [5.022, -74.004],
};
export const NOMBRES_CIUDADES = Object.keys(CIUDADES);
export const CARROCERIAS: { id: Body; hint: string }[] = [
  { id: 'Estacas', hint: 'Carga abierta con barandas' }, { id: 'Furgón', hint: 'Carga cerrada y protegida' },
  { id: 'Planchón', hint: 'Plataforma plana, carga voluminosa' }, { id: 'Carpado', hint: 'Cubierto con lona' },
  { id: 'Refrigerado', hint: 'Alimentos y carga fría' },
];
export const ESTADOS_VIAJE = ['Pendiente', 'Aceptado', 'En recogida', 'En tránsito', 'Entregado'];

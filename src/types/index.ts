export type LatLng = [number, number];
export type City = string;
export type Body = 'Estacas' | 'Furgón' | 'Planchón' | 'Carpado' | 'Refrigerado';
export type Role = 'usuario' | 'admin';

export interface AuthUser { id: string; name: string; email: string; role: Role; }

export type LoadStatus = 'Pendiente' | 'Con oferta' | 'Publicada';
export interface Load {
  id: string; client: string; o: City; d: City; p: number; kg: number; b: Body;
  date: string; time: string; st: LoadStatus; km: number; desc?: string;
}
export interface NuevaCarga {
  client: string; goods: string; o: City; oaddr: string; d: City; daddr: string; date: string; time: string;
  kg: number; dims: { l: number; a: number; h: number }; b: Body; p: number; km: number; desc: string;
}

export type TruckState = 'd' | 'm' | 'x'; // disponible, en movimiento, incidencia
export interface Truck { id: string; n: string; c: City; b: Body; cap: number; s: TruckState; pos: LatLng; }

export interface Trip { id: string; route: string; state: number; }

export type Estado = 'Buscando conductor' | 'En recogida' | 'En tránsito' | 'Entregado';
export interface Driver { name: string; plate: string; rating: number; body: Body; }
export interface Envio {
  id: string; o: City; d: City; goods: string; kg: number; body: Body; price: number; estado: Estado;
  driver?: Driver;
  /** Posición actual del vehículo (cuando va en recogida o en tránsito). */
  pos?: LatLng;
  /** Trazado de la ruta; si no viene, se dibuja una línea recta origen → destino. */
  ruta?: LatLng[];
}
export interface NuevoEnvio { o: City; d: City; goods: string; kg: number; body: Body; price: number; }

export interface Resumen {
  cargasDisponibles: number; viajesEnCurso: number; entregasCompletadas: number;
  conductoresActivos: number; facturacionEstimada: number; incidencias: number;
}
export interface Filters { o: string; d: string; c: number; date: string; }
export interface ChatMsg { id: number; from: 'u' | 'b'; text: string; }
export type Tab = 'seguir' | 'pedir' | 'envios';

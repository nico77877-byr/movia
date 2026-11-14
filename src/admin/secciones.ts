export const SECCIONES = [
  'Dashboard', 'Mapa en tiempo real', 'Publicar carga', 'Cargas de retorno', 'Viajes',
  'Conductores', 'Vehículos', 'Finanzas', 'Documentos', 'Reportes', 'Alertas', 'Configuración',
] as const;
export type Seccion = (typeof SECCIONES)[number];

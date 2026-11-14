import type { Estado } from '../types';

export const ESTADOS: Estado[] = ['Buscando conductor', 'En recogida', 'En tránsito', 'Entregado'];
export const TONE: Record<Estado, string> = { 'Buscando conductor': 'text-org', 'En recogida': 'text-electric', 'En tránsito': 'text-lime', Entregado: 'text-mu' };

export function Stepper({ estado }: { estado: Estado }) {
  const i = ESTADOS.indexOf(estado);
  return (
    <div className="flex gap-1" role="img" aria-label={`Estado: ${estado}`}>
      {ESTADOS.map((s, j) => <i key={s} className={`h-1.5 flex-1 rounded ${j <= i ? 'bg-lime' : 'bg-[#1a2c42]'}`} />)}
    </div>
  );
}

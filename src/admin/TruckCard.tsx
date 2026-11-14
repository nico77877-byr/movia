import type { Truck } from '../types';
import { useApp } from '../context/AppContext';

export const TRUCK_TAG = { d: ['text-lime', 'Disponible'], m: ['text-electric', 'En movimiento'], x: ['text-danger', 'Incidencia'] } as const;

export default function TruckCard({ t, onPick }: { t: Truck; onPick: (id: string) => void }) {
  const { sel, toast } = useApp();
  const [cls, label] = TRUCK_TAG[t.s];
  return (
    <div onClick={() => onPick(t.id)} className={`card cursor-pointer transition ${sel === t.id ? 'border-lime ring-1 ring-lime' : 'hover:border-lime'}`}>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-1.5"><h4 className="min-w-0 break-words font-semibold">{t.n}</h4><span className={`tag shrink-0 ${cls}`}>{label}</span></div>
      <div className="my-2 flex flex-wrap gap-x-3 text-xs text-mu"><span>{t.c}</span><span>Turbo {t.b.toLowerCase()}</span><span>Hasta {t.cap.toLocaleString('es-CO')} kg</span></div>
      <div className="grid grid-cols-2 gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button className="btn-g btn-s min-h-10" onClick={() => onPick(t.id)}>Ver detalles</button>
        <button className="btn btn-s min-h-10" onClick={() => toast(`El contacto con ${t.n} estará disponible al conectar el servicio de mensajes`)}>Contactar</button>
      </div>
    </div>
  );
}

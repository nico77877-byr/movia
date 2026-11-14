import { CalendarClock, Route, Weight, Truck } from 'lucide-react';
import type { Load } from '../types';
import { useApp } from '../context/AppContext';
import { money, when } from '../services/format';

const TONE = { Pendiente: 'text-org', 'Con oferta': 'text-electric', Publicada: 'text-lime' } as const;

export default function LoadCard({ l, onPick }: { l: Load; onPick: (id: string) => void }) {
  const { sel, openOffer } = useApp();
  return (
    <div onClick={() => onPick(l.id)} className={`card cursor-pointer transition ${sel === l.id ? 'border-lime ring-1 ring-lime' : 'hover:border-lime'}`}>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-1.5"><h4 className="min-w-0 break-words font-semibold">{l.o} → {l.d}</h4><span className="shrink-0 font-semibold text-lime">{money(l.p)}</span></div>
      <div className="my-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-mu">
        <span className="flex items-center gap-1"><Weight size={12} />{l.kg.toLocaleString('es-CO')} kg</span>
        <span className="flex items-center gap-1"><Truck size={12} />Turbo {l.b.toLowerCase()}</span>
        <span className="flex items-center gap-1"><Route size={12} />{l.km} km</span>
        <span className="flex items-center gap-1"><CalendarClock size={12} />{when(l)}</span>
      </div>
      <span className={`tag ${TONE[l.st]}`}>{l.st}</span>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button className="btn-g btn-s min-h-10" onClick={() => onPick(l.id)}>Ver detalles</button>
        <button className="btn btn-s min-h-10" onClick={() => openOffer(l)}>Ofertar</button>
      </div>
    </div>
  );
}

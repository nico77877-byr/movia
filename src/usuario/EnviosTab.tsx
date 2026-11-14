import { MapPin } from 'lucide-react';
import { Stepper, TONE } from './ui';
import { money } from '../services/format';
import type { Envio, Tab } from '../types';

export default function EnviosTab({ envios, error, onView, go }: { envios: Envio[]; error: string; onView: (id: string) => void; go: (t: Tab) => void }) {
  return (
    <div className="mx-auto max-w-4xl p-4" data-tour="lista">
      <h2 className="mb-3 text-xl font-semibold">Mis envíos</h2>
      {envios.length === 0 ? (
        <div className="card text-center text-mu">{error || 'Todavía no has pedido ningún transporte.'}<br /><button className="btn mt-3" onClick={() => go('pedir')}>Pedir transporte</button></div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {envios.map((e) => (
            <div key={e.id} className="card">
              <div className="mb-1 flex items-start justify-between gap-2"><h3 className="font-semibold">{e.o} → {e.d}</h3><span className={`tag ${TONE[e.estado]}`}>{e.estado}</span></div>
              <p className="mb-3 text-xs text-mu">{e.id} · {e.goods} · {e.kg.toLocaleString('es-CO')} kg · Turbo {e.body.toLowerCase()} · {money(e.price)}</p>
              <Stepper estado={e.estado} />
              <button className="btn-g btn-s mt-3 flex items-center gap-1.5" onClick={() => onView(e.id)}><MapPin size={14} />Ver en el mapa</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

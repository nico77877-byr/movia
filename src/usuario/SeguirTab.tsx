import { Loader2, MessageCircle, Phone, Star } from 'lucide-react';
import LiveMap from './LiveMap';
import { Stepper, TONE } from './ui';
import { etaMin, kmRestantes } from './envio';
import { money } from '../services/format';
import type { Envio, Tab } from '../types';

interface Props { envios: Envio[]; sel: string | null; setSel: (id: string) => void; follow: boolean; setFollow: (v: boolean) => void; go: (t: Tab) => void; notify: (t: string) => void; }

export default function SeguirTab({ envios, sel, setSel, follow, setFollow, go, notify }: Props) {
  const e = envios.find((x) => x.id === sel);
  const contacto = (nombre: string) => notify(`El contacto con ${nombre} estará disponible al conectar el servicio de mensajes`);
  return (
    <div className="relative h-full" data-tour="map">
      <LiveMap envios={envios} sel={sel} onSelect={(id) => { setSel(id); setFollow(false); }} follow={follow} onFollow={setFollow} />
      <div className="absolute inset-x-0 top-0 z-[1000] flex gap-2 overflow-x-auto p-3">
        {envios.map((x) => (
          <button key={x.id} onClick={() => { setSel(x.id); setFollow(false); }}
            className={`chip shrink-0 !bg-card/95 !px-3.5 !py-1.5 ${x.id === sel ? 'chip-on !bg-lime' : ''}`}>{x.o} → {x.d}</button>
        ))}
        {envios.length === 0 && <span className="chip !bg-card/95">Aún no tienes envíos</span>}
      </div>
      <div className="absolute bottom-3 left-3 right-[4.5rem] z-[1000] sm:right-auto sm:w-[400px]" data-tour="envio-card">
        {!e ? (
          <div className="card text-center"><p className="mb-2 text-mu">{envios.length ? 'Elige un envío arriba.' : 'Pide tu primer transporte y síguelo aquí.'}</p><button className="btn" onClick={() => go('pedir')}>Pedir transporte</button></div>
        ) : (
          <div className="card !bg-card/95 backdrop-blur">
            <div className="mb-2 flex items-center justify-between gap-2"><h3 className="font-semibold">{e.o} → {e.d}</h3><span className={`tag ${TONE[e.estado]}`}>{e.estado}</span></div>
            <Stepper estado={e.estado} />
            {e.estado === 'Buscando conductor' && <p className="mt-3 flex items-center gap-2 text-mu"><Loader2 size={15} className="animate-spin" />Buscando el mejor turbo para tu carga…</p>}
            {(e.estado === 'En recogida' || e.estado === 'En tránsito') && (<>
              <div className="mt-3 flex items-center gap-3">
                {e.driver ? (<>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lime to-electric font-bold text-bg">{e.driver.name[0]}</span>
                  <div className="min-w-0 flex-1"><b className="block truncate">{e.driver.name}</b>
                    <span className="flex items-center gap-1.5 text-xs text-mu"><Star size={12} className="text-lime" />{e.driver.rating} · Turbo {e.driver.body.toLowerCase()} · {e.driver.plate}</span></div>
                </>) : <div className="min-w-0 flex-1 text-mu">Conductor asignado</div>}
                <div className="text-right"><b className="block text-lime">{e.estado === 'En recogida' ? 'Va por tu carga' : `~${etaMin(e)} min`}</b>
                  <span className="text-xs text-mu">{e.estado === 'En tránsito' ? `${kmRestantes(e)} km restantes` : 'Llegando'}</span></div>
              </div>
              {e.driver && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="btn-g btn-s flex items-center justify-center gap-1.5" onClick={() => contacto(e.driver!.name)}><Phone size={14} />Llamar</button>
                  <button className="btn-g btn-s flex items-center justify-center gap-1.5" onClick={() => contacto(e.driver!.name)}><MessageCircle size={14} />Escribir</button>
                </div>
              )}
              <p className="mt-2 text-[11px] text-mu">Tiempo estimado a 50 km/h de promedio.</p>
            </>)}
            {e.estado === 'Entregado' && <div className="mt-3 flex items-center justify-between gap-2"><span className="text-mu">Entregado · {money(e.price)}</span><button className="btn btn-s" onClick={() => go('pedir')}>Pedir otro</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}

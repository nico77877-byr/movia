import { useApp } from '../context/AppContext';
import { useRecurso } from '../hooks/useRecurso';
import { ESTADOS_VIAJE } from '../config/catalogos';
import { avanzarViaje, listarViajes } from '../services/viajesService';
import { errorMsg } from '../services/format';

export default function ViajesPage() {
  const { toast, version, refrescar } = useApp();
  const { datos: trips, error } = useRecurso(listarViajes, { version });
  const avanzar = async (id: string, siguiente: string) => {
    try { await avanzarViaje(id); refrescar(); toast(`Estado actualizado: ${siguiente}`); } catch (e) { toast(errorMsg(e)); }
  };
  return (
    <div className="p-3 sm:p-4">
      <h2 className="mb-3 text-xl font-semibold">Viajes</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {trips.length === 0 && <div className="card text-mu">{error || 'Aún no hay viajes registrados.'}</div>}
        {trips.map((t) => (
          <div key={t.id} className="card">
            <h4 className="font-semibold">{t.route}</h4>
            <span className={`tag ${t.state === 4 ? 'text-lime' : 'text-electric'}`}>{ESTADOS_VIAJE[t.state]}</span>
            <div className="my-2.5 flex gap-1">{ESTADOS_VIAJE.map((e, j) => <i key={e} className={`h-1.5 flex-1 rounded ${j <= t.state ? 'bg-lime' : 'bg-[#1a2c42]'}`} />)}</div>
            {t.state < 4 ? <button className="btn btn-s" onClick={() => avanzar(t.id, ESTADOS_VIAJE[t.state + 1])}>Pasar a «{ESTADOS_VIAJE[t.state + 1]}»</button> : <span className="text-mu">Viaje cerrado</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

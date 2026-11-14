import { useState } from 'react';
import { MapPin } from 'lucide-react';
import LoadCard from './LoadCard';
import { useApp } from '../context/AppContext';
import { useRecurso } from '../hooks/useRecurso';
import { listarCargas } from '../services/cargasService';
import { CARROCERIAS, NOMBRES_CIUDADES } from '../config/catalogos';
import type { Body, City, Load } from '../types';
import type { Seccion } from './secciones';

export default function ReturnPage({ go }: { go: (s: Seccion) => void }) {
  const { setSel, toast, version } = useApp();
  const { datos: loads } = useRecurso(listarCargas, { version });
  const BODIES = CARROCERIAS.map((c) => c.id);
  const [city, setCity] = useState<City | ''>('');
  const [body, setBody] = useState<Body | 'Todas'>('Todas');
  const [res, setRes] = useState<{ city: string; items: Load[] } | null>(null);

  const search = () => {
    if (!city) { toast('Selecciona la ciudad donde quedó tu turbo'); return; }
    const items = loads.filter((l) => l.o === city && (body === 'Todas' || l.b === body));
    setRes({ city, items }); toast(`${items.length} oportunidades de retorno desde ${city}`);
  };
  return (
    <div className="p-3 sm:p-4">
      <h2 className="mb-3 text-xl font-semibold">Encuentra tu carga de retorno</h2>
      <div className="card mb-3 max-w-3xl">
        <p className="mb-3 text-mu">Indica dónde quedó tu turbo y el tipo de carrocería para buscar cargas de retorno disponibles.</p>
        <div className="grid items-end gap-2.5 sm:grid-cols-3">
          <div><label className="lbl">Ciudad donde quedó tu turbo</label><select value={city} onChange={(e) => setCity(e.target.value as City | '')}><option value="">Selecciona una ciudad</option>{NOMBRES_CIUDADES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="lbl">Carrocería</label><select value={body} onChange={(e) => setBody(e.target.value as Body | 'Todas')}><option value="Todas">Todas las carrocerías</option>{BODIES.map((b) => <option key={b}>{b}</option>)}</select></div>
          <button className="btn w-full sm:w-auto" onClick={search}>Buscar retorno</button>
        </div>
      </div>
      {res && (<>
        <div className="card mb-3 flex flex-wrap items-center gap-2"><MapPin size={16} className="text-lime" /><b>Tu turbo quedó en {res.city}</b>
          <span className="text-mu">· {res.items.length ? `Destinos: ${[...new Set(res.items.map((l) => l.d))].join(', ')}` : loads.length === 0 ? 'Aún no hay cargas en la base de datos.' : 'Sin cargas para esta búsqueda. Prueba otra carrocería o ciudad.'}</span></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {res.items.map((l) => <LoadCard key={l.id} l={l} onPick={(id) => { setSel(id); go('Mapa en tiempo real'); }} />)}
        </div>
      </>)}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import MapView from './MapView';
import LoadCard from './LoadCard';
import TruckCard from './TruckCard';
import { useApp } from '../context/AppContext';
import { useRecurso } from '../hooks/useRecurso';
import { listarCargas } from '../services/cargasService';
import { listarCamiones } from '../services/camionesService';
import { CARROCERIAS, NOMBRES_CIUDADES } from '../config/catalogos';
import { POLL_MS } from '../config/env';
import type { Body, Filters } from '../types';

type Mode = 'cargas' | 'turbos';
const EMPTY: Filters = { o: '', d: '', c: 0, date: '' };

export default function MapPage() {
  const { sel, setSel, toast, version } = useApp();
  const { datos: loads } = useRecurso(listarCargas, { version, cada: POLL_MS * 5 });
  const { datos: trucks } = useRecurso(listarCamiones, { cada: POLL_MS });
  const BODIES = CARROCERIAS.map((c) => c.id);
  const [mode, setMode] = useState<Mode>('cargas');
  const [body, setBody] = useState<Body | 'Todas'>('Todas');
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [F, setF] = useState<Filters>(EMPTY);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const activeFilterCount = Number(Boolean(F.o)) + Number(Boolean(F.d)) + Number(Boolean(F.c)) + Number(Boolean(F.date)) + Number(body !== 'Todas');

  const fLoads = useMemo(() => loads.filter((l) =>
    (!F.o || l.o === F.o) && (!F.d || l.d === F.d) && (body === 'Todas' || l.b === body) && (!F.c || l.kg <= F.c) && (!F.date || l.date === F.date)), [loads, F, body]);
  const fTrucks = trucks.filter((t) => (!F.o || t.c === F.o) && (body === 'Todas' || t.b === body) && (!F.c || t.cap >= F.c));

  const mapLoads = mode === 'cargas' ? fLoads : [];
  const mapTrucks = mode === 'cargas' ? fTrucks.filter((t) => t.s !== 'd') : fTrucks;
  const availTrucks = fTrucks.filter((t) => t.s === 'd');
  const count = mode === 'cargas' ? fLoads.length : availTrucks.length;
  const pick = (id: string) => setSel(id);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const switchMode = (m: Mode) => { setMode(m); setSel(null); toast(m === 'cargas' ? 'Modo conductor: buscando cargas' : 'Modo cliente: buscando turbos'); };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 p-2.5 sm:p-3 lg:h-full lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex min-h-0 min-w-0 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <div className="inline-flex rounded-xl border border-line bg-[#0b1726] p-1">
            {(['cargas', 'turbos'] as Mode[]).map((m) => (
              <button key={m} onClick={() => switchMode(m)} className={`rounded-lg px-3 py-1.5 ${mode === m ? 'bg-lime font-bold text-bg' : 'text-mu'}`}>{m === 'cargas' ? 'Buscar cargas' : 'Buscar turbos'}</button>
            ))}
          </div>
          <button type="button" aria-expanded={mobileFiltersOpen} aria-controls="map-search-filters" onClick={() => setMobileFiltersOpen(true)}
            className="ml-auto flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-line bg-soft px-3 text-sm font-semibold text-lime sm:hidden">
            <Menu size={18} /> Carrocería
            {activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[11px] text-bg">{activeFilterCount}</span>}
          </button>
          <div className="-mx-2.5 hidden min-w-0 flex-1 gap-1.5 overflow-x-auto px-2.5 pb-1 sm:flex sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {(['Todas', ...BODIES] as const).map((b) => (
              <button key={b} onClick={() => setBody(b)} className={`chip shrink-0 ${body === b ? 'chip-on' : ''}`}>{b === 'Todas' ? 'Todas las carrocerías' : `Turbo ${b.toLowerCase()}`}</button>
            ))}
          </div>
        </div>
        {mobileFiltersOpen && <button type="button" aria-label="Cerrar filtros" onClick={() => setMobileFiltersOpen(false)} className="fixed inset-0 z-[1400] bg-black/60 sm:hidden" />}
        <form id="map-search-filters" className={`${mobileFiltersOpen ? 'fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[1500] grid max-h-[min(70dvh,560px)] grid-cols-1 overflow-y-auto rounded-t-2xl border-x border-t border-line bg-card p-3 shadow-2xl' : 'hidden'} items-end gap-2 sm:static sm:z-auto sm:grid sm:max-h-none sm:grid-cols-2 sm:overflow-visible sm:rounded-xl sm:border sm:bg-card sm:p-3.5 sm:shadow-none md:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto]`} onSubmit={(e) => { e.preventDefault(); setF(draft); setSel(null); setMobileFiltersOpen(false); toast('Búsqueda actualizada'); }}>
          <div className="col-span-full flex items-center justify-between border-b border-line pb-2 sm:hidden">
            <h2 className="font-semibold">Filtros de búsqueda</h2>
            <button type="button" aria-label="Cerrar filtros" onClick={() => setMobileFiltersOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-mu hover:bg-soft hover:text-lime"><X size={18} /></button>
          </div>
          <div className="min-w-0"><label className="lbl">Origen</label><select value={draft.o} onChange={(e) => set('o', e.target.value)}><option value="">Cualquier origen</option>{NOMBRES_CIUDADES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="min-w-0"><label className="lbl">Destino</label><select value={draft.d} onChange={(e) => set('d', e.target.value)}><option value="">Cualquier destino</option>{NOMBRES_CIUDADES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <fieldset className="col-span-full min-w-0 sm:hidden">
            <legend className="lbl">Carrocería del turbo</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['Todas', ...BODIES] as const).map((b) => (
                <button key={b} type="button" aria-pressed={body === b} onClick={() => setBody(b)}
                  className={`min-h-11 rounded-lg border px-3 text-left text-sm transition ${body === b ? 'border-lime bg-lime font-semibold text-bg' : 'border-line bg-[#0b1726] text-mu hover:border-lime'}`}>
                  {b === 'Todas' ? 'Todas las carrocerías' : `Turbo ${b}`}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="hidden min-w-0 sm:block"><label className="lbl">Tipo de turbo</label><select value={body} onChange={(e) => setBody(e.target.value as Body | 'Todas')}><option value="Todas">Todas las carrocerías</option>{BODIES.map((b) => <option key={b}>{b}</option>)}</select></div>
          <div className="min-w-0"><label className="lbl">Fecha de recogida</label><input type="date" value={draft.date} onChange={(e) => set('date', e.target.value)} /></div>
          <div className="min-w-0"><label className="lbl">Capacidad (kg)</label><input type="number" min={0} step={100} placeholder="Ej: 3000" value={draft.c || ''} onChange={(e) => set('c', +e.target.value)} /></div>
          <div className="col-span-full flex gap-2 pt-1">
            <button type="button" className="btn-g min-h-11 flex-1" onClick={() => { setDraft(EMPTY); setF(EMPTY); setBody('Todas'); setSel(null); setMobileFiltersOpen(false); toast('Filtros limpiados'); }}>Limpiar</button>
            <button className="btn min-h-11 flex-1">Aplicar filtros</button>
          </div>
        </form>
        <div className="h-[42dvh] min-h-[260px] max-h-[460px] min-w-0 flex-none lg:h-auto lg:min-h-[420px] lg:flex-1"><MapView loads={mapLoads} trucks={mapTrucks} sel={sel} onPick={pick} onClear={(id) => setSel((c) => (c === id ? null : c))} /></div>
      </div>
      <aside className="flex min-h-0 min-w-0 flex-col gap-2.5 lg:overflow-y-auto">
        <div className="flex items-center justify-between"><h3 className="font-semibold">{mode === 'cargas' ? 'Cargas disponibles' : 'Turbos disponibles'}</h3><span className="tag">{count} resultados</span></div>
        {count === 0 && <div className="card text-mu">{mode === 'cargas' ? loads.length === 0 ? 'Todavía no hay cargas. Aparecerán aquí cuando se publiquen en la base de datos.' : 'Sin resultados con estos filtros. Prueba otra carrocería o limpia el origen.' : 'Todavía no hay vehículos disponibles para mostrar.'}</div>}
        {mode === 'cargas' ? fLoads.map((l) => <LoadCard key={l.id} l={l} onPick={pick} />) : availTrucks.map((t) => <TruckCard key={t.id} t={t} onPick={pick} />)}
      </aside>
    </div>
  );
}

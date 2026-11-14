import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed, Minus, Plus } from 'lucide-react';
import { coords } from '../services/geo';
import { COLORS, ICONS, MAP } from '../config/map';
import CityLabels from '../shared/CityLabels';
import type { Load, Truck } from '../types';
import { money, when } from '../services/format';
import { useApp } from '../context/AppContext';

interface Props { loads: Load[]; trucks: Truck[]; sel: string | null; onPick: (id: string) => void; onClear: (id: string) => void; }
const truckIcon = (t: Truck) => (t.s === 'd' ? ICONS.truckD : t.s === 'm' ? ICONS.truckM : ICONS.truckX);

function Focus({ loads, trucks, sel }: Pick<Props, 'loads' | 'trucks' | 'sel'>) {
  const map = useMap();
  useEffect(() => {
    if (!sel) return;
    const l = loads.find((x) => x.id === sel), t = trucks.find((x) => x.id === sel);
    const a = l && coords(l.o), b = l && coords(l.d);
    if (a && b) map.flyToBounds([a, b], { padding: [80, 80], duration: 0.8 });
    else if (t) map.flyTo(t.pos, 10, { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);
  return null;
}

function Controls() {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) L.DomEvent.disableClickPropagation(ref.current); }, []);
  const b = 'grid h-9 w-9 place-items-center rounded-lg border border-line bg-card hover:text-lime';
  return (
    <div ref={ref} className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
      <button className={b} aria-label="Acercar" onClick={() => map.zoomIn()}><Plus size={16} /></button>
      <button className={b} aria-label="Alejar" onClick={() => map.zoomOut()}><Minus size={16} /></button>
      <button className={b} aria-label="Centrar mapa" onClick={() => map.flyTo(MAP.center, MAP.zoom)}><LocateFixed size={16} /></button>
    </div> 
  );
}

export default function MapView({ loads, trucks, sel, onPick, onClear }: Props) {
  const { openOffer, toast } = useApp();
  const selLoad = loads.find((l) => l.id === sel), selTruck = trucks.find((t) => t.id === sel);
  const orig = selLoad && coords(selLoad.o), dest = selLoad && coords(selLoad.d);
  return (
    <div className="relative h-full min-h-[260px] overflow-hidden rounded-xl border border-line lg:min-h-[420px]">
      <MapContainer center={MAP.center} zoom={MAP.zoom} minZoom={6} maxZoom={14} zoomControl={false} className="h-full w-full">
        <TileLayer url={MAP.tiles} attribution={MAP.attribution} />
        <CityLabels />
        {orig && dest && <>
          <Polyline positions={[orig, dest]} pathOptions={{ color: COLORS.move, weight: 4, className: 'route' }} />
          <Marker position={dest} icon={ICONS.flag} interactive={false} />
        </>}
        {loads.map((l) => { const p = coords(l.o); return p ? <Marker key={l.id} position={p} icon={ICONS.load} eventHandlers={{ click: () => onPick(l.id) }} /> : null; })}
        {trucks.map((t) => <Marker key={t.id} position={t.pos} icon={truckIcon(t)} eventHandlers={{ click: () => onPick(t.id) }} />)}
        {selLoad && orig && (
          <Popup key={selLoad.id} position={orig} offset={[0, -28]} autoPan={false} eventHandlers={{ remove: () => onClear(selLoad.id) }}>
            <b>{selLoad.o} → {selLoad.d}</b><br /><span className="font-semibold text-lime">{money(selLoad.p)}</span><br />
            <span className="text-mu">{selLoad.kg} kg · Turbo {selLoad.b.toLowerCase()} · {selLoad.km} km<br />{when(selLoad)}</span><br />
            <button className="btn btn-s mt-2" onClick={() => openOffer(selLoad)}>Ofertar</button>
          </Popup>
        )}
        {selTruck && (
          <Popup key={selTruck.id} position={selTruck.pos} offset={[0, -28]} autoPan={false} eventHandlers={{ remove: () => onClear(selTruck.id) }}>
            <b>{selTruck.n}</b><br /><span className="text-mu">{selTruck.c} · Turbo {selTruck.b.toLowerCase()} · {selTruck.cap} kg</span><br />
            <button className="btn btn-s mt-2" onClick={() => toast(`El contacto con ${selTruck.n} estará disponible al conectar el servicio de mensajes`)}>Contactar</button>
          </Popup>
        )}
        <Focus loads={loads} trucks={trucks} sel={sel} />
        <Controls />
      </MapContainer>
      <div className="absolute bottom-3 left-2 z-[1000] flex max-w-[calc(100%-1rem)] flex-wrap gap-x-2 gap-y-1 rounded-xl border border-line bg-bg/90 px-2.5 py-2 text-[10px] sm:bottom-3 sm:left-3 sm:max-w-[calc(100%-1.5rem)] sm:gap-x-3 sm:px-3 sm:text-[11px]">
        {[['Turbo disponible', COLORS.avail], ['Carga pendiente', COLORS.load], ['En movimiento', COLORS.move], ['Incidencia', COLORS.incident]].map(([n, c]) => (
          <span key={n} className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: c }} />{n}</span>
        ))}
      </div>
    </div>
  );
}

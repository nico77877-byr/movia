import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed, Minus, Navigation, Plus } from 'lucide-react';
import { ICONS, MAP } from '../config/map';
import { POLL_MS } from '../config/env';
import { useDeslizar } from '../hooks/useDeslizar';
import { dividirRuta, coords } from '../services/geo';
import CityLabels from '../shared/CityLabels';
import { rutaDe } from './envio';
import type { Envio } from '../types';

interface Props { envios: Envio[]; sel: string | null; onSelect: (id: string) => void; follow: boolean; onFollow: (v: boolean) => void; }

/** Vehículo en vivo: se desliza hasta su última posición, gira según el rumbo y puede ser seguido por la cámara. */
function Vehiculo({ e, activo, siguiendo, onClick }: { e: Envio; activo: boolean; siguiendo: boolean; onClick: () => void }) {
  const map = useMap(), ref = useRef<L.Marker>(null);
  const pose = useDeslizar(e.pos, POLL_MS);
  useEffect(() => { const el = ref.current?.getElement()?.querySelector<HTMLElement>('.car'); if (el && pose) el.style.transform = `rotate(${pose.bearing}deg)`; }, [pose]);
  useEffect(() => { if (siguiendo && pose) map.setView(pose.pos, Math.max(map.getZoom(), 11), { animate: false }); }, [siguiendo, pose, map]);
  return pose ? <Marker ref={ref} position={pose.pos} icon={ICONS.car} zIndexOffset={activo ? 1000 : 500} eventHandlers={{ click: onClick }} /> : null;
}

function Encuadre({ e }: { e?: Envio }) {
  const map = useMap();
  useEffect(() => {
    if (!e) return;
    const pts = [...rutaDe(e), ...(e.pos ? [e.pos] : [])];
    if (pts.length) map.flyToBounds(L.latLngBounds(pts), { paddingTopLeft: [40, 80], paddingBottomRight: [40, 240], duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e?.id]);
  return null;
}

function SoltarSeguimiento({ stop }: { stop: () => void }) { useMapEvents({ dragstart: stop }); return null; }

function Controls({ follow, onFollow, canFollow }: { follow: boolean; onFollow: (v: boolean) => void; canFollow: boolean }) {
  const map = useMap(), ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) L.DomEvent.disableClickPropagation(ref.current); }, []);
  const b = 'grid h-10 w-10 place-items-center rounded-xl border border-line bg-card/95 hover:text-lime';
  return (
    <div ref={ref} className="absolute right-3 top-16 z-[1000] flex flex-col gap-2">
      <button className={b} aria-label="Acercar" onClick={() => map.zoomIn()}><Plus size={17} /></button>
      <button className={b} aria-label="Alejar" onClick={() => map.zoomOut()}><Minus size={17} /></button>
      <button className={b} aria-label="Ver todo el mapa" onClick={() => { onFollow(false); map.flyTo(MAP.center, MAP.zoom); }}><LocateFixed size={17} /></button>
      <button className={`${b} ${follow ? '!border-lime !bg-lime !text-bg' : ''} disabled:opacity-40`} disabled={!canFollow} aria-pressed={follow} aria-label="Seguir vehículo" onClick={() => onFollow(!follow)}><Navigation size={17} /></button>
    </div>
  );
}

export default function LiveMap({ envios, sel, onSelect, follow, onFollow }: Props) {
  const activos = envios.filter((e) => e.estado !== 'Entregado');
  const cur = envios.find((e) => e.id === sel);
  const dividida = cur && cur.estado === 'En tránsito' && cur.pos ? dividirRuta(rutaDe(cur), cur.pos) : null;
  return (
    <div className="relative h-full w-full">
      <MapContainer center={MAP.center} zoom={MAP.zoom} minZoom={6} maxZoom={15} zoomControl={false} className="h-full w-full">
        <TileLayer url={MAP.tiles} attribution={MAP.attribution} />
        <CityLabels />
        {activos.filter((e) => e.id !== sel).map((e) => <Polyline key={e.id} positions={rutaDe(e)} pathOptions={{ color: '#3d8bff', weight: 3, opacity: 0.3 }} />)}
        {cur && cur.estado !== 'Entregado' && (dividida ? (<>
          <Polyline positions={dividida.hecha} pathOptions={{ color: '#A8F000', weight: 12, opacity: 0.15 }} />
          <Polyline positions={dividida.hecha} pathOptions={{ color: '#A8F000', weight: 4 }} />
          <Polyline positions={dividida.resto} pathOptions={{ color: '#3d8bff', weight: 4, className: 'route' }} />
        </>) : <Polyline positions={rutaDe(cur)} pathOptions={{ color: '#3d8bff', weight: 4, className: 'route' }} />)}
        {activos.map((e) => { const d = coords(e.d); return d ? <Marker key={'d' + e.id} position={d} icon={ICONS.flag} interactive={false} /> : null; })}
        {activos.filter((e) => e.estado === 'Buscando conductor' || e.estado === 'En recogida').map((e) => {
          const o = coords(e.o); return o ? <Marker key={'p' + e.id} position={o} icon={ICONS.load} eventHandlers={{ click: () => onSelect(e.id) }} /> : null;
        })}
        {activos.map((e) => <Vehiculo key={'v' + e.id} e={e} activo={e.id === sel} siguiendo={follow && e.id === sel} onClick={() => onSelect(e.id)} />)}
        <Encuadre e={cur} />
        <SoltarSeguimiento stop={() => onFollow(false)} />
        <Controls follow={follow} onFollow={onFollow} canFollow={Boolean(cur?.pos)} />
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[500] shadow-[inset_0_0_90px_20px_#07111F]" />
    </div>
  );
}

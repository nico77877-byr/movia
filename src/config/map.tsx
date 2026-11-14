import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Flag, Package, Truck as TruckIcon } from 'lucide-react';
import type { ReactElement } from 'react';
import type { LatLng } from '../types';

export const MAP = {
  center: [5.2, -73.4] as LatLng,
  zoom: 8,
  tiles: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · tiles <a href="https://www.openstreetmap.de/">openstreetmap.de</a>',
};
export const COLORS = { avail: '#A8F000', load: '#ff9b3d', move: '#3d8bff', incident: '#ff4d5e' };

function pin(color: string, icon: ReactElement) {
  return L.divIcon({
    className: '',
    html: `<div class="pin" style="background:${color};color:${color}"><i>${renderToStaticMarkup(icon)}</i></div>`,
    iconSize: [28, 28], iconAnchor: [14, 28],
  });
}
export const ICONS = {
  load: pin(COLORS.load, <Package size={14} strokeWidth={2.5} />),
  truckD: pin(COLORS.avail, <TruckIcon size={14} strokeWidth={2.5} />),
  truckM: pin(COLORS.move, <TruckIcon size={14} strokeWidth={2.5} />),
  truckX: pin(COLORS.incident, <TruckIcon size={14} strokeWidth={2.5} />),
  flag: pin(COLORS.move, <Flag size={14} strokeWidth={2.5} />),
  /** Camión turbo visto desde arriba, apuntando al norte; se rota según el rumbo. */
  car: L.divIcon({
    className: '', iconSize: [34, 34], iconAnchor: [17, 17],
    html: `<div class="car-wrap"><span class="car-pulse"></span><div class="car"><svg width="22" height="26" viewBox="0 0 24 26"><rect x="7" y="1" width="10" height="8" rx="3" fill="#A8F000" stroke="#07111F" stroke-width="1.5"/><rect x="9" y="3.5" width="6" height="2.5" rx="1" fill="#07111F"/><rect x="5.5" y="10" width="13" height="15" rx="2" fill="#e8eef6" stroke="#07111F" stroke-width="1.5"/></svg></div></div>`,
  }),
};
export const cityIcon = (name: string) => L.divIcon({ className: '', html: `<div class="city-label">● ${name}</div>`, iconSize: [0, 0] });

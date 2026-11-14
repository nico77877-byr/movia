import { useEffect, useRef, useState } from 'react';
import { distanciaKm, rumbo } from '../services/geo';
import type { LatLng } from '../types';

/** Mueve suavemente un vehículo hasta su nueva posición y calcula hacia dónde apunta. */
export function useDeslizar(destino: LatLng | undefined, ms: number) {
  const actual = useRef<LatLng | null>(null), giro = useRef(0);
  const [pose, setPose] = useState<{ pos: LatLng; bearing: number } | null>(null);
  const lat = destino?.[0], lng = destino?.[1];
  useEffect(() => {
    if (lat === undefined || lng === undefined) { actual.current = null; setPose(null); return; }
    const to: LatLng = [lat, lng], from = actual.current ?? to;
    if (distanciaKm(from, to) > 0.005) giro.current = rumbo(from, to);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const f = Math.min(1, (now - t0) / ms);
      const pos: LatLng = [from[0] + (to[0] - from[0]) * f, from[1] + (to[1] - from[1]) * f];
      actual.current = pos; setPose({ pos, bearing: giro.current });
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lat, lng, ms]);
  return pose;
}

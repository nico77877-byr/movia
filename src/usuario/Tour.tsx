import { useEffect, useState, type CSSProperties } from 'react';
import type { Tab } from '../types';

export interface TourStep { title: string; text: string; target?: string; tab?: Tab; }
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function Tour({ steps, onTab, onClose }: { steps: TourStep[]; onTab: (t: Tab) => void; onClose: () => void }) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const s = steps[i], last = i === steps.length - 1;

  useEffect(() => {
    if (s.tab) onTab(s.tab);
    const measure = () => {
      const el = s.target ? document.querySelector(s.target) : null;
      setRect(el ? el.getBoundingClientRect() : null);
    };
    const t = setTimeout(measure, 280); // espera a que la pestaña termine de dibujarse
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
    
  }, [i]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') last ? onClose() : setI((n) => n + 1);
      if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1));
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [last, onClose]);

  const vw = window.innerWidth, vh = window.innerHeight, w = Math.min(350, vw - 24);
  let pos: CSSProperties;
  if (!rect || vw < 640) pos = vw < 640 && rect ? (rect.top > vh / 2 ? { left: 12, right: 12, top: 72 } : { left: 12, right: 12, bottom: 12 }) : { left: (vw - w) / 2, top: vh / 2 - 100, width: w };
  else pos = { width: w, left: clamp(rect.left, 12, vw - w - 12), ...(rect.bottom + 230 < vh ? { top: rect.bottom + 14 } : { bottom: vh - rect.top + 14 }) };

  return (
    <div className="fixed inset-0 z-[4000]" role="dialog" aria-modal="true" aria-label="Tutorial de MOVÍA">
      {rect ? (
        <div className="pointer-events-none absolute rounded-xl border-2 border-lime transition-all duration-300"
          style={{ left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12, boxShadow: '0 0 0 9999px rgba(7,17,31,.82)' }} />
      ) : <div className="absolute inset-0 bg-bg/85" />}
      <div className="card absolute !p-4 shadow-2xl" style={pos}>
        <span className="text-xs text-lime">Paso {i + 1} de {steps.length}</span>
        <h3 className="mb-1 mt-0.5 text-base font-semibold">{s.title}</h3>
        <p className="mb-4 text-mu">{s.text}</p>
        <div className="flex items-center gap-2">
          <button className="mr-auto text-xs text-mu hover:text-lime" onClick={onClose}>Omitir</button>
          {i > 0 && <button className="btn-g btn-s" onClick={() => setI(i - 1)}>Anterior</button>}
          <button className="btn btn-s" onClick={() => (last ? onClose() : setI(i + 1))}>{last ? 'Empezar' : 'Siguiente'}</button>
        </div>
      </div>
    </div>
  );
}

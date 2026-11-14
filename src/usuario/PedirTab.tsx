import { useState, type FormEvent } from 'react';
import { CARROCERIAS, NOMBRES_CIUDADES } from '../config/catalogos';
import { money } from '../services/format';
import type { Body, City, NuevoEnvio } from '../types';

const GOODS = ['Cajas y paquetes', 'Muebles y enseres', 'Alimentos', 'Materiales de construcción', 'Otro'];
const STEPS = ['Ruta', 'Carga', 'Precio'];

export default function PedirTab({ onCreate, notify }: { onCreate: (e: NuevoEnvio) => Promise<void>; notify: (t: string) => void }) {
  const [s, setS] = useState(0);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ o: NOMBRES_CIUDADES[0] as City, d: NOMBRES_CIUDADES[3] as City, goods: GOODS[0], kg: '', body: CARROCERIAS[0].id as Body, price: '' });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function next(e: FormEvent) {
    e.preventDefault();
    if (s === 0 && f.o === f.d) return notify('El origen y el destino deben ser distintos');
    if (s === 1 && (+f.kg < 1 || +f.kg > 4500)) return notify('El peso debe estar entre 1 y 4.500 kg');
    if (s < 2) return setS(s + 1);
    if (+f.price < 50000) return notify('Ofrece al menos $ 50.000');
    setBusy(true);
    try { await onCreate({ o: f.o, d: f.d, goods: f.goods, kg: +f.kg, body: f.body, price: +f.price }); } finally { setBusy(false); }
  }
  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="mb-1 text-xl font-semibold">Pedir transporte</h2>
      <p className="mb-4 text-mu">Tres pasos y un conductor cercano recibe tu pedido.</p>
      <form className="card grid gap-4" onSubmit={next} data-tour="form">
        <div className="flex gap-1.5" aria-label={`Paso ${s + 1} de 3`}>
          {STEPS.map((n, i) => <div key={n} className="flex-1"><i className={`mb-1 block h-1.5 rounded ${i <= s ? 'bg-lime' : 'bg-[#1a2c42]'}`} /><span className={`text-xs ${i === s ? 'text-lime' : 'text-mu'}`}>{i + 1}. {n}</span></div>)}
        </div>
        {s === 0 && (<>
          <div><label className="lbl" htmlFor="o">¿De dónde sale la carga?</label><select id="o" value={f.o} onChange={(e) => set('o', e.target.value)}>{NOMBRES_CIUDADES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="lbl" htmlFor="d">¿A dónde va?</label><select id="d" value={f.d} onChange={(e) => set('d', e.target.value)}>{NOMBRES_CIUDADES.map((c) => <option key={c}>{c}</option>)}</select></div>
        </>)}
        {s === 1 && (<>
          <div><label className="lbl" htmlFor="g">¿Qué vas a enviar?</label><select id="g" value={f.goods} onChange={(e) => set('goods', e.target.value)}>{GOODS.map((g) => <option key={g}>{g}</option>)}</select></div>
          <div><label className="lbl" htmlFor="kg">Peso aproximado (kg)</label><input id="kg" type="number" inputMode="numeric" min={1} max={4500} value={f.kg} onChange={(e) => set('kg', e.target.value)} placeholder="Ej: 1200" /></div>
          <div><label className="lbl" htmlFor="b">Tipo de turbo</label><select id="b" value={f.body} onChange={(e) => set('body', e.target.value)}>{CARROCERIAS.map((b) => <option key={b.id} value={b.id}>{b.id} · {b.hint}</option>)}</select></div>
        </>)}
        {s === 2 && (<>
          <div><label className="lbl" htmlFor="p">¿Cuánto ofreces por el flete? (COP)</label><input id="p" type="number" inputMode="numeric" min={50000} step={10000} value={f.price} onChange={(e) => set('price', e.target.value)} placeholder="Ej: 900000" /></div>
          <div className="rounded-lg border border-line bg-[#0b1726] p-3 text-mu">
            <b className="text-[#e8eef6]">{f.o} → {f.d}</b><br />{f.goods} · {(+f.kg).toLocaleString('es-CO')} kg · Turbo {f.body.toLowerCase()}{+f.price > 0 && <><br />Ofreces <b className="text-lime">{money(+f.price)}</b></>}
          </div>
        </>)}
        <div className="flex gap-2">
          {s > 0 && <button type="button" className="btn-g flex-1" onClick={() => setS(s - 1)}>Atrás</button>}
          <button className="btn flex-1 disabled:opacity-60" disabled={busy}>{s < 2 ? 'Continuar' : busy ? 'Enviando…' : 'Pedir transporte'}</button>
        </div>
      </form>
    </div>
  );
}

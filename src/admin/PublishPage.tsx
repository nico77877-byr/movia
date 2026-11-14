import { useState, type FormEvent, type ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { CARROCERIAS, NOMBRES_CIUDADES } from '../config/catalogos';
import { crearCarga } from '../services/cargasService';
import { errorMsg } from '../services/format';
import { routeKm } from '../services/geo';
import type { Body } from '../types';
import type { Seccion } from './secciones';

const Campo = ({ label, children }: { label: string; children: ReactNode }) => <div><label className="lbl">{label}</label>{children}</div>;
const Lista = ({ name, opciones, defecto }: { name: string; opciones: string[]; defecto?: string }) => (
  <select name={name} defaultValue={defecto}>{opciones.map((o) => <option key={o}>{o}</option>)}</select>
);

export default function PublishPage({ go }: { go: (s: Seccion) => void }) {
  const { setSel, toast, refrescar } = useApp();
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget), v = (k: string) => String(f.get(k) ?? ''), n = (k: string) => Number(v(k)) || 0;
    const o = v('o'), d = v('d');
    if (o === d) return toast('El origen y el destino deben ser distintos');
    setBusy(true);
    try {
      const carga = await crearCarga({
        client: v('client'), goods: v('goods'), o, oaddr: v('oaddr'), d, daddr: v('daddr'), date: v('date'), time: v('time'),
        kg: n('kg'), dims: { l: n('l'), a: n('a'), h: n('h') }, b: v('b') as Body, p: n('p'), km: routeKm(o, d), desc: v('desc'),
      });
      refrescar(); setSel(carga.id); toast('Carga publicada'); go('Mapa en tiempo real');
    } catch (err) { toast(errorMsg(err)); }
    finally { setBusy(false); }
  }
  return (
    <div className="p-3 sm:p-4">
      <h2 className="mb-3 text-xl font-semibold">Publicar una carga</h2>
      <form onSubmit={submit} className="card grid max-w-4xl gap-2.5 md:grid-cols-2">
        <Campo label="Nombre del cliente"><input name="client" required /></Campo>
        <Campo label="Tipo de mercancía"><input name="goods" required /></Campo>
        <Campo label="Ciudad de recogida"><Lista name="o" opciones={NOMBRES_CIUDADES} /></Campo>
        <Campo label="Dirección de recogida"><input name="oaddr" required /></Campo>
        <Campo label="Ciudad de destino"><Lista name="d" opciones={NOMBRES_CIUDADES} defecto={NOMBRES_CIUDADES[3]} /></Campo>
        <Campo label="Dirección de entrega"><input name="daddr" required /></Campo>
        <Campo label="Fecha de recogida"><input type="date" name="date" required /></Campo>
        <Campo label="Hora de recogida"><input type="time" name="time" required /></Campo>
        <Campo label="Peso (kg)"><input type="number" name="kg" min={1} max={4500} required /></Campo>
        <Campo label="Largo × ancho × alto (m)"><div className="grid grid-cols-3 gap-1.5"><input type="number" step=".1" name="l" placeholder="L" /><input type="number" step=".1" name="a" placeholder="A" /><input type="number" step=".1" name="h" placeholder="H" /></div></Campo>
        <Campo label="Carrocería requerida"><Lista name="b" opciones={CARROCERIAS.map((c) => c.id)} /></Campo>
        <Campo label="Precio ofrecido (COP)"><input type="number" name="p" min={50000} step={10000} required /></Campo>
        <div className="md:col-span-2"><label className="lbl">Descripción</label><textarea name="desc" rows={3} /></div>
        <div className="md:col-span-2"><button className="btn w-full disabled:opacity-60 sm:w-auto" disabled={busy}>{busy ? 'Publicando…' : 'Publicar carga'}</button></div>
      </form>
    </div>
  );
}

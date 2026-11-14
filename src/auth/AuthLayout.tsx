import type { ReactNode } from 'react';
import { MapPinned, ShieldCheck, Truck } from 'lucide-react';

const POINTS = [[MapPinned, 'Mapa de cargas y turbos en tiempo real'], [Truck, 'Cargas de retorno para no viajar vacío'], [ShieldCheck, 'Conductores y documentos verificados']] as const;

export default function AuthLayout({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-card p-10 lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
        <div className="text-3xl font-bold tracking-wide">MOV<b className="text-lime">Í</b>A<small className="block text-xs font-normal text-mu">Carga que avanza.</small></div>
        <div>
          <h2 className="mb-5 text-2xl font-semibold leading-snug">{admin ? 'Centro de control de la operación logística.' : 'Conecta tu carga con el turbo ideal.'}</h2>
          <ul className="grid gap-3 text-mu">{POINTS.map(([Icon, t]) => <li key={t} className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-soft text-lime"><Icon size={16} /></span>{t}</li>)}</ul>
        </div>
        <span className="text-xs text-mu">Plataforma de transporte de carga</span>
      </aside>
      <main className="grid place-items-center p-5">
        <div className="w-full max-w-md">
          <div className="mb-6 text-2xl font-bold lg:hidden">MOV<b className="text-lime">Í</b>A</div>
          <div className={`card !p-6 ${admin ? 'border-electric/60' : ''}`}>{children}</div>
        </div>
      </main>
    </div>
  );
}

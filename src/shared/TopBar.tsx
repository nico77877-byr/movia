import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { API_URL } from '../config/env';
import type { AuthUser } from '../types';

export default function TopBar({ user, onLogout, children }: { user: AuthUser; onLogout: () => void; children?: ReactNode }) {
  return (
    <header className="flex min-w-0 items-center gap-2 border-b border-line bg-card px-3 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] sm:px-4">
      <div className="mr-auto text-lg font-bold tracking-wide sm:text-xl">MOV<b className="text-lime">Í</b>A<small className="block text-[10px] font-normal text-mu">Carga que avanza.</small></div>
      {!API_URL && <span className="tag hidden text-lime md:inline">Sin base de datos conectada</span>}
      {children}
      <span className="hidden items-center gap-2 text-xs text-mu sm:flex"><span className="grid h-7 w-7 place-items-center rounded-full bg-soft font-bold text-lime">{user.name[0]}</span>{user.name}</span>
      <button aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onLogout} className="p-1.5 text-mu hover:text-lime"><LogOut size={17} /></button>
    </header>
  );
}

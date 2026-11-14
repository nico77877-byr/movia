import { useState } from 'react';
import TopBar from '../shared/TopBar';
import OfferModal from './OfferModal';
import Dashboard from './Dashboard';
import MapPage from './MapPage';
import PublishPage from './PublishPage';
import ReturnPage from './ReturnPage';
import ViajesPage from './ViajesPage';
import Pendiente from './Pendiente';
import { SECCIONES, type Seccion } from './secciones';
import type { AuthUser } from '../types';

export default function AdminApp({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [sec, setSec] = useState<Seccion>('Dashboard');
  return (
    <div className="flex h-dvh flex-col">
      <TopBar user={user} onLogout={onLogout} />
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)] lg:grid-rows-1">
        <nav aria-label="Secciones de administración" className="flex min-w-0 gap-0.5 overflow-x-auto border-b border-line bg-card p-2 lg:flex-col lg:border-b-0 lg:border-r lg:p-3">
          {SECCIONES.map((s) => (
            <button key={s} aria-current={sec === s ? 'page' : undefined} onClick={() => setSec(s)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-left hover:bg-soft hover:text-lime ${sec === s ? 'bg-soft text-lime' : 'text-mu'}`}>{s}</button>
          ))}
        </nav>
        <main className="min-h-0 min-w-0 overflow-y-auto">
          {sec === 'Dashboard' && <Dashboard />}
          {sec === 'Mapa en tiempo real' && <MapPage />}
          {sec === 'Publicar carga' && <PublishPage go={setSec} />}
          {sec === 'Cargas de retorno' && <ReturnPage go={setSec} />}
          {sec === 'Viajes' && <ViajesPage />}
          {!['Dashboard', 'Mapa en tiempo real', 'Publicar carga', 'Cargas de retorno', 'Viajes'].includes(sec) && <Pendiente titulo={sec} />}
        </main>
      </div>
      <OfferModal />
    </div>
  );
}

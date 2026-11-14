import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleHelp, ListChecks, Navigation, PackagePlus } from 'lucide-react';
import SeguirTab from './SeguirTab';
import PedirTab from './PedirTab';
import EnviosTab from './EnviosTab';
import Tour, { type TourStep } from './Tour';
import TopBar from '../shared/TopBar';
import { useApp } from '../context/AppContext';
import { useRecurso } from '../hooks/useRecurso';
import { POLL_MS } from '../config/env';
import { crearEnvio, listarEnvios } from '../services/enviosService';
import { errorMsg } from '../services/format';
import { readLS, writeLS } from '../services/storage';
import type { AuthUser, Envio, Estado, NuevoEnvio, Tab } from '../types';

const TABS: { id: Tab; label: string; Icon: typeof Navigation }[] = [
  { id: 'seguir', label: 'Seguir mi carga', Icon: Navigation }, { id: 'pedir', label: 'Pedir transporte', Icon: PackagePlus }, { id: 'envios', label: 'Mis envíos', Icon: ListChecks },
];
const PASOS: TourStep[] = [
  { title: '¡Bienvenido a MOVÍA!', text: 'En un minuto te mostramos cómo pedir un transporte y seguir tu carga. Puedes avanzar con los botones o con las flechas del teclado.' },
  { title: 'Tus 3 secciones', target: '[data-tour="tabs"]', text: 'Todo se resume en tres: seguir tu carga en el mapa, pedir un transporte y ver tus envíos.' },
  { title: 'Seguir mi carga', tab: 'seguir', target: '[data-tour="map"]', text: 'Cada camión turbo aparece como un pequeño vehículo que se mueve por la carretera. La línea verde es lo que ya recorrió y la azul lo que le falta. El pin naranja es la recogida y la bandera azul, la entrega.' },
  { title: 'Tu conductor y el tiempo', tab: 'seguir', target: '[data-tour="envio-card"]', text: 'Aquí ves el estado del envío, quién lo lleva y cuántos km faltan. El botón de la flecha en el mapa hace que la cámara siga al vehículo.' },
  { title: 'Pedir transporte', tab: 'pedir', target: '[data-tour="form"]', text: 'Elige de dónde a dónde va tu carga, qué envías y cuánto ofreces. Al terminar, un conductor cercano recibe tu pedido y lo verás moverse en el mapa.' },
  { title: 'Mis envíos', tab: 'envios', target: '[data-tour="lista"]', text: 'Aquí está el historial de todos tus pedidos con su estado. Con «Ver en el mapa» saltas directo al seguimiento.' },
  { title: '¿Necesitas repasar?', tab: 'seguir', target: '[data-tour="help"]', text: 'Cuando quieras volver a ver este tutorial, pulsa este botón.' },
];
const AVISO: Record<Estado, (e: Envio) => string> = {
  'Buscando conductor': (e) => `Estamos buscando conductor para ${e.o} → ${e.d}`,
  'En recogida': (e) => `Conductor asignado: ${e.driver?.name ?? 'un turbo'} va por tu carga en ${e.o}`,
  'En tránsito': (e) => `Tu carga salió de ${e.o} rumbo a ${e.d}`,
  Entregado: (e) => `Entregado en ${e.d} ✓`,
};
const TOUR_KEY = 'movia.usuario.tour.v1';

export default function UserPanel({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const { toast, version, refrescar } = useApp();
  const [tab, setTab] = useState<Tab>('seguir');
  const [sel, setSel] = useState<string | null>(null);
  const [follow, setFollow] = useState(false);
  const [tour, setTour] = useState(false);
  const { datos: envios, error } = useRecurso(listarEnvios, { cada: POLL_MS, version });
  const activo = sel ?? envios[0]?.id ?? null;

  // Avisa cuando el estado de un envío cambia entre consultas.
  const previos = useRef<Record<string, Estado>>({});
  useEffect(() => {
    envios.forEach((e) => { const antes = previos.current[e.id]; if (antes && antes !== e.estado) toast(AVISO[e.estado](e)); previos.current[e.id] = e.estado; });
  }, [envios, toast]);

  useEffect(() => { if (!readLS(TOUR_KEY, false)) { const t = setTimeout(() => setTour(true), 700); return () => clearTimeout(t); } }, []);
  const cerrarTour = useCallback(() => { setTour(false); writeLS(TOUR_KEY, true); setTab('seguir'); }, []);

  async function crear(n: NuevoEnvio) {
    try {
      const e = await crearEnvio(n);
      refrescar(); setSel(e.id); setFollow(false); setTab('seguir'); toast('Pedido enviado. Buscando conductor…');
    } catch (err) { toast(errorMsg(err)); }
  }

  return (
    <div className="flex h-dvh flex-col">
      <TopBar user={user} onLogout={onLogout}>
        <button data-tour="help" onClick={() => setTour(true)} className="btn-g btn-s flex items-center gap-1.5"><CircleHelp size={15} /><span className="hidden sm:inline">Tutorial</span></button>
      </TopBar>
      <nav data-tour="tabs" aria-label="Secciones" className="order-last grid grid-cols-3 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] sm:order-none sm:flex sm:gap-1 sm:border-b sm:border-t-0 sm:px-4 sm:py-1.5 sm:pb-1.5">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-1 py-2 text-[11px] transition sm:flex-row sm:gap-2 sm:rounded-lg sm:px-3.5 sm:text-sm ${tab === id ? 'text-lime sm:bg-soft' : 'text-mu hover:text-lime'}`}><Icon size={18} />{label}</button>
        ))}
      </nav>
      <main className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'seguir' && <SeguirTab envios={envios} sel={activo} setSel={setSel} follow={follow} setFollow={setFollow} go={setTab} notify={toast} />}
        {tab === 'pedir' && <PedirTab onCreate={crear} notify={toast} />}
        {tab === 'envios' && <EnviosTab envios={envios} error={error} go={setTab} onView={(id) => { setSel(id); setFollow(false); setTab('seguir'); }} />}
      </main>
      {tour && <Tour steps={PASOS} onTab={setTab} onClose={cerrarTour} />}
    </div>
  );
}

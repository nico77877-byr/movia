import { useRecurso } from '../hooks/useRecurso';
import { useApp } from '../context/AppContext';
import { obtenerResumen } from '../services/resumenService';
import { money } from '../services/format';
import type { Resumen } from '../types';

const KPIS: { key: keyof Resumen; label: string; dinero?: boolean; alerta?: boolean }[] = [
  { key: 'cargasDisponibles', label: 'Cargas disponibles' }, { key: 'viajesEnCurso', label: 'Viajes en curso' },
  { key: 'entregasCompletadas', label: 'Entregas completadas' }, { key: 'conductoresActivos', label: 'Conductores activos' },
  { key: 'facturacionEstimada', label: 'Facturación estimada', dinero: true }, { key: 'incidencias', label: 'Incidencias', alerta: true },
];

const cargarResumen = async () => { const r = await obtenerResumen(); return r ? [r] : []; };

export default function Dashboard() {
  const { version } = useApp();
  const { datos, error } = useRecurso(cargarResumen, { version, cada: 30_000 });
  const r = datos[0];
  return (
    <div className="grid min-w-0 gap-3 p-3 sm:p-4">
      <div className="card min-w-0">
        <h2 className="font-semibold">Panel de administración</h2>
        <p className="mt-2 text-mu">{error || (r ? 'Indicadores de la operación.' : 'Aún no hay datos operativos. Al conectar la base de datos, aquí aparecerán las cargas, viajes, conductores y reportes reales.')}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <div key={k.key} className="card min-w-0">
            <b className={`block text-2xl ${k.alerta ? 'text-danger' : 'text-lime'}`}>{r ? (k.dinero ? money(r[k.key]) : r[k.key].toLocaleString('es-CO')) : '—'}</b>
            <span className="text-xs text-mu">{k.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

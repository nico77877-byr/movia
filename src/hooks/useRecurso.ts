import { useEffect, useState } from 'react';
import { errorMsg } from '../services/format';

interface Opciones { cada?: number; version?: number; }

/** Carga una lista desde un servicio y, opcionalmente, la refresca cada `cada` ms. */
export function useRecurso<T>(cargar: () => Promise<T[]>, { cada, version = 0 }: Opciones = {}) {
  const [datos, setDatos] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let vivo = true;
    const run = async () => {
      try { const d = await cargar(); if (vivo) { setDatos(d); setError(''); } }
      catch (e) { if (vivo) setError(errorMsg(e, 'No se pudieron cargar los datos')); }
      finally { if (vivo) setCargando(false); }
    };
    run();
    const id = cada ? setInterval(run, cada) : undefined;
    return () => { vivo = false; if (id) clearInterval(id); };
  }, [cargar, cada, version]);
  return { datos, cargando, error };
}

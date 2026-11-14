import { createContext, useCallback, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { Load } from '../types';

interface Toast { id: number; text: string; }
interface Ctx {
  sel: string | null; setSel: Dispatch<SetStateAction<string | null>>;
  offer: Load | null; openOffer: (l: Load) => void; closeOffer: () => void;
  toasts: Toast[]; toast: (text: string) => void;
  /** Se incrementa al guardar cambios para que las listas se vuelvan a consultar. */
  version: number; refrescar: () => void;
}
const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => { const c = useContext(AppCtx); if (!c) throw new Error('useApp fuera de AppProvider'); return c; };

export function AppProvider({ children }: { children: ReactNode }) {
  const [sel, setSel] = useState<string | null>(null);
  const [offer, setOffer] = useState<Load | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [version, setVersion] = useState(0);

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const refrescar = useCallback(() => setVersion((v) => v + 1), []);

  return (
    <AppCtx.Provider value={{ sel, setSel, offer, openOffer: setOffer, closeOffer: () => setOffer(null), toasts, toast, version, refrescar }}>
      {children}
    </AppCtx.Provider>
  );
}

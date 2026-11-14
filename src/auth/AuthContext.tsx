import { createContext, useContext, useState, type ReactNode } from 'react';
import * as svc from './authService';
import type { AuthUser, Role } from '../types';

interface Ctx { user: AuthUser | null; login: (email: string, password: string, role: Role) => Promise<AuthUser>; logout: () => void; }
const C = createContext<Ctx | null>(null);
export const useAuth = () => { const c = useContext(C); if (!c) throw new Error('useAuth fuera de AuthProvider'); return c; };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(svc.getSession);
  const login: Ctx['login'] = async (e, p, r) => { const u = await svc.login(e, p, r); setUser(u); return u; };
  const logout = () => { void svc.logout(); setUser(null); };
  return <C.Provider value={{ user, login, logout }}>{children}</C.Provider>;
}

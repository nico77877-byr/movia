import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Role } from '../types';

/** Muestra `children` solo si hay sesión con el rol indicado; si no, muestra `fallback`. */
export default function RequireRole({ role, fallback, children }: { role: Role; fallback: ReactNode; children: ReactNode }) {
  const { user } = useAuth();
  return user && user.role === role ? <>{children}</> : <>{fallback}</>;
}

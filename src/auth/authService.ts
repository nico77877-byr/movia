import { api, ApiError } from '../services/http';
import { readLS, removeLS, writeLS } from '../services/storage';
import { API_URL, IS_DEV } from '../config/env';
import type { AuthUser, Role } from '../types';

const SESSION = 'movia.session.v1', LOCK = 'movia.lock.v1';
const MAX_TRIES = 5, LOCK_MS = 30_000;

export class AuthError extends Error {}
/** Credenciales inválidas (cuenta para el límite de intentos). */
class CredencialesError extends AuthError { constructor() { super('Correo o contraseña incorrectos.'); } }

/** Cuentas de desarrollo definidas en .env; solo se usan con `npm run dev` y sin API. */
function cuentaDev(role: Role) {
  const e = import.meta.env;
  return role === 'admin'
    ? { email: e.VITE_DEV_ADMIN_EMAIL, password: e.VITE_DEV_ADMIN_PASSWORD, name: 'Administrador' }
    : { email: e.VITE_DEV_USER_EMAIL, password: e.VITE_DEV_USER_PASSWORD, name: 'Usuario' };
}

async function validar(email: string, password: string, role: Role): Promise<AuthUser> {
  if (API_URL) {
    try { return await api.post<AuthUser>('/auth/login', { email, password, role }); }
    catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) throw new CredencialesError();
      throw new AuthError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.');
    }
  }
  if (!IS_DEV) throw new AuthError('El servicio de acceso no está configurado.');
  const c = cuentaDev(role);
  if (!c.email || !c.password) throw new AuthError('Define las credenciales de desarrollo en el archivo .env.');
  if (email.trim().toLowerCase() !== c.email.toLowerCase() || password !== c.password) throw new CredencialesError();
  return { id: `dev-${role}`, name: c.name, email: c.email, role };
}

export async function login(email: string, password: string, role: Role): Promise<AuthUser> {
  const lock = readLS<{ n: number; until: number }>(LOCK, { n: 0, until: 0 });
  if (Date.now() < lock.until) throw new AuthError(`Demasiados intentos. Espera ${Math.ceil((lock.until - Date.now()) / 1000)} s.`);
  try {
    const user = await validar(email, password, role);
    writeLS(LOCK, { n: 0, until: 0 }); writeLS(SESSION, user);
    return user;
  } catch (e) {
    if (e instanceof CredencialesError) {
      const n = lock.n + 1;
      writeLS(LOCK, n >= MAX_TRIES ? { n: 0, until: Date.now() + LOCK_MS } : { n, until: 0 });
    }
    throw e;
  }
}
export const getSession = () => readLS<AuthUser | null>(SESSION, null);
export async function logout() {
  removeLS(SESSION);
  if (API_URL) await api.post('/auth/logout').catch(() => undefined);
}

import { API_URL } from '../config/env';

export class ApiError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}
export const NO_CONECTADA = 'La base de datos aún no está conectada.';

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!API_URL) throw new ApiError(NO_CONECTADA);
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      method, credentials: 'include', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined,
    });
  } catch { throw new ApiError('No se pudo conectar con el servidor.'); }
  if (!res.ok) throw new ApiError((await res.json().catch(() => null))?.message ?? `Error ${res.status}`, res.status);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
export const api = {
  get: <T>(path: string) => call<T>('GET', path),
  post: <T>(path: string, body?: unknown) => call<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => call<T>('PATCH', path, body),
};
/** Lectura que devuelve `vacio` cuando todavía no hay API configurada. */
export const leer = <T>(path: string, vacio: T): Promise<T> => (API_URL ? api.get<T>(path) : Promise.resolve(vacio));

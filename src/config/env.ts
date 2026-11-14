/** URL base de la API. Vacía = la app corre sin base de datos conectada. */
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
export const IS_DEV = import.meta.env.DEV;
/** Cada cuánto se consultan las posiciones en vivo (ms). */
export const POLL_MS = 4000;

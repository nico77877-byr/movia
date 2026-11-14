# MOVÍA · Carga que avanza

Aplicación única con acceso por rol:
- **Administrador** → panel de administración (dashboard, mapa en tiempo real, publicar carga, cargas de retorno, viajes).
- **Usuario** → panel simple con 3 secciones (seguir mi carga con mapa en vivo, pedir transporte, mis envíos) y tutorial inicial.
- **MOVI BOT** disponible en ambos paneles.

Stack: React 18 · TypeScript · Vite · Tailwind CSS · Lucide React · Leaflet + React Leaflet.

## Iniciar
    npm install
    npm run dev          # http://localhost:5173
    npm run build        # verifica tipos y genera /dist

Acceso en desarrollo (sin API): usa las credenciales del archivo `.env` (copia de `.env.example`).
Con `VITE_API_URL` definido, el acceso va a tu servidor y las cuentas de `.env` dejan de usarse.

## Sin datos de ejemplo
No hay listas de datos escritas en el código (ni cuentas, ni cargas, ni camiones, ni viajes, ni envíos).
Todo se lee y se escribe a través de `src/services/*Service.ts`. Mientras no haya API:
las listas salen vacías con su mensaje, y las acciones que guardan avisan «La base de datos aún no está conectada».

## Estructura (src/)
- auth/       login de usuario y de administrador, sesión, `RequireRole`
- admin/      AdminApp (menú lateral) y sus páginas
- usuario/    UserPanel, LiveMap (vehículos en movimiento), pedido en 3 pasos, tutorial
- shared/     TopBar, Toasts, ChatBot (MOVI BOT), CityLabels
- services/   http (cliente de la API) y un servicio por entidad
- hooks/      useRecurso (carga/refresco de listas), useDeslizar (movimiento suave del vehículo)
- config/     env, map (tiles e íconos), catalogos
- context/    AppContext (avisos, selección, oferta, refresco)
- types/      modelos de datos

## Contrato esperado de la API (JSON; sesión por cookie, `credentials: include`)
| Método | Ruta | Respuesta / cuerpo |
|---|---|---|
| POST | /auth/login | `{email,password,role}` → `{id,name,email,role}` (401/403 si es inválido) |
| POST | /auth/logout | 204 |
| GET | /cargas | `Load[]` |
| POST | /cargas | `NuevaCarga` → `Load` |
| POST | /cargas/:id/ofertas | `{valor}` |
| GET | /camiones | `Truck[]` |
| GET | /viajes | `Trip[]` |
| PATCH | /viajes/:id/avanzar | `Trip` |
| GET | /admin/resumen | `Resumen` |
| GET | /envios | `Envio[]` del usuario (con `pos` y `ruta` en vivo) |
| POST | /envios | `NuevoEnvio` → `Envio` |

Los tipos están en `src/types/index.ts`. El movimiento en vivo funciona así: `GET /envios` se consulta cada 4 s
(`POLL_MS`) y `pos` de cada envío se anima suavemente hasta la nueva posición. Si la API entrega `ruta` (lista de coordenadas),
se dibuja ese trazado; si no, una línea origen → destino.

## Lo único que sigue escrito en el código
- `config/catalogos.ts`: ciudades con coordenadas, carrocerías y estados del viaje (catálogos; pasar a tablas cuando existan).
- `shared/intents.ts`: base de respuestas de MOVI BOT (el asistente no usa API externa).
- Pasos del tutorial (`usuario/UserPanel.tsx`) y secciones del menú (`admin/secciones.ts`): textos de la interfaz.

## Seguridad
El control por rol en el navegador solo organiza la interfaz. Autenticación, roles y permisos deben validarse en el servidor.
No subas `.env` al repositorio (ya está en `.gitignore`).

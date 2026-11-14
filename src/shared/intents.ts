export interface Intent { keywords: string[]; answer: string; }

export const GREETING = '¡Hola! Soy MOVI BOT, el asistente de MOVÍA. La plataforma aún no tiene una base de datos conectada, así que todavía no hay información operativa para consultar.';
export const UNKNOWN = 'Todavía no tengo información para responder eso. La información operativa estará disponible cuando se conecte la base de datos.';
export const FAQ = ['¿Qué es MOVÍA?', '¿Cómo publico una carga?', '¿Cómo encuentro un turbo?', '¿Cómo encuentro una carga de retorno?', '¿Qué documentos necesito?', '¿Cómo funciona el seguimiento?'];

export const INTENTS: Intent[] = [
  { keywords: ['qué es', 'que es', 'movia', 'movía'], answer: 'MOVÍA es un prototipo para organizar cargas y vehículos de transporte. La base de datos todavía no está conectada.' },
  { keywords: ['publicar', 'publico', 'subir carga'], answer: 'Entra a «Publicar carga» y completa el formulario. Mientras no haya una base de datos conectada, las cargas se guardan solo en este navegador y no se comparten con otros usuarios.' },
  { keywords: ['retorno', 'regreso', 'vuelta'], answer: 'En «Carga de retorno» puedes buscar cargas guardadas en este navegador indicando la ciudad donde quedó tu turbo. Aún no hay datos compartidos desde una base de datos.' },
  { keywords: ['encuentro un turbo', 'buscar turbo', 'turbo', 'vehículo', 'vehiculo', 'camión', 'camion'], answer: 'La búsqueda de vehículos estará disponible cuando haya datos de vehículos cargados. Aún no hay una base de datos conectada.' },
  { keywords: ['tipos', 'carrocería', 'carroceria'], answer: 'Puedes filtrar por turbo estacas, furgón, planchón, carpado y refrigerado.' },
  { keywords: ['registr', 'conductor', 'transportador', 'convertir'], answer: 'El registro de conductores y vehículos aún no está habilitado. No hay perfiles conectados ni datos de conductores.' },
  { keywords: ['document'], answer: 'La información de documentos estará disponible cuando se implemente y conecte el registro de conductores y vehículos.' },
  { keywords: ['cuesta', 'precio', 'tarifa', 'flete', 'cobr'], answer: 'El flete lo propone quien publica la carga y el conductor puede enviar una contraoferta. No tengo tarifas oficiales para darte.' },
  { keywords: ['contact', 'llamar', 'hablar'], answer: 'Las funciones de contacto y ofertas requieren datos conectados y todavía no están disponibles.' },
  { keywords: ['seguimiento', 'rastre', 'tracking', 'dónde está', 'donde esta'], answer: 'El seguimiento de viajes estará disponible cuando haya viajes registrados en la base de datos.' },
  { keywords: ['cómo funciona', 'como funciona', 'funciona', 'ayuda'], answer: 'MOVÍA está en preparación. Puedes explorar la interfaz, pero la información no se comparte entre usuarios hasta conectar la base de datos.' },
  { keywords: ['hola', 'buenas', 'hey'], answer: '¡Hola! ¿Quieres encontrar una carga, buscar un turbo o saber cómo funciona MOVÍA?' },
];

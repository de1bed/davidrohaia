import channelSnapshot from './youtube-snapshot.mjs';

export const channelId = 'UC4MSDfKsvDTxbUDd9w7tavQ';
export const channelUrl = 'https://www.youtube.com/@davidrochaia';
export const siteUrl = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')).replace(/\/$/, '');

// Número de WhatsApp en formato internacional, sin + ni espacios.
// PLACEHOLDER: cámbialo por el número real antes de publicar.
// Ejemplo: '526646961560'
export const WHATSAPP_NUMBER = '520000000000';
export const whatsappMessage = 'Hola David, vi tu página y quiero platicarte de un proyecto.';

export const contactEmail = 'david@gallosmedia.com';
export const videos = channelSnapshot.videos || [];

export const profile = {
  name: 'David Rocha',
  location: 'Tijuana, México',
  headline: 'La inteligencia artificial, puesta a trabajar.',
  lead: 'Desde Tijuana, David produce cine con ella, la sienta dentro de las empresas, construye el software que esas empresas usan y deja lista la página con la que se dan a conocer.',
  description: 'David Rocha, desde Tijuana, produce cine con inteligencia artificial en Gallos Media, mete agentes dentro de las empresas con Vortex Lab y construye el software y la página con los que una empresa trabaja y se presenta.'
};

export const socials = [
  {name: 'YouTube', url: channelUrl, handle: '@davidrochaia'},
  {name: 'Instagram', url: 'https://instagram.com/davidrochaia/', handle: '@davidrochaia'},
  {name: 'TikTok', url: 'https://www.tiktok.com/@davidrochaia', handle: '@davidrochaia'},
  {name: 'GitHub', url: 'https://github.com/de1bed', handle: 'de1bed'}
];

export const gallos = {
  name: 'Gallos Media',
  url: 'https://gallosmedia.com/',
  image: '/assets/gallos-home.webp',
  imageAlt: 'Página de inicio de Gallos Media, productora creativa impulsada por inteligencia artificial.',
  paragraphs: [
    'Gallos Media es su productora. Ahí el cine se hace con inteligencia artificial y lo pilotean personas: piezas con calidad de sala, no un filtro encima de un video cualquiera.',
    'Gallos Media produce de manera formal para Lunáticos TV, una productora más grande. David está involucrado en Lunáticos TV potenciando ese trabajo con inteligencia artificial.'
  ]
};

export const vortex = {
  name: 'Vortex Lab',
  url: 'https://vortexlabai.com',
  image: '/assets/vortex-home.webp',
  imageAlt: 'Página de inicio de Vortex Lab, el laboratorio donde viven los agentes y los productos.',
  paragraphs: [
    'Con Vortex Lab, David mete agentes de inteligencia artificial dentro de la empresa. No se quedan en una presentación: hay agentes operando de verdad, armando trámites, dando seguimiento y dejando el expediente listo.',
    'Uno de esos trabajos es el de los trámites del SAT. El nombre de la empresa se queda en la empresa.'
  ]
};

// Capturas reales, ya sin nombres de personas ni texto de relleno.
// Para cambiar una imagen, sustituye el archivo en public/assets con el mismo nombre.
export const products = [
  {
    name: 'CTPatrol',
    url: 'https://ctpatrol.vortexlabai.com',
    text: 'CTPatrol ordena las inspecciones de seguridad: el recorrido, la evidencia y el expediente quedan en el mismo flujo.',
    link: 'Abrir CTPatrol',
    shots: [
      {src: '/assets/ctpatrol-app-01.webp', width: 1280, height: 497, alt: 'Tablero de inspecciones de CTPatrol, producto de Vortex Lab.'},
      {src: '/assets/ctpatrol-app-02.webp', width: 1280, height: 742, alt: 'Una inspección en curso dentro de CTPatrol.'},
      {src: '/assets/ctpatrol-app-03.webp', width: 1280, height: 482, alt: 'Expedientes cerrados en CTPatrol.'}
    ]
  },
  {
    name: 'NEXA VISIT',
    url: 'https://nexa.vortexlabai.com',
    text: 'NEXA VISIT cuida quién entra. La invitación sale por un enlace, la persona se registra en su teléfono y llega con un pase.',
    link: 'Abrir NEXA VISIT',
    shots: [
      {src: '/assets/nexa-app-01.webp', width: 1280, height: 557, alt: 'Resumen del día en NEXA VISIT, producto de Vortex Lab.'},
      {src: '/assets/nexa-app-02.webp', width: 1280, height: 412, alt: 'Historial de visitas en NEXA VISIT.'},
      {src: '/assets/nexa-app-03.webp', width: 1280, height: 742, alt: 'Reporte de auditoría en NEXA VISIT.'}
    ]
  },
  {
    name: 'PrepIQ',
    url: '',
    text: 'PrepIQ ya está listo. Es un producto de IA para restaurantes.',
    link: '',
    shots: [
      {src: '/assets/prepiq-app-01.webp', width: 1280, height: 412, alt: 'PrepIQ, producto de IA para restaurantes.'},
      {src: '/assets/prepiq-app-02.webp', width: 1280, height: 742, alt: 'PrepIQ, producto de IA para restaurantes, en uso.'},
      {src: '/assets/prepiq-app-03.webp', width: 1280, height: 742, alt: 'PrepIQ, producto de IA para restaurantes, otra vista del producto.'}
    ]
  }
];

export const webDesign = {
  paragraphs: [
    'Una empresa que ya tiene imagen y operación todavía necesita un lugar en la web. David diseña esa página y la identidad con la que se presenta.',
    'Es la misma mano: la que dirige una pieza en Gallos Media deja también el sitio, el tono y la forma de verse.'
  ]
};

export const thinking = {
  title: 'Si quieres conocerlo, míralo pensar.',
  text: 'En YouTube, como @davidrochaia, toma tecnología, economía y sociedad y les quita el discurso. Ahí se entiende cómo decide. Contexto, opinión y un poco de ironía.',
  preservedTitle: 'Preserved, contada en capítulos',
  preservedNote: 'Los capítulos cortos de Preserved viven en una sola pieza, para que el resto del canal se pueda leer.'
};

export const miniLibros = {
  title: 'De cada video queda una lectura.',
  paragraphs: [
    'Los mini libros son entregables digitales que nacen de cada video. No son un libro de estante: son la versión corta para leer después, pasarla en una junta o guardar la idea con sus fuentes.',
    'Cuando un video se publica, el mini libro va con él.'
  ]
};

export const newsletter = {
  name: 'Newsletter',
  promise: 'Una nota que llega sabiendo a qué te dedicas.',
  description: 'Dejas tu correo y a qué te dedicas. Con eso, la inteligencia artificial acomoda cómo te pegan las noticias de negocios, de economía y de inteligencia artificial. No es el mismo boletín para todos.',
  emailLabel: 'Correo',
  roleLabel: 'A qué te dedicas',
  rolePlaceholder: 'Por ejemplo: opero un restaurante, dirijo una planta, diseño marcas',
  button: 'Quiero recibirla',
  note: 'El formulario ya guarda el correo y a qué te dedicas. Falta conectar el servicio que envía la nota; mientras tanto, el mensaje le llega a David por correo.'
};

// Dónde ha aparecido el trabajo. Solo hechos verificables.
export const proof = ['Higgsfield Global Film Festival', 'Telcel HistorIAs', 'Higgsfield Action', 'Lunáticos TV', 'La Perrona'];

// TikTok: la sección usa el embed oficial de perfil, que muestra los videos más recientes.
export const tiktok = {
  handle: 'davidrochaia',
  url: 'https://www.tiktok.com/@davidrochaia',
  title: 'Lo más reciente, en corto.',
  text: 'En TikTok va la versión rápida: una noticia, una herramienta o una idea en menos de un minuto. Aquí aparecen sus videos más nuevos.'
};

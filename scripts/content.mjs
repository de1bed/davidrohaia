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

// Todo el sitio habla en primera persona.
export const profile = {
  name: 'David Rocha',
  location: 'Tijuana, México',
  photo: '/assets/david-rocha.webp',
  headline: 'La inteligencia artificial, puesta a trabajar.',
  lead: 'Soy David, de Tijuana. Desarrollo inteligencia artificial para empresas: agentes que trabajan dentro de la operación y el software que la usa. También hago cine con IA. Aquí voy dejando lo que aprendo y lo que voy construyendo.',
  description: 'David Rocha, desde Tijuana: desarrollo de inteligencia artificial para empresas en Vortex Lab (agentes y productos), cine con IA en Gallos Media y videos sobre tecnología, economía y sociedad.'
};

export const socials = [
  {name: 'YouTube', url: channelUrl, handle: '@davidrochaia'},
  {name: 'Instagram', url: 'https://instagram.com/davidrochaia/', handle: '@davidrochaia'},
  {name: 'TikTok', url: 'https://www.tiktok.com/@davidrochaia', handle: '@davidrochaia'},
  {name: 'GitHub', url: 'https://github.com/de1bed', handle: 'de1bed'}
];

// ─── Noticiero del inicio ───────────────────────────────────────────
// Cada tarjeta rota sola. Para agregar una noticia, copia un bloque y cámbialo.
// kind: 'intro' (con mi foto), 'latest-video' (el video más reciente del canal, se actualiza solo) o 'item'.
// button.video abre el reproductor; button.href abre un enlace.
export const news = [
  {kind: 'intro'},
  {kind: 'item', kicker: 'Vortex Lab · CTPatrol', title: 'Inspecciones de seguridad que no pierden la evidencia.', text: 'Cada punto lleva foto, calificación y una guía de qué revisar, desde el teléfono. Lo usamos para inspecciones C-TPAT.', image: '/assets/ctpatrol-telefonos.webp', imageAlt: 'CTPatrol en el teléfono: la lista de puntos de una inspección y la guía de qué verificar en la defensa.', tag: 'Producto', button: {label: 'Conocer CTPatrol', href: '/productos/#ctpatrol'}},
  {kind: 'item', kicker: 'Vortex Lab · NEXA VISIT', title: 'Que la visita empiece antes de llegar.', text: 'La invitación sale por un enlace, la persona se registra en su teléfono y llega con un pase. La caseta sabe quién entra.', image: '/assets/nexa-app-01.webp', imageAlt: 'Resumen del día en NEXA VISIT.', tag: 'Producto', button: {label: 'Conocer NEXA VISIT', href: '/productos/#nexa-visit'}},
  {kind: 'item', kicker: 'Vortex Lab · PrepIQ', title: 'Un restaurante que sabe qué tiene en la cocina.', text: 'PrepIQ ya está listo: inventario, turnos y cocina en un solo lugar, con IA para restaurantes.', image: '/assets/prepiq-app-02.webp', imageAlt: 'Inventario en PrepIQ.', tag: 'Producto', button: {label: 'Conocer PrepIQ', href: '/productos/#prepiq'}},
  {kind: 'latest-video', kicker: 'Nuevo en YouTube'},
  {kind: 'item', kicker: 'Gallos Media · Cortometraje', title: '¿Qué hace real a una mente?', text: 'Preserved es un cortometraje que hicimos con IA para el Higgsfield Global Film Festival. Una pregunta sobre conciencia e identidad.', image: '/assets/film-preserved.webp', imageAlt: 'Preserved, cortometraje hecho con IA.', tag: 'Cine', button: {label: 'Ver Preserved', video: 'XfkdES89S5E'}},
  {kind: 'item', kicker: 'Una nota por correo', title: 'Una nota que llega sabiendo a qué te dedicas.', text: 'Me dices a qué te dedicas y la nota de negocios, economía e IA llega acomodada a tu trabajo.', image: '/assets/newsletter-preview.svg', imageAlt: 'Ejemplo de la nota del newsletter.', tag: 'Newsletter', button: {label: 'Quiero recibirla', href: '/newsletter/'}}
];

// Notas para videos específicos: un título con gancho, una mini opinión y su etiqueta.
// Si un video no tiene nota, se usa su título y una etiqueta automática.
export const videoNotes = {
  idNfU7ePvRU: {title: '¿Y si el padre de la IA tiene razón?', note: 'Geoffrey Hinton, uno de los pioneros de la IA, habla de lo que le preocupa. Lo pongo en contexto.', tag: 'Opinión'},
  '4wwDfZezlQM': {title: 'De laboratorio sin fines de lucro a negociar miles de millones.', note: 'La historia de OpenAI y una pregunta que me quedé haciendo: ¿quién tiene voz en el futuro de la IA?', tag: 'Historia'},
  XfkdES89S5E: {title: 'Preserved', note: 'Cortometraje hecho con IA para el Higgsfield Global Film Festival.', tag: 'Cine'},
  '1n8a83i2yVQ': {title: 'El amor se devuelve', note: 'Un cortometraje sobre las madres y el paso del tiempo, para Telcel HistorIAs.', tag: 'Cine'},
  _PIaniIW0Zc: {title: 'The Avenerds', note: 'Ciencia ficción hecha con IA para Higgsfield Action.', tag: 'Cine'},
  'Wg42r-mAj2Q': {tag: 'Historia'}
};

// Etiquetas automáticas por palabras del título (la primera que coincide gana).
export const videoTags = [
  {tag: 'Cine', pattern: 'preserved|avenerds|cortometraje'},
  {tag: 'Noticias', pattern: 'noticia|acusa|llegó|acaba de|ya habla|resolvió'},
  {tag: 'Herramientas', pattern: 'herramienta|gratis|gpt image|siri'},
  {tag: 'Historia', pattern: 'historia|biograf|steve jobs'},
  {tag: 'Futuro', pattern: '20[3-9]\\d|futuro'},
  {tag: 'Opinión', pattern: '.'}
];

// ─── Lo que hago ───────────────────────────────────────────────────
export const gallos = {
  name: 'Gallos Media',
  url: 'https://gallosmedia.com/',
  role: 'Productora',
  summary: 'Gallos Media es mi productora. Hacemos cine, campañas y videos con inteligencia artificial, y los pilotamos personas.',
  paragraphs: [
    'La idea es sencilla: piezas con calidad de sala, no un filtro encima de un video cualquiera.',
    'También producimos para Lunáticos TV, una productora más grande, donde me toca potenciar el trabajo con inteligencia artificial.'
  ],
  // Los trabajos rotan en la sección de Gallos Media. Agrega aquí los nuevos.
  works: [
    {title: 'Preserved', label: 'Cortometraje · Higgsfield Global Film Festival', image: '/assets/film-preserved.webp', video: 'XfkdES89S5E', text: '¿Qué hace real a una mente? Ciencia ficción hecha con IA.'},
    {title: 'El amor se devuelve', label: 'Cortometraje · Telcel HistorIAs', image: '/assets/film-amor.webp', video: '1n8a83i2yVQ', text: 'Lo que significan las madres frente al paso del tiempo.'},
    {title: 'La Perrona', label: 'Campaña · Hecho en Tijuana', image: '/assets/film-la-perrona.webp', url: 'https://gallosmedia.com/proyectos', text: 'Campaña para la salsa tijuanense nacida en 1960.'},
    {title: 'The Avenerds', label: 'Ciencia ficción · Higgsfield Action', image: '/assets/film-avenerds.webp', video: '_PIaniIW0Zc', text: 'Cuando la IA supera a sus creadores, el aliado puede volverse enemigo.'},
    {title: 'Platicando con la luna', label: 'Video musical · Lunáticos TV', image: '/assets/film-luna.webp', url: 'https://gallosmedia.com/proyectos', text: 'Video musical de Alonso Ortiz, en colaboración con Lunáticos TV.'}
  ]
};

export const vortex = {
  name: 'Vortex Lab',
  url: 'https://vortexlabai.com',
  role: 'Desarrollo de IA',
  summary: 'Vortex Lab es donde metemos agentes de inteligencia artificial dentro de las empresas y construimos productos propios.',
  paragraphs: [
    'No se quedan en una presentación: hay agentes operando de verdad, armando trámites, dando seguimiento y dejando el expediente listo. Uno de esos trabajos es el de los trámites del SAT; el nombre de la empresa se queda en la empresa.'
  ],
  // Lo que rota en la sección de Vortex Lab: los agentes y luego cada producto.
  showcase: [
    {title: 'Agentes dentro de la operación', label: 'Agentes de IA', image: '/assets/vortex-agentes.webp', text: 'Arman trámites, dan seguimiento y dejan el expediente listo.', href: 'https://vortexlabai.com'},
    {title: 'CTPatrol', label: 'Producto · Seguridad', image: '/assets/ctpatrol-telefonos.webp', text: 'Inspecciones desde el teléfono: cada punto con foto, calificación y guía.', href: '/productos/#ctpatrol'},
    {title: 'NEXA VISIT', label: 'Producto · Accesos', image: '/assets/nexa-app-03.webp', text: 'Invitaciones, registro desde el teléfono y pases para entrar.', href: '/productos/#nexa-visit'},
    {title: 'PrepIQ', label: 'Producto · Restaurantes', image: '/assets/prepiq-app-03.webp', text: 'IA para la cocina, el inventario y los turnos.', href: '/productos/#prepiq'}
  ]
};

// Capturas reales, ya sin nombres de personas ni texto de relleno.
// Para cambiar una imagen, sustituye el archivo en public/assets con el mismo nombre.
export const products = [
  {
    name: 'CTPatrol',
    url: 'https://ctpatrol.vortexlabai.com',
    pitch: 'Gestiona tus inspecciones sin perder la evidencia.',
    mockup: {src: '/assets/ctpatrol-telefonos.webp', width: 1600, height: 1100, alt: 'CTPatrol en el teléfono: la lista de puntos de una inspección y la guía de qué verificar en la defensa.'},
    text: 'CTPatrol ordena las inspecciones de seguridad: el recorrido, la evidencia y el expediente quedan en el mismo flujo.',
    for: 'Equipos de seguridad y operaciones logísticas.',
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
    pitch: 'Que la visita empiece antes de llegar.',
    text: 'NEXA VISIT cuida quién entra. La invitación sale por un enlace, la persona se registra en su teléfono y llega con un pase.',
    for: 'Empresas, recepciones y casetas de acceso.',
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
    pitch: 'Un restaurante que sabe qué tiene en la cocina.',
    text: 'PrepIQ ya está listo. Es un producto de IA para restaurantes: inventario, cocina, turnos y reportes en un solo lugar.',
    for: 'Restaurantes y cocinas con varios turnos.',
    link: '',
    shots: [
      {src: '/assets/prepiq-app-01.webp', width: 1280, height: 412, alt: 'PrepIQ, producto de IA para restaurantes.'},
      {src: '/assets/prepiq-app-02.webp', width: 1280, height: 742, alt: 'Inventario en PrepIQ, producto de IA para restaurantes.'},
      {src: '/assets/prepiq-app-03.webp', width: 1280, height: 742, alt: 'Horarios y asistencia en PrepIQ.'}
    ]
  }
];

// ─── Lo que comparto ───────────────────────────────────────────────
export const thinking = {
  title: 'Si quieres conocerme, mírame pensar.',
  text: 'En YouTube tomo tecnología, economía y sociedad e intento quitarles el discurso. Contexto, opinión y un poco de ironía.',
  preservedTitle: 'Preserved, contada en capítulos',
  preservedNote: 'Los capítulos cortos de Preserved viven en una sola pieza, para que el resto del canal se pueda leer.'
};

export const tiktok = {
  handle: 'davidrochaia',
  url: 'https://www.tiktok.com/@davidrochaia'
};

// "En corto": miniaturas de reels que llevan a TikTok. Para agregar uno, copia una línea y cambia la imagen y el título.
export const reels = [
  {title: '¿Musk monopolio? SpaceX controla el espacio', image: '/assets/reel-musk-spacex.webp'},
  {title: '¿Hablar con los muertos?', image: '/assets/reel-hablar-con-muertos.webp'},
  {title: 'La IA resolvió un problema que ni entendemos', image: '/assets/reel-ia-resolvio-problema.webp'},
  {title: '¿Una IA mexicana?', image: '/assets/reel-ia-mexicana.webp'},
  {title: '¿Modales para la IA?', image: '/assets/reel-modales-ia.webp'},
  {title: 'Los agentes atacan Wikipedia', image: '/assets/reel-agentes-wikipedia.webp'},
  {title: '¿Y si filtran tu identificación?', image: '/assets/reel-filtran-identificacion.webp'}
];

export const instagram = {
  handle: 'davidrochaia',
  url: 'https://instagram.com/davidrochaia/',
  text: 'Procesos, pruebas y lo que no cabe en un video largo.'
};

// Mini libros: historias propias que se van a contar y se podrán comprar aquí.
// Mientras no estén listos, quedan como "Próximamente". Para venderlo, llena buyUrl
// (Stripe, Gumroad, Hotmart…) y price; el botón cambia a "Comprar" solo.
export const miniLibros = {
  title: 'Historias que se van a contar.',
  paragraphs: [
    'Estoy preparando historias propias que van a salir en video y, desde aquí, también como mini libro: la versión para leer con calma, con lo que no cupo en pantalla.',
    'Cuando cada una esté lista, la vas a poder conseguir en esta página.'
  ],
  books: [
    {title: 'Historia 01', subtitle: 'Título por anunciar', status: 'Próximamente', price: '', buyUrl: '', tone: 'ember'},
    {title: 'Historia 02', subtitle: 'Título por anunciar', status: 'Próximamente', price: '', buyUrl: '', tone: 'ink'},
    {title: 'Historia 03', subtitle: 'Título por anunciar', status: 'Próximamente', price: '', buyUrl: '', tone: 'sand'}
  ]
};

export const newsletter = {
  name: 'Newsletter',
  promise: 'Una nota que llega sabiendo a qué te dedicas.',
  description: 'Me dejas tu correo y a qué te dedicas. Con eso, la inteligencia artificial acomoda las noticias de negocios, de economía y de IA a tu trabajo. No es el mismo boletín para todos.',
  steps: [
    ['Me cuentas a qué te dedicas', 'Una línea basta: “opero un restaurante”, “dirijo una planta”, “diseño marcas”.'],
    ['La IA hace el primer filtro', 'Revisa las noticias de negocios, economía e IA y aparta las que tocan tu trabajo.'],
    ['Yo la reviso y la mando', 'Te llega una nota corta: qué pasó, por qué te importa y qué haría yo.']
  ],
  sample: {
    for: 'Opero un restaurante',
    sections: [
      ['Qué pasó', 'Una noticia de economía o de IA, contada en tres líneas.'],
      ['Por qué te importa', 'Lo que cambia para un restaurante como el tuyo.'],
      ['Qué haría yo', 'Una acción concreta que puedes probar esta semana.']
    ]
  },
  emailLabel: 'Correo',
  roleLabel: 'A qué te dedicas',
  rolePlaceholder: 'Por ejemplo: opero un restaurante, dirijo una planta, diseño marcas',
  button: 'Quiero recibirla',
  note: 'El formulario ya guarda tu correo y a qué te dedicas. Falta conectar el servicio que envía la nota; mientras tanto, el mensaje me llega por correo.'
};

// ─── Contacto ──────────────────────────────────────────────────────
// Las opciones del formulario de contacto. El mensaje se arma con la que elijas.
export const contactOptions = [
  {key: 'software', title: 'Software a la medida', text: 'Una app, un sistema interno o agentes de IA para tu operación.'},
  {key: 'producto', title: 'Uno de mis productos', text: 'CTPatrol, NEXA VISIT o PrepIQ para tu empresa.'},
  {key: 'produccion', title: 'Una producción profesional', text: 'Un cortometraje, una campaña o videos para tu marca.'},
  {key: 'marca', title: 'Tu página o tu marca', text: 'El sitio, la identidad y la forma de presentarte.'},
  {key: 'marketing', title: 'Estrategia de contenido', text: 'Cómo contar lo que haces en video y redes.'},
  {key: 'otro', title: 'Otra cosa', text: 'Si no está en la lista, igual cuéntame.'}
];

// Dónde ha aparecido el trabajo. Solo hechos verificables.
export const proof = ['Higgsfield Global Film Festival', 'Telcel HistorIAs', 'Higgsfield Action', 'Lunáticos TV', 'La Perrona'];

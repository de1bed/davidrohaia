import channelSnapshot from './youtube-snapshot.mjs';
export const channelId = 'UC4MSDfKsvDTxbUDd9w7tavQ';
export const channelUrl = 'https://www.youtube.com/@davidrochaia';
const previousVideos = [
  {id:'sH3SfbTnh9s',title:'8 noticias de IA en 3 días que no te puedes perder',published:'2026-10-24T01:02:36+00:00',short:true,image:'/assets/youtube-news.jpg'},
  {id:'4wwDfZezlQM',title:'La historia de OpenAI: de “sin fines de lucro” a negociar miles de millones con Trump.',published:'2026-10-19T03:07:00+00:00',short:false,image:'/assets/youtube-openai.jpg'},
  {id:'XfkdES89S5E',title:'Preserved — Higgsfield Global Film Festival',short:false,image:'/assets/youtube-preserved.jpg'},
  {id:'1n8a83i2yVQ',title:'El amor se devuelve',short:false,image:'/assets/gallos-madres.jpg'},
  {id:'_PIaniIW0Zc',title:'The Avenerds — Higgsfield Action',short:false,image:'/assets/gallos-avenerds.jpg'},
  {id:'Wg42r-mAj2Q',title:'Steve Jobs: Apple hoy, el despido que lo cambió todo y su advertencia sobre IA',short:false,image:'https://i.ytimg.com/vi/Wg42r-mAj2Q/hqdefault.jpg'}
];
export const videos=channelSnapshot.videos.length?channelSnapshot.videos:previousVideos;
export const projects = [
 {slug:'ctpatrol',name:'CTPatrol',category:'Seguridad · Operaciones',summary:'Inspecciones con evidencia. Decisiones con contexto.',description:'Un flujo móvil para inspecciones C-TPAT: puntos de revisión, fotografías georreferenciadas, análisis con IA y expedientes.',url:'https://ctpatrol.vercel.app',repo:'https://github.com/de1bed/ctpatrolweb',visual:'patrol',features:['Inspección guiada','Evidencia fotográfica','Análisis con IA','Panel administrativo']},
 {slug:'nexa',name:'Nexa Visit',category:'Accesos · Experiencia móvil',summary:'La visita empieza antes de llegar.',description:'Del enlace de invitación al pase QR. Cuatro experiencias conectadas para quien invita, quien llega, quien autoriza y quien administra.',url:'https://nexa-alpha-opal.vercel.app',repo:'https://github.com/de1bed/nexa',visual:'nexa',features:['Invitaciones por enlace','Registro desde el teléfono','Pases QR','Control de acceso']},
 {slug:'cimawash',name:'CimaWash',category:'Servicios · Campus',summary:'Tu auto limpio, sin moverlo de su lugar.',description:'Un servicio de lavado para el campus UABC que conecta pedido por QR, pago y operación del equipo.',url:'https://cimawash.vercel.app',repo:'https://github.com/de1bed/cimawash',visual:'wash',features:['Pedido sin cuenta','Ubicación por cajón','Pago digital','Operación del equipo']},
 {slug:'orbita',name:'Órbita',category:'Conocimiento · Organización',summary:'Ver las conexiones cambia el mapa.',description:'Un universo profesional interactivo para conectar proyectos, personas, empresas y próximos movimientos.',url:'https://github.com/de1bed/mapadevida',repo:'https://github.com/de1bed/mapadevida',visual:'orbit',features:['Mapa interactivo','Relaciones y etiquetas','Planes y proyectos','Conexiones en borrador']},
 {slug:'cotizador',name:'Cotizador Treve',category:'Automatización · Documentos',summary:'Del formulario al PDF, en el mismo flujo.',description:'Cotizaciones y contratos con vista previa, acceso por permisos y registro de actividad.',url:'https://tempaltes.vercel.app',repo:'https://github.com/de1bed/tempaltes',visual:'quote',features:['Vista previa en vivo','PDF Carta y A4','Permisos por sección','Bitácora']}
];
export const films = [
 {title:'Preserved',label:'Cortometraje · Ciencia ficción',image:'/assets/youtube-preserved.jpg',id:'XfkdES89S5E',description:'Una historia creada con IA, presentada en el Higgsfield Global Film Festival.'},
 {title:'La Perrona',label:'Campaña · Hecho en Tijuana',image:'/assets/gallos-la-perrona.jpg',description:'Colaboración con la marca tijuanense de salsa nacida en 1960.',url:'https://gallosmedia.com/proyectos'},
 {title:'Platicando con la luna',label:'Video musical · Alonso Ortiz',image:'/assets/gallos-luna.jpg',description:'Video musical en colaboración con LunaticosTV.',url:'https://gallosmedia.com/proyectos'},
 {title:'El amor se devuelve',label:'Cortometraje · Telcel HistorIAs',image:'/assets/gallos-madres.jpg',id:'1n8a83i2yVQ',description:'Un recordatorio de lo que significan las madres frente al paso del tiempo.'},
 {title:'The Avenerds',label:'Ciencia ficción · Higgsfield Action',image:'/assets/gallos-avenerds.jpg',id:'_PIaniIW0Zc',description:'Cuando la inteligencia artificial supera a sus creadores, el aliado puede convertirse en enemigo.'},
 {title:'VortexLab IA',label:'Marca · Tecnología',image:'/assets/gallos-vortex.jpg',description:'Automatización e inteligencia artificial para resolver problemas de operación.',url:'https://gallosmedia.com/proyectos'}
];
export const articles = [
 {slug:'nexa-una-visita-sin-friccion',category:'Dentro del producto',title:'Una visita no debería empezar con una fila.',summary:'El recorrido de Nexa Visit, desde una invitación hasta la autorización de acceso.',read:'4 min',visual:'nexa',paragraphs:[
  ['Una experiencia, cuatro perspectivas','El control de visitantes parece una tarea sencilla hasta que se observa desde cada lado de la puerta. El anfitrión quiere invitar sin llenar formularios repetidos; el visitante quiere llegar con claridad; el guardia necesita decidir; la administración necesita entender qué está pasando. Nexa Visit organiza esas cuatro perspectivas en una misma plataforma.'],
  ['El enlace inicia el recorrido','El anfitrión comparte una invitación con día, hora y sede. Quien visita abre el enlace desde su propio teléfono, confirma sus datos y obtiene un pase QR. El registro ocurre antes del encuentro con la caseta y no exige instalar una aplicación.'],
  ['El QR es una referencia, no una identificación','El pase contiene un token aleatorio. Los datos personales no viajan dentro del código. Al escanearlo, el guardia consulta la visita y toma una decisión explícita. La entrada inicia el registro de permanencia.'],
  ['Diseñar el recorrido completo','La lección de producto está en la continuidad: invitar, registrarse, llegar, autorizar y medir. Cuando cada paso conserva el contexto del anterior, una tarea cotidiana puede sentirse mucho más simple.']
 ],source:'https://github.com/de1bed/nexa'},
 {slug:'ctpatrol-evidencia-en-contexto',category:'Producto + IA',title:'La fotografía es evidencia. El contexto la hace útil.',summary:'Cómo CTPatrol reúne revisión guiada, fotografías y expedientes en una operación móvil.',read:'3 min',visual:'patrol',paragraphs:[
  ['Revisar también es documentar','Una inspección de seguridad necesita algo más que marcar una lista. Importa qué se revisó, dónde ocurrió, qué se observó y con qué evidencia puede consultarse después. CTPatrol reúne el recorrido operativo y el expediente administrativo.'],
  ['La captura en el punto de trabajo','El flujo está pensado para el teléfono del inspector. Los puntos de revisión y la evidencia fotográfica georreferenciada mantienen el contexto de la inspección. El panel administrativo sirve a otra necesidad: consultar y organizar esos expedientes.'],
  ['El papel de la IA','El análisis con inteligencia artificial se incorpora al flujo de evidencia. Su valor depende de que la información de entrada sea útil y conserve contexto. Un análisis aislado no sustituye un proceso de revisión claro.'],
  ['El producto termina después de la captura','La experiencia no acaba cuando se toma una foto. También debe resolver cómo recuperarla, comprenderla y relacionarla con una inspección. Diseñar para ambos momentos es lo que convierte una captura en una herramienta de trabajo.']
 ],source:'https://github.com/de1bed/ctpatrolweb'},
 {slug:'openai-la-historia-detras-del-video',category:'En YouTube',title:'La historia de OpenAI deja una pregunta abierta.',summary:'Del laboratorio de investigación a los acuerdos de miles de millones: la pregunta detrás del documental.',read:'3 min',image:'/assets/youtube-openai.jpg',paragraphs:[
  ['El punto de partida','El video recorre la transformación de OpenAI: su origen como organización sin fines de lucro, las tensiones entre investigación y negocio, y los acuerdos que marcaron su evolución.'],
  ['Personas, decisiones y rupturas','La salida de Elon Musk, la relación con Microsoft, el nacimiento de ChatGPT y el despido y regreso de Sam Altman forman parte del recorrido. El documental conecta esos episodios para observar una historia más amplia que un lanzamiento tecnológico.'],
  ['La pregunta que queda','¿Quién tiene voz cuando una organización plantea construir tecnología para toda la humanidad? Esa pregunta guía el video y abre una conversación sobre los incentivos, la concentración de poder y las decisiones detrás de las herramientas que usamos.'],
  ['Mira el documental','La versión completa está disponible en el canal @davidrochaia. El guion también incorpora una mirada al propio proceso de crear contenido usando ChatGPT.']
 ],video:'4wwDfZezlQM',source:'https://www.youtube.com/watch?v=4wwDfZezlQM'}
];
export const books = [
 {title:'The Creative Act',subtitle:'A Way of Being',author:'Rick Rubin',category:'Creatividad',className:'creative',summary:'Una mirada a la creatividad como práctica de atención, apertura y relación con el mundo.',url:'https://www.penguinrandomhouse.com/books/717356/the-creative-act-by-rick-rubin/'},
 {title:'Atomic Habits',subtitle:'Tiny Changes, Remarkable Results',author:'James Clear',category:'Sistemas personales',className:'habits',summary:'Pequeños cambios y sistemas que ayudan a construir hábitos y sostener el progreso.',url:'https://jamesclear.com/atomic-habits'},
 {title:'The Lean Startup',subtitle:'Build. Measure. Learn.',author:'Eric Ries',category:'Producto',className:'lean',summary:'Un marco para experimentar, validar supuestos y aprender antes de escalar un producto.',url:'https://theleanstartup.com/book'}
];

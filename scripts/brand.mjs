import {videos,projects,films,channelUrl,contactEmail,profile,socials,proof,now,newsletter,ventures,services} from './content.mjs';
import {miniBooks,miniArt,audiences} from './experience.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
const ext=url=>/^https?:/.test(url)?' target="_blank" rel="noreferrer"':'';
const mail=(subject='Hola David')=>`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
const contactUrl=()=>profile.calendarUrl||mail('Quiero platicar de un proyecto');
const head=(eyebrow,title,lead='',extra='')=>`<div class="b-head"><div><p class="b-eyebrow">${eyebrow}</p><h2>${title}</h2>${lead?`<p class="b-head-lead">${lead}</p>`:''}</div>${extra}</div>`;
const contestFilms=films.filter(f=>f.contest).length;
const lowerFirst=t=>t.charAt(0).toLowerCase()+t.slice(1);

export function subscribeForm(source,{dark=false,label='Suscribirme'}={}){
 const id=`nl-${source}`;
 return `<form class="b-form${dark?' is-dark':''}" data-subscribe data-source="${esc(source)}" novalidate><label class="sr-only" for="${id}">Tu correo electrónico</label><div class="b-form-row"><input id="${id}" type="email" name="email" placeholder="tu@correo.com" autocomplete="email" required><button type="submit">${label} <span aria-hidden="true">→</span></button></div><div class="b-hp" aria-hidden="true"><input type="text" name="company" tabindex="-1" autocomplete="off"></div><p class="b-form-note" data-subscribe-status role="status" aria-live="polite">${esc(newsletter.frequency)} · Gratis · Te das de baja con un clic.</p></form>`;
}

function projectCard(p,productArt){
 const a=audiences[p.slug];
 return `<article class="b-project"><a class="b-project-art" href="/proyectos/${p.slug}/" aria-label="Conocer ${esc(p.name)}">${productArt(p.visual)}</a><div class="b-project-body"><div class="b-project-meta"><span class="b-pill${p.demo?' is-live':''}">${p.demo?'<i></i>':''}${esc(p.status)}</span><span>${esc(p.category)}</span></div><h3><a href="/proyectos/${p.slug}/">${esc(p.name)}</a></h3><p>${esc(p.summary)} ${esc(p.description)}</p>${a?`<p class="b-for"><b>Para</b> ${esc(lowerFirst(a.for))}.</p>`:''}<div class="b-actions">${p.demo?`<a class="b-btn" href="${esc(p.url)}" target="_blank" rel="noreferrer">Probar demo <span aria-hidden="true">↗</span></a>`:''}<a class="b-link" href="/proyectos/${p.slug}/">Ver el caso <span aria-hidden="true">→</span></a></div></div></article>`;
}
function ventureCard(v){
 const tag=v.url?'a':'div';
 return `<${tag} class="b-venture"${v.url?` href="${esc(v.url)}"${ext(v.url)}`:''}><div class="b-venture-img"><img src="${esc(v.image)}" alt="" loading="lazy"></div><div><span>${esc(v.role)}</span><h3>${esc(v.name)}${v.url?' <i aria-hidden="true">↗</i>':''}</h3><p>${esc(v.description)}</p></div></${tag}>`;
}
const ideaCard=()=>`<article class="b-project b-idea"><span class="b-num">+</span><h3>¿Tu proyecto aquí?</h3><p>Si tu equipo repite el mismo trabajo cada día, probablemente se puede automatizar. Cuéntame qué está pasando.</p><div class="b-actions"><a class="b-btn is-accent" href="/trabajemos/">Trabajemos juntos <span aria-hidden="true">→</span></a></div></article>`;
const projectGrid=productArt=>`<div class="b-ventures">${ventures.map(ventureCard).join('')}</div><div class="b-projects" data-carousel>${projects.map(p=>projectCard(p,productArt)).join('')}${ideaCard()}</div>`;

function stats(){
 const items=[[projects.length,'productos construidos y en uso'],[`${videos.length}+`,'videos sobre IA en YouTube'],[contestFilms,'cortos en concursos de cine con IA'],['Semanal',`${newsletter.name} en tu correo`]];
 return `<section class="b-stats" aria-label="En números">${items.map(([n,l])=>`<div><strong>${esc(n)}</strong><span>${esc(l)}</span></div>`).join('')}</section>`;
}
function proofStrip(){
 const row=proof.map(p=>`<span>${esc(p)}</span>`).join('<i aria-hidden="true">✦</i>');
 return `<section class="b-proof" aria-label="Dónde ha aparecido mi trabajo"><p>Mi trabajo en</p><div class="b-marquee"><div>${row}<i aria-hidden="true">✦</i></div><div aria-hidden="true">${row}<i>✦</i></div></div></section>`;
}
function mailPreview(){
 const items=[['01 · Para entender','La historia detrás de OpenAI','/blog/openai-la-historia-detras-del-video/'],['02 · Para imaginar','Preserved: cine hecho con IA','/videos/preserved/'],['03 · Para construir','Nexa Visit: una visita sin filas','/proyectos/nexa/']];
 return `<div class="b-mail" aria-label="Vista previa de la edición 001"><div class="b-mail-bar"><span></span><span></span><span></span><em>Bandeja de entrada</em></div><div class="b-mail-from"><b>SI</b><div><strong>${esc(newsletter.name)} · David Rocha</strong><small>Edición 001 · Crear en la era de la IA</small></div></div><p class="b-mail-open">La tecnología avanza rápido. El criterio sigue necesitando tiempo.</p><ol>${items.map(([k,t,h])=>`<li><a href="${h}"><span>${k}</span>${t} <i aria-hidden="true">→</i></a></li>`).join('')}</ol><a class="b-link" href="/newsletter/#edicion-001">Leer la edición completa <span aria-hidden="true">→</span></a></div>`;
}
function newsletterBlock(source='home'){
 return `<section class="b-newsletter" id="newsletter"><div class="b-wrap b-newsletter-grid"><div><p class="b-eyebrow">NEWSLETTER · ${esc(newsletter.name.toUpperCase())}</p><h2>${esc(newsletter.promise)}</h2><p class="b-head-lead">${esc(newsletter.description)}</p><ol class="b-steps">${newsletter.steps.map(([t,d],i)=>`<li><span>0${i+1}</span><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></li>`).join('')}</ol>${subscribeForm(source,{dark:true,label:'Quiero recibirlo'})}</div>${mailPreview()}</div></section>`;
}
function servicesGrid(){
 const byslug=Object.fromEntries(projects.map(p=>[p.slug,p]));
 return `<div class="b-services">${services.map((s,i)=>`<article><span class="b-num">0${i+1}</span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><p class="b-examples"><b>Ejemplos:</b> ${[...s.examples.map(x=>`<a href="/proyectos/${x}/">${esc(byslug[x].name)}</a>`),...(s.work||[]).map(esc)].join(' · ')}</p></article>`).join('')}</div>`;
}
function contactBand(){
 return `<section class="b-cta"><div class="b-wrap"><p class="b-eyebrow">TRABAJEMOS JUNTOS</p><h2>¿Tienes un problema que la IA<br>podría resolver?</h2><p>Cuéntame qué está frenando a tu equipo. Te respondo personalmente con una idea concreta.</p><div class="b-actions center"><a class="b-btn is-accent is-lg" href="${esc(contactUrl())}"${ext(contactUrl())}>${profile.calendarUrl?'Agendar una llamada':'Escríbeme'} <span aria-hidden="true">↗</span></a><a class="b-btn is-ghost is-lg" href="mailto:${contactEmail}">${contactEmail}</a></div></div></section>`;
}

export function brandHome({productArt}){
 return `<section class="b-hero b-wrap"><div class="b-hero-copy"><p class="b-kicker"><img class="b-avatar" src="/assets/david-rocha-portrait.jpg" alt="" width="28" height="28"><span class="b-dot"></span>${esc(profile.name)} · ${esc(profile.location)}</p><h1>${profile.headline}</h1><p class="b-lead">${esc(profile.lead)}</p><div class="b-hero-signup"><p><strong>${esc(newsletter.name)}</strong> — ${esc(lowerFirst(newsletter.promise))}</p>${subscribeForm('hero')}</div><div class="b-actions"><a class="b-btn is-dark" href="/trabajemos/">Trabajemos juntos <span aria-hidden="true">→</span></a><a class="b-link" href="#proyectos">Ver mis proyectos <span aria-hidden="true">↓</span></a></div></div><figure class="b-portrait"><img src="/assets/david-rocha-portrait.jpg" alt="Retrato de David Rocha" width="720" height="720"><figcaption><strong>${esc(profile.name)}</strong><span>${profile.roles.map(esc).join(' · ')}</span></figcaption><a class="b-float b-float-1" href="${channelUrl}" target="_blank" rel="noreferrer"><b>▶</b><span><strong>${videos.length}+ videos</strong>en YouTube</span></a><a class="b-float b-float-2" href="/videos/preserved/"><b>✦</b><span><strong>Preserved</strong>Higgsfield Film Festival</span></a></figure></section>
 ${stats()}${proofStrip()}
 <section class="b-section b-wrap" id="proyectos">${head('PROYECTOS','Productos que puedes<br>probar hoy.','Software real, construido con IA y usado por equipos. Abre la demo y míralo funcionar.','<a class="b-link" href="/proyectos/">Todos los proyectos <span aria-hidden="true">→</span></a>')}${projectGrid(productArt)}</section>
 ${newsletterBlock('home')}
 <section class="b-section b-wrap" id="videos">${head('YOUTUBE · CINE CON IA','Videos, documentales<br>y cine hecho con IA.','Se actualiza solo: lo último del canal aparece aquí en cuanto lo publico.',`<a class="b-btn is-dark" href="${channelUrl}?sub_confirmation=1" target="_blank" rel="noreferrer">Suscribirme en YouTube <span aria-hidden="true">↗</span></a>`)}<div class="live-toolbar"><div class="filter-chips" aria-label="Formato de videos"><button data-format="all" aria-pressed="true">Todo</button><button data-format="video" aria-pressed="false">Videos</button><button data-format="short" aria-pressed="false">Shorts</button><button data-format="film" aria-pressed="false">Cine con IA</button></div><a class="b-link" href="/videos/">Ver todos los videos <span aria-hidden="true">→</span></a></div><div class="video-grid" data-live-grid data-limit="6"></div><p class="catalog-status" data-catalog-status></p></section>
 <section class="b-section b-wrap b-split"><article class="b-books"><div><p class="b-eyebrow">MINI LIBROS</p><h2>Del video a un libro<br>que se lee en una tarde.</h2><p>Convierto mis documentales en lecturas breves con capítulos, conceptos y fuentes.</p><ul>${miniBooks.map(b=>`<li><a href="/mini-libros/#${b.slug}">${esc(b.title)} <span aria-hidden="true">→</span></a></li>`).join('')}</ul><a class="b-btn is-dark" href="#newsletter">Avísame cuando salga <span aria-hidden="true">↑</span></a></div>${miniArt(miniBooks[0])}</article><aside class="b-now"><p class="b-eyebrow"><span class="b-dot"></span>AHORA MISMO · ${esc(now.updated.toUpperCase())}</p><h2>En qué estoy<br>trabajando.</h2><ul>${now.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul><div class="b-socials">${socials.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.name)} <span aria-hidden="true">↗</span></a>`).join('')}</div></aside></section>
 <section class="b-section b-wrap" id="empresas">${head('PARA EMPRESAS','Lo que puedo construir<br>para tu equipo.','Trabajo con pocas empresas a la vez para entregar algo que funcione, no una presentación.','<a class="b-link" href="/trabajemos/">Cómo trabajo <span aria-hidden="true">→</span></a>')}${servicesGrid()}</section>
 ${contactBand()}<script type="application/json" id="journey-catalog">${json({staticItems:[],videos})}</script>`;
}

export function brandProjects({productArt}){
 return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">PROYECTOS</p><h1>Una idea vale más<br>cuando funciona.</h1><p class="b-lead">Productos, sistemas y empresas que he construido. Casi todos tienen una demo abierta para que los pruebes.</p></section><section class="b-section b-wrap is-tight">${projectGrid(productArt)}</section>${contactBand()}`;
}

export function brandNewsletter(){
 const edition=[['01 · Para entender','La historia detrás de OpenAI','Un documental sobre decisiones, incentivos y la pregunta de quién tiene voz en el futuro de la IA.','/blog/openai-la-historia-detras-del-video/'],['02 · Para imaginar','Preserved','Un cortometraje que explora un futuro posible con herramientas de IA.','/videos/preserved/'],['03 · Para construir','Nexa Visit','Un problema concreto, cuatro perspectivas y una experiencia que empieza antes de llegar.','/proyectos/nexa/']];
 const faq=[['¿Cada cuánto llega?',`${newsletter.frequency}. Una sola edición, sin relleno.`],['¿Cuánto cuesta?','Nada. Es gratis.'],['¿Qué tiene de “potenciado con IA”?','Un sistema de agentes revisa y resume las fuentes. La IA hace el trabajo de buscar; el criterio de qué vale la pena y por qué sigue siendo mío.'],['¿Y si ya no lo quiero?','Cada correo tiene un enlace para darte de baja con un clic.']];
 return `<section class="b-newsletter is-hero"><div class="b-wrap b-newsletter-grid"><div><p class="b-eyebrow">NEWSLETTER · ${esc(newsletter.name.toUpperCase())}</p><h1>${esc(newsletter.promise)}</h1><p class="b-head-lead">${esc(newsletter.description)}</p>${subscribeForm('newsletter-page',{dark:true,label:'Quiero recibirlo'})}</div>${mailPreview()}</div></section>
 <section class="b-section b-wrap">${head('CÓMO FUNCIONA','La IA busca.<br>Yo elijo. Tú decides.')}<ol class="b-steps is-cards">${newsletter.steps.map(([t,d],i)=>`<li><span>0${i+1}</span><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></li>`).join('')}</ol></section>
 <section class="b-section b-wrap" id="edicion-001">${head('EDICIÓN 001 · OCTUBRE 2026','Crear en la era de la IA.','La tecnología avanza rápido. El criterio sigue necesitando tiempo. Esta primera edición reúne tres formas de acercarse a la IA: entender su historia, explorar lo que puede crear y convertir una necesidad cotidiana en un producto.')}<div class="b-edition">${edition.map(([k,t,d,h])=>`<a href="${h}"><span>${k}</span><h3>${t} <i aria-hidden="true">→</i></h3><p>${d}</p></a>`).join('')}</div></section>
 <section class="b-section b-wrap b-faq">${head('PREGUNTAS','Antes de suscribirte.')}<div>${faq.map(([q,a])=>`<details><summary>${esc(q)} <span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>
 <section class="b-section b-wrap"><div class="b-signup-card"><div><p class="b-eyebrow">${esc(newsletter.name.toUpperCase())}</p><h2>La próxima edición<br>puede ser la tuya.</h2></div>${subscribeForm('newsletter-bottom')}</div></section>`;
}

export function brandWork({productArt}){
 const process=[['Diagnóstico','Una llamada para entender el problema, el equipo y lo que ya existe.'],['Prototipo','Una primera versión funcionando, para probar con usuarios reales.'],['Lanzamiento','Ajustes, puesta en marcha y acompañamiento mientras tu equipo lo adopta.']];
 return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">TRABAJEMOS JUNTOS</p><h1>Llevemos la IA<br>a tu operación.</h1><p class="b-lead">Construyo herramientas con inteligencia artificial que tu equipo usa todos los días, y contenido con IA que hace que tu marca se vea distinta.</p><div class="b-actions"><a class="b-btn is-accent is-lg" href="${esc(contactUrl())}"${ext(contactUrl())}>${profile.calendarUrl?'Agendar una llamada':'Escríbeme'} <span aria-hidden="true">↗</span></a><a class="b-link" href="#casos">Ver casos reales <span aria-hidden="true">↓</span></a></div></section>
 <section class="b-section b-wrap is-tight">${head('SERVICIOS','Tres formas de trabajar juntos.')}${servicesGrid()}</section>
 <section class="b-section b-wrap">${head('PROCESO','De la conversación<br>a algo que funciona.')}<ol class="b-steps is-cards">${process.map(([t,d],i)=>`<li><span>0${i+1}</span><div><strong>${t}</strong><p>${d}</p></div></li>`).join('')}</ol></section>
 <section class="b-section b-wrap" id="casos">${head('CASOS','Productos que ya están funcionando.','','<a class="b-link" href="/proyectos/">Todos los proyectos <span aria-hidden="true">→</span></a>')}<div class="b-projects">${projects.filter(p=>p.demo).map(p=>projectCard(p,productArt)).join('')}</div></section>
 ${contactBand()}`;
}

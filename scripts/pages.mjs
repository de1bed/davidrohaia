import {channelUrl,contactEmail,gallos,miniLibros,newsletter,products,profile,proof,siteUrl,socials,thinking,tiktok,videos,vortex,webDesign,WHATSAPP_NUMBER,whatsappMessage} from './content.mjs';

export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const arrow = '<span aria-hidden="true">↗</span>';
const down = '<span aria-hidden="true">↓</span>';
const next = '<span aria-hidden="true">→</span>';

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
const preservedFilmId = 'XfkdES89S5E';
const slug = name => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// El índice de la página: así se lee la estructura antes de bajar.
const map = {
  empresa: [
    ['01', 'Cine', gallos.name, '#cine'],
    ['02', 'Agentes de IA', vortex.name, '#agentes'],
    ['03', 'Productos', products.map(p => p.name).join(' · '), '#productos'],
    ['04', 'Páginas web', 'Diseño e identidad', '#pagina']
  ],
  conocerlo: [
    ['05', 'YouTube', 'Cómo piensa', '#youtube'],
    ['06', 'TikTok', 'Lo más reciente', '#tiktok'],
    ['07', 'Mini libros', 'Una lectura por video', '#lecturas'],
    ['08', 'Newsletter', 'Según a qué te dedicas', '#newsletter']
  ]
};

export function shapeCatalog(list) {
  const clean = (list || []).filter(v => /^[\w-]{11}$/.test(v.id) && v.title);
  const preservedShorts = clean.filter(v => v.short && /preserved/i.test(v.title));
  const rest = clean.filter(v => !(v.short && /preserved/i.test(v.title)));
  const longs = rest.filter(v => !v.short);
  const shorts = rest.filter(v => v.short);
  if (preservedShorts.length) {
    const film = clean.find(v => v.id === preservedFilmId);
    const source = film || preservedShorts[0];
    shorts.push({id: source.id, title: thinking.preservedTitle, image: source.image, short: true, grouped: preservedShorts.length, context: thinking.preservedNote});
  }
  return {longs, shorts};
}

function whatsappButton(label = 'Escribir por WhatsApp', cls = 'b-btn is-accent') {
  return `<!-- WHATSAPP_NUMBER es un placeholder: cámbialo en scripts/content.mjs --><a class="${cls}" href="${esc(whatsappHref)}" target="_blank" rel="noreferrer">${esc(label)} ${arrow}</a>`;
}

export function subscribeForm(source, {dark = false} = {}) {
  return `<form class="b-form${dark ? ' is-dark' : ''}" data-subscribe data-source="${esc(source)}" novalidate>
<label class="b-field"><span>${esc(newsletter.emailLabel)}</span><input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="tu@correo.com"></label>
<label class="b-field"><span>${esc(newsletter.roleLabel)}</span><input name="oficio" type="text" autocomplete="organization-title" required minlength="2" maxlength="80" placeholder="${esc(newsletter.rolePlaceholder)}"></label>
<div class="b-hp" aria-hidden="true"><input name="company" tabindex="-1" autocomplete="off"></div>
<button class="b-btn is-accent" type="submit">${esc(newsletter.button)} ${next}</button>
<p class="b-form-note" data-subscribe-status role="status" aria-live="polite">Sin spam. Si ya no la quieres, le escribes y sales.</p>
</form>`;
}

// Videos: el servidor deja la primera versión y site.js la actualiza con el canal en vivo.
function videoButton(v, cls = '') {
  const context = v.context || (v.short ? 'Una idea corta del canal @davidrochaia.' : 'Un video del canal @davidrochaia.');
  return `<button class="v-thumb ${cls}" type="button" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-context="${esc(context)}" aria-label="Reproducir: ${esc(v.title)}"><img src="${esc(v.image)}" alt="" loading="lazy" data-fallback-id="${esc(v.id)}"><span class="v-play" aria-hidden="true">▶</span></button>`;
}
export const longCard = v => `<article class="v-card">${videoButton(v)}<h3>${esc(v.title)}</h3><p class="v-meta">${esc(v.publishedLabel || 'YouTube · @davidrochaia')}</p></article>`;
export const shortCard = v => `<li><article class="v-short">${videoButton(v, 'is-short')}<h3>${esc(v.title)}</h3>${v.grouped ? `<p class="v-meta">${esc(v.context)}</p>` : ''}</article></li>`;
function channel(limitLongs, limitShorts) {
  const {longs, shorts} = shapeCatalog(videos);
  const l = limitLongs ? longs.slice(0, limitLongs) : longs;
  const s = limitShorts ? shorts.slice(0, limitShorts) : shorts;
  return `<div class="v-grid" data-longs${limitLongs ? ` data-limit="${limitLongs}"` : ''}>${l.map(longCard).join('')}</div>
<div class="v-rail-head" data-shorts-head><h3>En corto</h3><p>Ideas de menos de un minuto.</p></div>
<ol class="v-rail" data-shorts${limitShorts ? ` data-limit="${limitShorts}"` : ''}>${s.map(shortCard).join('')}</ol>`;
}

function browser(shot, cls = '') {
  return `<figure class="b-window ${cls}"><div class="b-window-bar" aria-hidden="true"><i></i><i></i><i></i></div><img src="${esc(shot.src)}" alt="${esc(shot.alt)}"${shot.width ? ` width="${shot.width}" height="${shot.height}"` : ''} loading="lazy"></figure>`;
}

function sectionHead(n, kicker, title, text = '', extra = '') {
  return `<div class="s-head"><span class="s-num" aria-hidden="true">${n}</span><div><p class="b-eyebrow">${kicker}</p><h2>${title}</h2>${text ? `<p class="b-head-lead">${text}</p>` : ''}</div>${extra}</div>`;
}

function part(n, title, text) {
  return `<div class="b-part b-wrap"><p><span>Parte ${n}</span></p><h2>${title}</h2><p class="b-head-lead">${text}</p></div>`;
}

function productPanel(p) {
  const id = slug(p.name);
  const action = p.url
    ? `<a class="b-btn" href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.link)} ${arrow}</a>`
    : whatsappButton(`Pedir una demo de ${p.name}`, 'b-btn');
  return `<article class="p-panel" id="panel-${id}" role="tabpanel" aria-labelledby="tab-${id}">
<div class="p-copy"><p class="b-eyebrow">${esc(vortex.name)} · Producto</p><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p><div class="b-actions">${action}</div></div>
<div class="p-gallery" data-gallery>${browser(p.shots[0], 'is-main')}<div class="p-thumbs">${p.shots.map((s, j) => `<button type="button" data-shot="${esc(s.src)}" data-alt="${esc(s.alt)}" data-width="${s.width}" data-height="${s.height}" aria-label="Ver captura ${j + 1} de ${esc(p.name)}"${j ? '' : ' aria-current="true"'}><img src="${esc(s.src)}" alt="" loading="lazy"></button>`).join('')}</div></div>
</article>`;
}

function home() {
  const index = (label, items) => `<div><p class="b-map-label">${label}</p><ol>${items.map(([n, t, s, href]) => `<li><a href="${href}"><span>${n}</span><strong>${esc(t)}</strong><small>${esc(s)}</small><i aria-hidden="true">↓</i></a></li>`).join('')}</ol></div>`;
  return `<section class="b-hero b-wrap">
<div class="b-hero-copy"><p class="b-kicker"><span class="b-dot"></span>${esc(profile.name)} · ${esc(profile.location)}</p><h1>${esc(profile.headline)}</h1><p class="b-lead">${esc(profile.lead)}</p><div class="b-actions">${whatsappButton('Escribir por WhatsApp', 'b-btn is-accent is-lg')}<a class="b-link" href="#mapa">Ver lo que hace ${down}</a></div></div>
<div class="b-stack"><a class="b-stack-1" href="#cine">${browser({src: gallos.image, alt: gallos.imageAlt, width: 1400, height: 875})}</a><a class="b-stack-2" href="#agentes">${browser({src: vortex.image, alt: vortex.imageAlt, width: 1400, height: 875})}</a><a class="b-stack-3" href="#productos">${browser(products[0].shots[0])}</a><span class="b-float b-float-1"><b>▶</b><span><strong>${esc(gallos.name)}</strong>Cine y campañas</span></span><span class="b-float b-float-2"><b>✦</b><span><strong>${esc(vortex.name)}</strong>Agentes y productos</span></span></div>
</section>
<section class="b-map b-wrap" id="mapa" aria-label="Qué hay en esta página">${index('Para tu empresa', map.empresa)}${index('Para conocerlo', map.conocerlo)}</section>
<section class="b-proof" aria-label="Dónde ha aparecido su trabajo"><p>Su trabajo en</p><div class="b-marquee"><div>${proof.map(p => `<span>${esc(p)}</span>`).join('<i aria-hidden="true">✦</i>')}<i aria-hidden="true">✦</i></div><div aria-hidden="true">${proof.map(p => `<span>${esc(p)}</span>`).join('<i>✦</i>')}<i>✦</i></div></div></section>

${part(1, 'Lo que hace por una empresa.', 'Cuatro formas de poner la inteligencia artificial a trabajar: en pantalla, dentro de la operación, en productos y en la página con la que te encuentran.')}

<section class="b-section b-wrap b-row" id="cine"><div class="b-row-copy">${sectionHead('01', `${esc(gallos.name)} · Cine`, 'Primero, una imagen que se pueda proyectar.')}${gallos.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}<a class="b-link" href="${esc(gallos.url)}" target="_blank" rel="noreferrer">Entrar a ${esc(gallos.name)} ${arrow}</a></div>${browser({src: gallos.image, alt: gallos.imageAlt, width: 1400, height: 875})}</section>

<section class="b-section b-wrap b-row is-flip" id="agentes"><div class="b-row-copy">${sectionHead('02', `${esc(vortex.name)} · Agentes`, 'Después, adentro de la operación.')}${vortex.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}<a class="b-link" href="${esc(vortex.url)}" target="_blank" rel="noreferrer">Entrar a ${esc(vortex.name)} ${arrow}</a></div>${browser({src: vortex.image, alt: vortex.imageAlt, width: 1400, height: 875})}</section>

<section class="b-section b-wrap" id="productos">${sectionHead('03', `${esc(vortex.name)} · Productos`, 'De ese mismo laboratorio salen productos con nombre.', `${products.map(p => p.name).join(', ').replace(/, ([^,]*)$/, ' y $1')} no andan sueltos. Viven en ${esc(vortex.name)}.`)}
<div class="p-tabs" role="tablist" aria-label="Productos de ${esc(vortex.name)}" hidden>${products.map((p, i) => `<button type="button" role="tab" id="tab-${slug(p.name)}" aria-controls="panel-${slug(p.name)}" aria-selected="${i === 0}">${esc(p.name)}</button>`).join('')}</div>
<div class="p-panels">${products.map(productPanel).join('')}</div></section>

<section class="b-section b-wrap" id="pagina"><div class="b-web">${sectionHead('04', 'Diseño web · Identidad', 'Y la página con la que te encuentran.')}<div class="b-web-copy">${webDesign.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}<a class="b-link" href="${esc(gallos.url)}" target="_blank" rel="noreferrer">Ver cómo se presenta ${esc(gallos.name)} ${arrow}</a></div></div></section>

${part(2, 'Lo que comparte.', 'Si quieres saber cómo decide antes de escribirle, aquí está lo que publica: videos largos, cortos, lecturas y una nota por correo.')}

<section class="b-section b-wrap" id="youtube">${sectionHead('05', 'YouTube · @davidrochaia', esc(thinking.title), esc(thinking.text), `<a class="b-btn is-dark" href="${esc(channelUrl)}?sub_confirmation=1" target="_blank" rel="noreferrer">Suscribirme en YouTube ${arrow}</a>`)}${channel(3, 8)}<p class="b-more"><a class="b-link" href="/videos/">Ver el canal completo ${next}</a></p></section>

<section class="b-section b-wrap" id="tiktok">${sectionHead('06', `TikTok · @${esc(tiktok.handle)}`, esc(tiktok.title), esc(tiktok.text), `<a class="b-btn is-dark" href="${esc(tiktok.url)}" target="_blank" rel="noreferrer">Seguir en TikTok ${arrow}</a>`)}
<div class="t-embed" data-tiktok><blockquote class="tiktok-embed" cite="${esc(tiktok.url)}" data-unique-id="${esc(tiktok.handle)}" data-embed-type="creator" style="max-width:780px;min-width:288px"><section><a target="_blank" rel="noreferrer" href="${esc(tiktok.url)}?refer=creator_embed">@${esc(tiktok.handle)}</a></section></blockquote><p class="t-fallback">Si los videos no cargan, <a href="${esc(tiktok.url)}" target="_blank" rel="noreferrer">ábrelos directo en TikTok ${arrow}</a></p></div></section>

<section class="b-section b-wrap" id="lecturas"><div class="b-books">${sectionHead('07', 'Mini libros', esc(miniLibros.title))}<div class="b-books-copy">${miniLibros.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}<a class="b-link" href="/mini-libros/">Cómo nacen ${next}</a></div></div></section>

<section class="b-newsletter" id="newsletter"><div class="b-wrap b-newsletter-grid"><div>${sectionHead('08', esc(newsletter.name), esc(newsletter.promise))}<p class="b-head-lead">${esc(newsletter.description)}</p></div><div class="b-newsletter-card">${subscribeForm('inicio', {dark: true})}</div></div></section>

${contactBand()}`;
}

function contactBand() {
  return `<section class="b-cta" id="contacto"><div class="b-wrap"><p class="b-eyebrow">Contacto</p><h2>Si esto se parece a tu empresa, escríbele.</h2><p>Cuéntale qué estás tratando de producir, de meter en la operación o de publicar. Te contesta por WhatsApp.</p><div class="b-actions center">${whatsappButton('Abrir WhatsApp', 'b-btn is-accent is-lg')}<a class="b-btn is-ghost is-lg" href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a></div></div></section>`;
}

function videosPage() {
  return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">YouTube · @davidrochaia</p><h1>${esc(thinking.title)}</h1><p class="b-lead">${esc(thinking.text)}</p>
<div class="b-toolbar"><div class="b-chips" role="group" aria-label="Qué quieres ver"><button type="button" data-format="all" aria-pressed="true">Todo</button><button type="button" data-format="video" aria-pressed="false">Videos</button><button type="button" data-format="short" aria-pressed="false">En corto</button></div><label class="b-search"><span class="sr-only">Buscar en los videos</span><input type="search" data-video-search placeholder="Busca un tema"></label></div></section>
<section class="b-wrap b-library">${channel()}<p class="b-status" data-catalog-status></p><p class="b-more"><a class="b-link" href="${esc(channelUrl)}" target="_blank" rel="noreferrer">Abrir el canal en YouTube ${arrow}</a> <a class="b-link" href="${esc(tiktok.url)}" target="_blank" rel="noreferrer">Ver TikTok ${arrow}</a></p></section>`;
}

function miniPage() {
  const {longs} = shapeCatalog(videos);
  return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">Mini libros</p><h1>${esc(miniLibros.title)}</h1>${miniLibros.paragraphs.map(p => `<p class="b-lead">${esc(p)}</p>`).join('')}</section>
<section class="b-section b-wrap is-tight">${sectionHead('', 'De dónde salen', 'Nacen de videos que ya puedes ver.')}<div class="v-grid">${longs.slice(0, 4).map(v => `<article class="v-card">${videoButton(v)}<h3>${esc(v.title)}</h3><p class="v-meta">De este video sale un mini libro: la idea, corta, para leerla después.</p></article>`).join('')}</div></section>
<section class="b-cta"><div class="b-wrap"><p class="b-eyebrow">El siguiente</p><h2>Si quieres el siguiente, escríbele.</h2><p>Dile qué video te quedó dando vueltas y a qué te dedicas. El mini libro se arma desde ahí.</p><div class="b-actions center">${whatsappButton('Escribir por WhatsApp', 'b-btn is-accent is-lg')}</div></div></section>`;
}

function newsletterPage() {
  return `<section class="b-newsletter is-hero"><div class="b-wrap b-newsletter-grid"><div><p class="b-eyebrow">${esc(newsletter.name)}</p><h1>${esc(newsletter.promise)}</h1><p class="b-head-lead">${esc(newsletter.description)}</p><p class="b-head-lead">Negocios, economía e inteligencia artificial, contados según el trabajo de quien la recibe.</p></div><div class="b-newsletter-card">${subscribeForm('newsletter', {dark: true})}<p class="b-fine">${esc(newsletter.note)}</p></div></div></section>`;
}

function shell(title, body, current = '', description = profile.description) {
  const nav = [['/#mapa', 'Lo que hace', ''], ['/#productos', 'Productos', ''], ['/videos/', 'Videos', 'videos'], ['/mini-libros/', 'Mini libros', 'mini-libros'], ['/newsletter/', 'Newsletter', 'newsletter']];
  const fullTitle = current ? `${title} — David Rocha` : `David Rocha — ${title}`;
  const image = `${siteUrl}/assets/og.jpg`;
  const links = nav.map(([href, label, key]) => `<a href="${href}"${key && current === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html><html lang="es-MX"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f6f4f0"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:site_name" content="David Rocha"><meta property="og:locale" content="es_MX"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/assets/inter-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/site.css"></head><body class="${current ? 'inner' : 'home'}"><a class="skip-link" href="#contenido">Ir al contenido</a>
<header class="site-header"><div class="nav-shell"><a class="brand" href="/" aria-label="David Rocha, inicio"><img src="/assets/firma.webp" alt="@davidrochaia" width="967" height="280"></a><nav class="main-nav" aria-label="Principal">${links}</nav>${whatsappButton('WhatsApp', 'header-contact')}<button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menú"><span></span><span></span></button></div><nav id="mobile-nav" class="mobile-nav" aria-label="Menú móvil" hidden>${nav.map(([href, label]) => `<a href="${href}">${label} <span>→</span></a>`).join('')}${whatsappButton('Escribir por WhatsApp', 'mobile-cta')}</nav></header>
<main id="contenido">${body}</main>
<footer class="site-footer"><div class="b-footer-grid"><div><a class="brand" href="/" aria-label="Inicio"><img src="/assets/firma.webp" alt="" width="967" height="280" loading="lazy"></a><p>${esc(profile.lead)}</p></div><div><p class="b-eyebrow">En esta página</p>${nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}<a href="/#contacto">Contacto</a></div><div><p class="b-eyebrow">También</p>${socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.name)} ↗</a>`).join('')}<a href="${esc(gallos.url)}" target="_blank" rel="noreferrer">${esc(gallos.name)} ↗</a><a href="${esc(vortex.url)}" target="_blank" rel="noreferrer">${esc(vortex.name)} ↗</a><a href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a></div><div><p class="b-eyebrow">${esc(newsletter.name)}</p><p>${esc(newsletter.promise)}</p><a class="b-link" href="/newsletter/">Quiero recibirla ${next}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(profile.name)} · ${esc(profile.location)}</span></div></footer>
<dialog class="video-dialog" aria-labelledby="video-dialog-title"><div class="video-dialog-header"><span id="video-dialog-title">Video</span><button class="icon-button" type="button" data-close-video aria-label="Cerrar video">×</button></div><p class="video-context" data-video-context hidden></p><div class="video-embed"></div><a class="watch-youtube" target="_blank" rel="noreferrer">Abrir en YouTube ↗</a></dialog>
<script id="video-seed" type="application/json">${json({videos})}</script><script src="/site.js" defer></script></body></html>`;
}

export function allPages() {
  return {
    '/': shell(profile.headline, home()),
    '/videos/': shell('Videos', videosPage(), 'videos', thinking.text),
    '/mini-libros/': shell('Mini libros', miniPage(), 'mini-libros', miniLibros.paragraphs[0]),
    '/newsletter/': shell('Newsletter', newsletterPage(), 'newsletter', newsletter.description)
  };
}

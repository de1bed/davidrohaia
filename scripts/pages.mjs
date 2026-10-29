import {channelUrl,contactEmail,gallos,miniLibros,newsletter,products,profile,siteUrl,socials,thinking,videos,vortex,webDesign,WHATSAPP_NUMBER,whatsappMessage} from './content.mjs';

export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
const preservedFilmId = 'XfkdES89S5E';

export function shapeCatalog(list) {
  const clean = (list || []).filter(v => /^[\w-]{11}$/.test(v.id) && v.title);
  const preservedShorts = clean.filter(v => v.short && /preserved/i.test(v.title));
  const rest = clean.filter(v => !(v.short && /preserved/i.test(v.title)));
  const longs = rest.filter(v => !v.short);
  const shorts = rest.filter(v => v.short);
  if (preservedShorts.length) {
    const film = clean.find(v => v.id === preservedFilmId);
    const source = film || preservedShorts[0];
    shorts.push({
      id: source.id,
      title: thinking.preservedTitle,
      image: source.image,
      short: true,
      grouped: preservedShorts.length,
      context: thinking.preservedNote
    });
  }
  return {longs, shorts};
}

function whatsappButton(label = 'Escribir por WhatsApp', cls = 'btn') {
  return `<!-- WHATSAPP_NUMBER es un placeholder: cámbialo en scripts/content.mjs -->
<a class="${cls}" href="${esc(whatsappHref)}" target="_blank" rel="noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;
}

export function subscribeForm(source) {
  return `<form class="signup" data-subscribe data-source="${esc(source)}" novalidate>
<label class="field"><span>${esc(newsletter.emailLabel)}</span><input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="tu@correo.com"></label>
<label class="field"><span>${esc(newsletter.roleLabel)}</span><input name="oficio" type="text" autocomplete="organization-title" required minlength="2" maxlength="80" placeholder="${esc(newsletter.rolePlaceholder)}"></label>
<input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn" type="submit">${esc(newsletter.button)}</button>
<p class="form-status" data-subscribe-status role="status">Sin spam. Si ya no la quieres, le escribes y sales.</p>
</form>`;
}

function videoButton(v, cls = '') {
  const context = v.context || (v.short ? 'Una idea corta del canal @davidrochaia.' : 'Un video del canal @davidrochaia.');
  return `<button class="thumb ${cls}" type="button" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-context="${esc(context)}" aria-label="Reproducir: ${esc(v.title)}"><img src="${esc(v.image)}" alt="" loading="lazy" data-fallback-id="${esc(v.id)}"><span class="play" aria-hidden="true">▶</span></button>`;
}

function sala(mode) {
  const {longs, shorts} = shapeCatalog(videos);
  const feature = longs[0];
  const side = mode === 'home' ? longs.slice(1, 4) : longs.slice(1);
  const rail = mode === 'home' ? shorts.slice(0, 8) : shorts;
  const featureHtml = feature ? `<article class="feature">${videoButton(feature, 'is-wide')}<div><p class="kicker">Para ver cómo piensa</p><h3>${esc(feature.title)}</h3><p>${esc(feature.publishedLabel || 'YouTube · @davidrochaia')}</p></div></article>` : '<p>El canal se está actualizando.</p>';
  const sideHtml = side.map(v => `<li><article class="essay">${videoButton(v)}<div><h3>${esc(v.title)}</h3><p>${esc(v.publishedLabel || (v.short ? 'Corto' : 'Video'))}</p></div></article></li>`).join('');
  const railHtml = rail.map(v => `<li><article class="chip">${videoButton(v, v.short ? 'is-short' : '')}<h3>${esc(v.title)}</h3>${v.grouped ? `<p>${esc(v.context)}</p>` : ''}</article></li>`).join('');
  return `<div class="sala" data-sala="${mode}">${featureHtml}<ol class="essays">${sideHtml}</ol></div><ol class="rail">${railHtml}</ol>`;
}

function shots(product) {
  return `<div class="shots">${product.shots.map(s => `<figure><img src="${esc(s.src)}" alt="${esc(s.alt)}" width="${s.width}" height="${s.height}" loading="lazy"></figure>`).join('')}</div>`;
}

function heroReel() {
  const {longs} = shapeCatalog(videos);
  return `<div class="hero-reel" data-hero-reel>${longs.slice(0, 3).map(v => `<article>${videoButton(v)}<p class="reel-title">${esc(v.title)}</p></article>`).join('')}</div>`;
}

function home() {
  return `<section class="hero">
<div class="hero-copy">
<p class="kicker">${esc(profile.name)} · ${esc(profile.location)}</p>
<h1>${esc(profile.headline)}</h1>
<p class="lead">${esc(profile.lead)}</p>
<div class="actions">${whatsappButton()}<a class="text-link" href="#cine">Seguir la historia <span aria-hidden="true">↓</span></a></div>
</div>
${heroReel()}
</section>

<section class="chapter" id="cine">
<div class="chapter-copy">
<p class="kicker">En el set</p>
<h2>Primero, una imagen que se pueda proyectar.</h2>
${gallos.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
<p><a class="text-link" href="${esc(gallos.url)}" target="_blank" rel="noreferrer">Entrar a ${esc(gallos.name)} <span aria-hidden="true">↗</span></a></p>
</div>
<figure class="frame"><img src="${esc(gallos.image)}" alt="${esc(gallos.imageAlt)}" width="1400" height="875" loading="lazy"></figure>
</section>

<section class="chapter invert" id="agentes">
<figure class="frame"><img src="${esc(vortex.image)}" alt="${esc(vortex.imageAlt)}" width="1400" height="875" loading="lazy"></figure>
<div class="chapter-copy">
<p class="kicker">Dentro de la empresa</p>
<h2>Después, adentro de la operación.</h2>
${vortex.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
<p><a class="text-link" href="${esc(vortex.url)}" target="_blank" rel="noreferrer">Entrar a ${esc(vortex.name)} <span aria-hidden="true">↗</span></a></p>
</div>
</section>

<section class="chapter" id="productos">
<div class="chapter-intro">
<p class="kicker">${esc(vortex.name)}</p>
<h2>De ese mismo laboratorio salen productos con nombre.</h2>
<p>CTPatrol, NEXA VISIT y PrepIQ no andan sueltos. Viven en Vortex Lab.</p>
</div>
${products.map(p => `<article class="piece"><div class="piece-copy"><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p>${p.url ? `<a class="text-link" href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.link)} <span aria-hidden="true">↗</span></a>` : ''}</div>${shots(p)}</article>`).join('')}
</section>

<section class="chapter band" id="pagina">
<div class="chapter-copy">
<p class="kicker">La cara pública</p>
<h2>Y la página con la que te encuentran.</h2>
${webDesign.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
<p><a class="text-link" href="${esc(gallos.url)}" target="_blank" rel="noreferrer">Ver cómo se presenta ${esc(gallos.name)} <span aria-hidden="true">↗</span></a></p>
</div>
</section>

<section class="chapter" id="pensar">
<div class="chapter-intro">
<p class="kicker">YouTube · @davidrochaia</p>
<h2>${esc(thinking.title)}</h2>
<p>${esc(thinking.text)}</p>
<p><a class="text-link" href="/videos/">Ver el canal completo <span aria-hidden="true">→</span></a></p>
</div>
${sala('home')}
</section>

<section class="chapter" id="lecturas">
<div class="chapter-copy">
<p class="kicker">Mini libros</p>
<h2>${esc(miniLibros.title)}</h2>
${miniLibros.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
<p><a class="text-link" href="/mini-libros/">Cómo nacen <span aria-hidden="true">→</span></a></p>
</div>
</section>

<section class="chapter band" id="newsletter">
<div class="chapter-copy">
<p class="kicker">${esc(newsletter.name)}</p>
<h2>${esc(newsletter.promise)}</h2>
<p>${esc(newsletter.description)}</p>
${subscribeForm('inicio')}
</div>
</section>

<section class="close" id="contacto">
<h2>Si esto se parece a tu empresa, escríbele.</h2>
<p>Cuéntale qué estás tratando de producir, de meter en la operación o de publicar. Te contesta por WhatsApp.</p>
${whatsappButton('Abrir WhatsApp', 'btn is-large')}
<p class="fine">También puedes escribir a <a href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a>.</p>
</section>`;
}

function videosPage() {
  return `<section class="page-hero">
<p class="kicker">YouTube · @davidrochaia</p>
<h1>${esc(thinking.title)}</h1>
<p>${esc(thinking.text)}</p>
<div class="toolbar"><div class="filters" role="group" aria-label="Qué quieres ver"><button type="button" data-format="all" aria-pressed="true">Todo</button><button type="button" data-format="video" aria-pressed="false">Videos</button><button type="button" data-format="short" aria-pressed="false">En corto</button></div><label class="search"><span class="sr-only">Buscar en los videos</span><input type="search" data-video-search placeholder="Busca un tema"></label></div>
</section>
<section class="library" data-library>${sala('library')}</section>
<p class="catalog-status" data-catalog-status></p>
<p class="fine"><a class="text-link" href="${esc(channelUrl)}" target="_blank" rel="noreferrer">Abrir el canal en YouTube <span aria-hidden="true">↗</span></a></p>`;
}

function miniPage() {
  const {longs} = shapeCatalog(videos);
  const origins = longs.slice(0, 4);
  return `<section class="page-hero">
<p class="kicker">Mini libros</p>
<h1>${esc(miniLibros.title)}</h1>
${miniLibros.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
</section>
<section class="origins"><h2>Nacen de videos que ya puedes ver.</h2><ol class="essays is-grid">${origins.map(v => `<li><article class="essay">${videoButton(v)}<div><h3>${esc(v.title)}</h3><p>De este video sale un mini libro: la idea, corta, para leerla después.</p></div></article></li>`).join('')}</ol></section>
<section class="close"><h2>Si quieres el siguiente, escríbele.</h2><p>Dile qué video te quedó dando vueltas y a qué te dedicas. El mini libro se arma desde ahí.</p>${whatsappButton()}</section>`;
}

function newsletterPage() {
  return `<section class="page-hero">
<p class="kicker">${esc(newsletter.name)}</p>
<h1>${esc(newsletter.promise)}</h1>
<p>${esc(newsletter.description)}</p>
<p>Negocios, economía e inteligencia artificial, contados según el trabajo de quien la recibe.</p>
${subscribeForm('newsletter')}
<p class="fine">${esc(newsletter.note)}</p>
</section>`;
}

function shell(title, body, current = '', description = profile.description) {
  const nav = [['videos', 'Videos'], ['mini-libros', 'Mini libros'], ['newsletter', 'Newsletter']];
  const fullTitle = current ? `${title} — David Rocha` : `David Rocha — ${title}`;
  const image = `${siteUrl}/assets/og.jpg`;
  return `<!doctype html><html lang="es-MX"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#0A0A0C"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:site_name" content="David Rocha"><meta property="og:locale" content="es_MX"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/assets/anton-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/inter-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/site.css"></head><body class="${current ? 'inner' : 'home'}"><a class="skip" href="#contenido">Ir al contenido</a><header class="site-header"><div class="bar"><a class="brand" href="/" aria-label="David Rocha, inicio"><img src="/assets/firma.webp" alt="@davidrochaia" width="640" height="120"></a><nav class="main-nav" aria-label="Principal">${nav.map(([slug, label]) => `<a href="/${slug}/"${current === slug ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>${whatsappButton('WhatsApp', 'btn is-small')}<button class="menu" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menú"><span></span><span></span></button></div><nav id="mobile-nav" class="mobile-nav" aria-label="Menú móvil" hidden>${nav.map(([slug, label]) => `<a href="/${slug}/">${label}</a>`).join('')}${whatsappButton('WhatsApp')}</nav></header><main id="contenido">${body}</main><footer class="site-footer"><div><a class="brand" href="/"><img src="/assets/firma.webp" alt="" width="640" height="120"></a><p>${esc(profile.lead)}</p></div><div><p class="kicker">En esta página</p>${nav.map(([slug, label]) => `<a href="/${slug}/">${label}</a>`).join('')}<a href="/#contacto">Contacto</a></div><div><p class="kicker">También</p>${socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.name)} ↗</a>`).join('')}<a href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a><a href="${esc(gallos.url)}" target="_blank" rel="noreferrer">${esc(gallos.name)} ↗</a><a href="${esc(vortex.url)}" target="_blank" rel="noreferrer">${esc(vortex.name)} ↗</a></div></footer><dialog class="player" aria-labelledby="player-title"><div class="player-bar"><span id="player-title">Video</span><button type="button" data-close-video aria-label="Cerrar video">×</button></div><p class="player-context" data-video-context hidden></p><div class="player-frame"></div><a class="watch" target="_blank" rel="noreferrer">Abrir en YouTube ↗</a></dialog><script id="video-seed" type="application/json">${JSON.stringify({videos}).replace(/</g, '\\u003c')}</script><script src="/site.js" defer></script></body></html>`;
}

export function allPages() {
  return {
    '/': shell(profile.headline, home()),
    '/videos/': shell('Videos', videosPage(), 'videos', thinking.text),
    '/mini-libros/': shell('Mini libros', miniPage(), 'mini-libros', miniLibros.paragraphs[0]),
    '/newsletter/': shell('Newsletter', newsletterPage(), 'newsletter', newsletter.description)
  };
}

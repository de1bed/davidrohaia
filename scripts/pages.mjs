import {channelUrl,contactEmail,contactOptions,gallos,instagram,miniLibros,news,newsletter,products,profile,proof,reels,siteUrl,socials,thinking,tiktok,videoNotes,videoTags,videos,vortex,WHATSAPP_NUMBER,whatsappMessage} from './content.mjs';

export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const ext = url => /^https?:/.test(url) ? ' target="_blank" rel="noreferrer"' : '';
const arrow = '<span aria-hidden="true">↗</span>';
const next = '<span aria-hidden="true">→</span>';

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
const preservedFilmId = 'XfkdES89S5E';
export const slug = name => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ─── Videos ────────────────────────────────────────────────────────
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
export function tagFor(v) {
  if (v.grouped) return 'Cine';
  if (videoNotes[v.id]?.tag) return videoNotes[v.id].tag;
  return videoTags.find(t => new RegExp(t.pattern, 'i').test(v.title))?.tag || 'Opinión';
}
function videoButton(v, cls = '', image = v.image) {
  const context = videoNotes[v.id]?.note || v.context || (v.short ? 'Una idea corta del canal @davidrochaia.' : 'Un video del canal @davidrochaia.');
  return `<button class="v-thumb ${cls}" type="button" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-context="${esc(context)}" aria-label="Reproducir: ${esc(v.title)}"><img src="${esc(image)}" alt="" loading="lazy" data-fallback-id="${esc(v.id)}"><span class="v-play" aria-hidden="true">▶</span><span class="v-tag">${esc(tagFor(v))}</span></button>`;
}
const longCard = v => `<article class="v-card">${videoButton(v)}<h3>${esc(v.title)}</h3><p class="v-meta">${esc(videoNotes[v.id]?.note || v.publishedLabel || 'YouTube · @davidrochaia')}</p></article>`;
// "En corto": miniaturas propias de reels que llevan a TikTok (se editan en `reels`).
const reelCard = r => `<li data-reel data-title="${esc(r.title.toLocaleLowerCase('es'))}"><a class="v-short" href="${esc(r.url || tiktok.url)}" target="_blank" rel="noreferrer" aria-label="Ver en TikTok: ${esc(r.title)}"><span class="v-thumb is-short"><img src="${esc(r.image)}" alt="" loading="lazy" width="540" height="959"><span class="v-play" aria-hidden="true">▶</span></span><h3>${esc(r.title)}</h3></a></li>`;
function channel(limitLongs) {
  const {longs} = shapeCatalog(videos);
  const l = limitLongs ? longs.slice(0, limitLongs) : longs;
  return `<div class="v-grid" data-longs${limitLongs ? ` data-limit="${limitLongs}"` : ''}>${l.map(longCard).join('')}</div>
<div class="v-rail-head" data-shorts-head><h3>En corto</h3><p>Ideas de menos de un minuto.</p><a class="b-link" href="${esc(tiktok.url)}" target="_blank" rel="noreferrer">Ver en TikTok ${arrow}</a></div>
<ol class="v-rail" data-shorts>${reels.map(reelCard).join('')}<li><a class="v-short" href="${esc(tiktok.url)}" target="_blank" rel="noreferrer"><span class="v-thumb is-short rl-more"><strong>@${esc(tiktok.handle)}</strong><span>Más en TikTok ${arrow}</span></span></a></li></ol>`;
}

// ─── Piezas ────────────────────────────────────────────────────────
function whatsappButton(label = 'Escríbeme por WhatsApp', cls = 'b-btn is-accent') {
  return `<!-- WHATSAPP_NUMBER es un placeholder: cámbialo en scripts/content.mjs --><a class="${cls}" href="${esc(whatsappHref)}" target="_blank" rel="noreferrer">${esc(label)} ${arrow}</a>`;
}
export function subscribeForm(source, {dark = false} = {}) {
  return `<form class="b-form${dark ? ' is-dark' : ''}" data-subscribe data-source="${esc(source)}" novalidate>
<label class="b-field"><span>${esc(newsletter.emailLabel)}</span><input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="tu@correo.com"></label>
<label class="b-field"><span>${esc(newsletter.roleLabel)}</span><input name="oficio" type="text" autocomplete="organization-title" required minlength="2" maxlength="80" placeholder="${esc(newsletter.rolePlaceholder)}"></label>
<div class="b-hp" aria-hidden="true"><input name="company" tabindex="-1" autocomplete="off"></div>
<button class="b-btn is-accent" type="submit">${esc(newsletter.button)} ${next}</button>
<p class="b-form-note" data-subscribe-status role="status" aria-live="polite">Sin spam. Si ya no la quieres, me escribes y sales.</p>
</form>`;
}
function head(kicker, title, text = '', extra = '') {
  return `<div class="s-head"><div><p class="b-eyebrow">${kicker}</p><h2>${title}</h2>${text ? `<p class="b-head-lead">${text}</p>` : ''}</div>${extra}</div>`;
}
function action(item, cls = 'b-btn') {
  if (item.video) return `<button class="${cls}" type="button" data-video="${esc(item.video)}" data-title="${esc(item.title)}" data-context="${esc(item.text || '')}">${esc(item.label || 'Ver video')} <span aria-hidden="true">▶</span></button>`;
  const href = item.href || item.url;
  return `<a class="${cls}" href="${esc(href)}"${ext(href)}>${esc(item.label || 'Ver más')} ${/^https?:/.test(href) ? arrow : next}</a>`;
}
function browser(shot, cls = '') {
  return `<figure class="b-window ${cls}"><div class="b-window-bar" aria-hidden="true"><i></i><i></i><i></i></div><img src="${esc(shot.src)}" alt="${esc(shot.alt)}"${shot.width ? ` width="${shot.width}" height="${shot.height}"` : ''} loading="lazy"></figure>`;
}

// Noticiero: tarjetas que rotan solas. La primera lleva mi foto.
function latestVideo() {
  const {longs} = shapeCatalog(videos);
  return longs[0];
}
function newsSlide(item, i) {
  const H = i === 0 ? 'h1' : 'h2';
  if (item.kind === 'intro') {
    return `<article class="n-slide is-intro" data-slide><div class="n-copy"><p class="b-kicker"><span class="b-dot"></span>${esc(profile.name)} · ${esc(profile.location)}</p><${H}>${esc(profile.headline)}</${H}><p class="b-lead">${esc(profile.lead)}</p><div class="b-actions">${whatsappButton('Escríbeme por WhatsApp', 'b-btn is-accent is-lg')}<a class="b-link" href="/lo-que-hago/">Lo que hago ${next}</a></div></div><figure class="n-media is-portrait"><img src="${esc(profile.photo)}" alt="Retrato de ${esc(profile.name)}" width="720" height="720"></figure></article>`;
  }
  if (item.kind === 'latest-video') {
    const v = latestVideo();
    if (!v) return '';
    const note = videoNotes[v.id] || {};
    const image = v.image || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    return `<article class="n-slide" data-slide data-latest-video><div class="n-copy"><p class="n-kicker"><span class="n-tag">${esc(tagFor(v))}</span>${esc(item.kicker)}</p><${H} data-latest-title>${esc(note.title || v.title)}</${H}><p class="b-lead" data-latest-note>${esc(note.note || 'Lo más nuevo del canal: contexto, opinión y un poco de ironía.')}</p><div class="b-actions"><button class="b-btn is-accent is-lg" type="button" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-latest-button>Ver el video <span aria-hidden="true">▶</span></button><a class="b-link" href="/videos/">Más videos ${next}</a></div></div><figure class="n-media is-video"><button type="button" class="n-play" data-video="${esc(v.id)}" data-title="${esc(v.title)}" aria-label="Reproducir: ${esc(v.title)}" data-latest-thumb><img src="${esc(image)}" alt="" data-fallback-id="${esc(v.id)}"><span class="v-play" aria-hidden="true">▶</span></button></figure></article>`;
  }
  return `<article class="n-slide" data-slide><div class="n-copy"><p class="n-kicker">${item.tag ? `<span class="n-tag">${esc(item.tag)}</span>` : ''}${esc(item.kicker)}</p><${H}>${esc(item.title)}</${H}><p class="b-lead">${esc(item.text)}</p><div class="b-actions">${action({...item.button, title: item.title, text: item.text}, 'b-btn is-accent is-lg')}</div></div><figure class="n-media"><img src="${esc(item.image)}" alt="${esc(item.imageAlt || '')}" loading="lazy"></figure></article>`;
}
function newsroom() {
  const slides = news.map(newsSlide).filter(Boolean);
  return `<section class="n-hero" aria-roledescription="carrusel" aria-label="Lo más reciente" data-newsroom><div class="b-wrap"><div class="n-stage">${slides.join('')}</div>
<div class="n-controls"><div class="n-dots" role="group" aria-label="Elegir noticia">${slides.map((_, i) => `<button type="button" data-goto="${i}" aria-label="Noticia ${i + 1} de ${slides.length}"${i ? '' : ' aria-current="true"'}><i></i></button>`).join('')}</div><div class="n-arrows"><button type="button" data-step="-1" aria-label="Noticia anterior">←</button><button type="button" data-pause aria-label="Pausar" aria-pressed="false">Ⅱ</button><button type="button" data-step="1" aria-label="Siguiente noticia">→</button></div></div></div><p class="sr-only" aria-live="polite" data-news-announce></p></section>`;
}

// Escaparate fijo con trabajos que rotan (Gallos Media, Vortex Lab).
function showcase(brand, items, id) {
  const media = items.map((it, i) => `<article class="sc-item" data-sc-item${i ? ' hidden' : ''}><figure><img src="${esc(it.image)}" alt="${esc(it.title)}" loading="lazy"></figure><div class="sc-caption"><p class="sc-label">${esc(it.label)}</p><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>${action({...it, label: it.video ? 'Ver' : 'Conocer'}, 'b-btn is-light')}</div></article>`).join('');
  const picks = items.map((it, i) => `<button type="button" data-sc-pick="${i}"${i ? '' : ' aria-current="true"'}><img src="${esc(it.image)}" alt="" loading="lazy"><span>${esc(it.title)}</span></button>`).join('');
  return `<section class="b-section b-wrap sc" id="${id}" data-showcase><div class="sc-intro"><p class="b-eyebrow">${esc(brand.role)}</p><h2>${esc(brand.name)}</h2><p class="sc-summary">${esc(brand.summary)}</p>${brand.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}<a class="b-link" href="${esc(brand.url)}" target="_blank" rel="noreferrer">Entrar a ${esc(brand.name)} ${arrow}</a></div><div class="sc-stage"><div class="sc-media">${media}</div><div class="sc-picks" role="group" aria-label="Trabajos de ${esc(brand.name)}">${picks}</div></div></section>`;
}

function bookCard(b) {
  const buy = b.buyUrl ? `<a class="b-btn is-accent" href="${esc(b.buyUrl)}" target="_blank" rel="noreferrer">Comprar${b.price ? ` · ${esc(b.price)}` : ''} ${arrow}</a>` : `<a class="b-btn" href="/newsletter/">Avísame cuando salga ${next}</a>`;
  return `<article class="bk-card"><div class="bk-cover is-${esc(b.tone)}"><small>MINI LIBRO · DAVID ROCHA</small><strong>${esc(b.title)}</strong><span>${esc(b.subtitle)}</span><b>${esc(b.status)}</b></div><div class="bk-body"><p>${b.buyUrl ? 'Disponible' : 'Te aviso por el newsletter cuando salga.'}</p>${buy}</div></article>`;
}

function newsletterBlock(source, {page = false} = {}) {
  const H = page ? 'h1' : 'h2';
  return `<section class="b-newsletter${page ? ' is-hero' : ''}" id="newsletter"><div class="b-wrap"><div class="nl-grid"><div><p class="b-eyebrow">${esc(newsletter.name)}</p><${H}>${esc(newsletter.promise)}</${H}><p class="b-head-lead">${esc(newsletter.description)}</p><ol class="nl-steps">${newsletter.steps.map(([t, d], i) => `<li><span>0${i + 1}</span><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></li>`).join('')}</ol></div><div class="nl-side"><img class="nl-preview" src="/assets/newsletter-preview.svg" alt="Ejemplo de cómo se ve una nota: qué pasó, por qué te importa y qué haría yo." loading="lazy"><div class="b-newsletter-card">${subscribeForm(source, {dark: true})}</div></div></div></div></section>`;
}

function contactBand() {
  return `<section class="b-cta"><div class="b-wrap cta-grid"><img src="${esc(profile.photo)}" alt="" width="720" height="720" loading="lazy"><div><p class="b-eyebrow">Contacto</p><h2>¿Tienes algo en mente? Platiquemos.</h2><p>Un software, agentes de IA, uno de mis productos, una producción o algo que todavía no tiene nombre. Cuéntame y lo vemos juntos.</p><div class="b-actions"><a class="b-btn is-accent is-lg" href="/contacto/">Escríbeme ${next}</a>${whatsappButton('WhatsApp', 'b-btn is-ghost is-lg')}</div></div></div></section>`;
}

// ─── Páginas ───────────────────────────────────────────────────────
function home() {
  return `${newsroom()}
${showcase(vortex, vortex.showcase, 'vortex')}
<section class="b-proof" aria-label="Dónde ha aparecido mi trabajo"><p>Mi trabajo en</p><div class="b-marquee"><div>${proof.map(p => `<span>${esc(p)}</span>`).join('<i aria-hidden="true">✦</i>')}<i aria-hidden="true">✦</i></div><div aria-hidden="true">${proof.map(p => `<span>${esc(p)}</span>`).join('<i>✦</i>')}<i>✦</i></div></div></section>
${showcase(gallos, gallos.works, 'gallos')}
<section class="b-section b-wrap" id="youtube">${head('YouTube · @davidrochaia', esc(thinking.title), esc(thinking.text), `<a class="b-btn is-dark" href="${esc(channelUrl)}?sub_confirmation=1" target="_blank" rel="noreferrer">Suscribirme ${arrow}</a>`)}${channel(3)}<ol class="r-posts" data-instagram hidden></ol><p class="b-more"><a class="b-link" href="/videos/">Ver todos los videos ${next}</a><a class="b-link" href="${esc(instagram.url)}" target="_blank" rel="noreferrer">También en Instagram ${arrow}</a></p></section>
<section class="b-section b-wrap" id="libros">${head('Mini libros', esc(miniLibros.title), esc(miniLibros.paragraphs[0]), `<a class="b-link" href="/mini-libros/">Ver la colección ${next}</a>`)}<div class="bk-grid">${miniLibros.books.map(bookCard).join('')}</div></section>
${newsletterBlock('inicio')}
${contactBand()}`;
}

function workPage() {
  const grid = items => `<div class="w-grid">${items.map(it => `<article class="w-card"><figure><img src="${esc(it.image)}" alt="${esc(it.title)}" loading="lazy"></figure><p class="sc-label">${esc(it.label)}</p><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>${action({...it, label: it.video ? 'Ver' : 'Conocer'}, 'b-link')}</article>`).join('')}</div>`;
  return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">Lo que hago</p><h1>Agentes, productos y cine. Todo con IA.</h1><p class="b-lead">Trabajo desde dos lugares: Vortex Lab, donde desarrollamos inteligencia artificial para empresas (agentes y productos), y Gallos Media, donde hacemos cine y campañas. Esto es parte de lo que ha salido de ahí.</p></section>
<section class="b-section b-wrap is-tight" id="vortex"><div class="w-head"><p class="b-eyebrow">${esc(vortex.role)}</p><h2>${esc(vortex.name)}</h2><p class="b-head-lead">${esc(vortex.summary)} ${vortex.paragraphs.map(esc).join(' ')}</p><a class="b-link" href="${esc(vortex.url)}" target="_blank" rel="noreferrer">Entrar a ${esc(vortex.name)} ${arrow}</a></div>${grid(vortex.showcase)}</section>
<section class="b-section b-wrap" id="gallos"><div class="w-head"><p class="b-eyebrow">${esc(gallos.role)}</p><h2>${esc(gallos.name)}</h2><p class="b-head-lead">${esc(gallos.summary)} ${gallos.paragraphs.map(esc).join(' ')}</p><a class="b-link" href="${esc(gallos.url)}" target="_blank" rel="noreferrer">Entrar a ${esc(gallos.name)} ${arrow}</a></div>${grid(gallos.works)}</section>
${contactBand()}`;
}

function productsPage() {
  return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">Productos · ${esc(vortex.name)}</p><h1>Productos que ya están funcionando.</h1><p class="b-lead">Salen de Vortex Lab. Los construimos para problemas que vimos de cerca y ahora cualquier empresa los puede usar.</p><nav class="pr-jump" aria-label="Productos">${products.map(p => `<a href="#${slug(p.name)}">${esc(p.name)}</a>`).join('')}</nav></section>
<div class="b-wrap pr-list">${products.map(p => {
    const id = slug(p.name);
    const mockup = p.mockup ? `<figure class="p-mockup"><img src="${esc(p.mockup.src)}" alt="${esc(p.mockup.alt)}" width="${p.mockup.width}" height="${p.mockup.height}" loading="lazy"></figure>` : '';
    const cta = p.url ? `<a class="b-btn is-accent" href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.link)} ${arrow}</a>` : '';
    return `<article class="p-panel" id="${id}"><div class="p-copy"><p class="b-eyebrow">${esc(p.name)}</p><h2>${esc(p.pitch)}</h2><p>${esc(p.text)}</p><p class="p-for"><b>Para:</b> ${esc(p.for)}</p><div class="b-actions">${cta}<a class="b-btn" href="/contacto/?quiero=producto&amp;producto=${encodeURIComponent(p.name)}">Quiero ${esc(p.name)} ${next}</a></div></div><div class="p-gallery" data-gallery>${mockup}${browser(p.shots[0], 'is-main')}<div class="p-thumbs">${p.shots.map((s, j) => `<button type="button" data-shot="${esc(s.src)}" data-alt="${esc(s.alt)}" data-width="${s.width}" data-height="${s.height}" aria-label="Ver captura ${j + 1} de ${esc(p.name)}"${j ? '' : ' aria-current="true"'}><img src="${esc(s.src)}" alt="" loading="lazy"></button>`).join('')}</div></div></article>`;
  }).join('')}</div>
${contactBand()}`;
}

function videosPage() {
  const tags = [...new Set(videoTags.map(t => t.tag))];
  return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">YouTube · @davidrochaia</p><h1>${esc(thinking.title)}</h1><p class="b-lead">${esc(thinking.text)}</p>
<div class="b-toolbar"><div class="b-chips" role="group" aria-label="Formato"><button type="button" data-format="all" aria-pressed="true">Todo</button><button type="button" data-format="video" aria-pressed="false">Videos</button><button type="button" data-format="short" aria-pressed="false">En corto</button></div><label class="b-search"><span class="sr-only">Buscar en los videos</span><input type="search" data-video-search placeholder="Busca un tema"></label></div>
<div class="b-chips is-tags" role="group" aria-label="Tema"><button type="button" data-tag="" aria-pressed="true">Todos los temas</button>${tags.map(t => `<button type="button" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}</div></section>
<section class="b-wrap b-library">${channel()}<p class="b-status" data-catalog-status></p><p class="b-more"><a class="b-link" href="${esc(channelUrl)}" target="_blank" rel="noreferrer">Abrir el canal en YouTube ${arrow}</a> <a class="b-link" href="${esc(tiktok.url)}" target="_blank" rel="noreferrer">Ver TikTok ${arrow}</a></p></section>`;
}

function miniPage() {
  return `<section class="b-page-hero b-wrap"><p class="b-eyebrow">Mini libros</p><h1>${esc(miniLibros.title)}</h1>${miniLibros.paragraphs.map(p => `<p class="b-lead">${esc(p)}</p>`).join('')}</section>
<section class="b-section b-wrap is-tight"><div class="bk-grid">${miniLibros.books.map(bookCard).join('')}</div></section>
${newsletterBlock('mini-libros')}`;
}

function newsletterPage() {
  const faq = [['¿Cada cuánto llega?', 'Cuando hay algo que valga la pena para tu trabajo. Sin relleno.'], ['¿Cuánto cuesta?', 'Nada. Es gratis.'], ['¿Por qué me preguntas a qué me dedico?', 'Porque la misma noticia no le pega igual a un restaurante que a una planta. Con eso la IA acomoda la nota a tu trabajo.'], ['¿Y si ya no la quiero?', 'Me escribes y sales. Cada correo trae cómo darte de baja.']];
  return `${newsletterBlock('newsletter', {page: true})}
<section class="b-section b-wrap nl-sample">${head('Cómo se ve', 'Tres partes, cinco minutos.', `Ejemplo para alguien que me dijo: “${esc(newsletter.sample.for)}”.`)}<ol class="nl-cards">${newsletter.sample.sections.map(([t, d], i) => `<li><span>0${i + 1}</span><strong>${esc(t)}</strong><p>${esc(d)}</p></li>`).join('')}</ol><p class="b-fine is-light">${esc(newsletter.note)}</p></section>
<section class="b-section b-wrap b-faq">${head('Preguntas', 'Antes de suscribirte.')}<div>${faq.map(([q, a]) => `<details><summary>${esc(q)} <span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
}

function contactPage() {
  return `<section class="b-wrap ct">
<div class="ct-side"><img src="${esc(profile.photo)}" alt="Retrato de ${esc(profile.name)}" width="720" height="720"><p class="b-eyebrow">Contacto</p><h1>Cuéntame qué quieres hacer.</h1><p class="b-lead">Elige lo que más se parece y escribe dos líneas. Te contesto yo, normalmente por WhatsApp.</p><div class="ct-direct">${whatsappButton('WhatsApp', 'b-btn is-accent')}<a class="b-btn" href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a></div><div class="b-socials">${socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.name)} ↗</a>`).join('')}</div></div>
<form class="ct-form" data-contact data-whatsapp="${esc(WHATSAPP_NUMBER)}" data-email="${esc(contactEmail)}" novalidate><fieldset><legend>¿Qué quieres hacer?</legend><div class="ct-options">${contactOptions.map((o, i) => `<label class="ct-option"><input type="radio" name="quiero" value="${esc(o.key)}" data-title="${esc(o.title)}"${i ? '' : ' checked'}><span><strong>${esc(o.title)}</strong><small>${esc(o.text)}</small></span></label>`).join('')}</div></fieldset>
<label class="b-field"><span>Tu nombre</span><input name="nombre" type="text" autocomplete="name" maxlength="80" placeholder="Cómo te llamas"></label>
<label class="b-field"><span>Cuéntame un poco</span><textarea name="mensaje" rows="4" maxlength="800" placeholder="Qué tienes en mente, para cuándo y para qué empresa"></textarea></label>
<div class="b-actions"><button class="b-btn is-accent is-lg" type="submit" data-channel="whatsapp">Enviar por WhatsApp ${arrow}</button><button class="b-btn is-lg" type="submit" data-channel="email">Enviar por correo ${arrow}</button></div>
<p class="b-form-note">Se abre WhatsApp o tu correo con el mensaje listo; tú decides si lo mandas.</p></form>
</section>`;
}

function shell(title, body, current = '', description = profile.description) {
  const nav = [['/lo-que-hago/', 'Lo que hago', 'lo-que-hago'], ['/productos/', 'Productos', 'productos'], ['/videos/', 'Videos', 'videos'], ['/mini-libros/', 'Mini libros', 'mini-libros'], ['/newsletter/', 'Newsletter', 'newsletter']];
  const fullTitle = current ? `${title} — David Rocha` : `David Rocha — ${title}`;
  const image = `${siteUrl}/assets/og.jpg`;
  const links = nav.map(([href, label, key]) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const seed = {videos, notes: videoNotes, tags: videoTags};
  return `<!doctype html><html lang="es-MX"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f6f4f0"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:site_name" content="David Rocha"><meta property="og:locale" content="es_MX"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/assets/inter-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/site.css"><script>document.documentElement.classList.add('js')</script></head><body class="${current ? 'inner' : 'home'}"><a class="skip-link" href="#contenido">Ir al contenido</a>
<header class="site-header"><div class="nav-shell"><a class="brand" href="/" aria-label="David Rocha, inicio"><img src="/assets/firma.webp" alt="@davidrochaia" width="967" height="280"></a><nav class="main-nav" aria-label="Principal">${links}</nav><a class="header-contact" href="/contacto/"${current === 'contacto' ? ' aria-current="page"' : ''}>Contacto ${next}</a><button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menú"><span></span><span></span></button></div><nav id="mobile-nav" class="mobile-nav" aria-label="Menú móvil" hidden>${nav.map(([href, label]) => `<a href="${href}">${label} <span>→</span></a>`).join('')}<a class="mobile-cta" href="/contacto/">Contacto <span>→</span></a></nav></header>
<main id="contenido">${body}</main>
<footer class="site-footer"><div class="b-footer-grid"><div><a class="brand" href="/" aria-label="Inicio"><img src="/assets/firma.webp" alt="" width="967" height="280" loading="lazy"></a><p>${esc(profile.lead)}</p></div><div><p class="b-eyebrow">Páginas</p>${nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}<a href="/contacto/">Contacto</a></div><div><p class="b-eyebrow">También</p>${socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.name)} ↗</a>`).join('')}<a href="${esc(gallos.url)}" target="_blank" rel="noreferrer">${esc(gallos.name)} ↗</a><a href="${esc(vortex.url)}" target="_blank" rel="noreferrer">${esc(vortex.name)} ↗</a></div><div><p class="b-eyebrow">${esc(newsletter.name)}</p><p>${esc(newsletter.promise)}</p><a class="b-link" href="/newsletter/">Quiero recibirla ${next}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(profile.name)} · ${esc(profile.location)}</span><a href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a></div></footer>
<dialog class="video-dialog" aria-labelledby="video-dialog-title"><div class="video-dialog-header"><span id="video-dialog-title">Video</span><button class="icon-button" type="button" data-close-video aria-label="Cerrar video">×</button></div><p class="video-context" data-video-context hidden></p><div class="video-embed"></div><a class="watch-youtube" target="_blank" rel="noreferrer">Abrir en YouTube ↗</a></dialog>
<script id="video-seed" type="application/json">${json(seed)}</script><script src="/site.js" defer></script></body></html>`;
}

export function allPages() {
  return {
    '/': shell(profile.headline, home()),
    '/lo-que-hago/': shell('Lo que hago', workPage(), 'lo-que-hago', `${vortex.summary} ${gallos.summary}`),
    '/productos/': shell('Productos', productsPage(), 'productos', products.map(p => `${p.name}: ${p.pitch}`).join(' ')),
    '/videos/': shell('Videos', videosPage(), 'videos', thinking.text),
    '/mini-libros/': shell('Mini libros', miniPage(), 'mini-libros', miniLibros.paragraphs[0]),
    '/newsletter/': shell('Newsletter', newsletterPage(), 'newsletter', newsletter.description),
    '/contacto/': shell('Contacto', contactPage(), 'contacto', 'Software a la medida, agentes de IA, uno de mis productos o una producción. Cuéntame qué quieres hacer.')
  };
}

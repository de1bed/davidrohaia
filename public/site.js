(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Menú móvil
  const menu = document.querySelector('.menu-button');
  const mobile = document.querySelector('.mobile-nav');
  const closeMenu = () => { if (!menu) return; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); mobile.hidden = true; };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobile.hidden = !open;
  });
  mobile?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && mobile && !mobile.hidden) { closeMenu(); menu.focus(); } });

  // Reproductor de YouTube
  const dialog = document.querySelector('.video-dialog');
  let trigger;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-video]');
    if (!button || !dialog || !/^[\w-]{11}$/.test(button.dataset.video)) return;
    trigger = button;
    const id = button.dataset.video;
    const context = dialog.querySelector('[data-video-context]');
    context.textContent = button.dataset.context || '';
    context.hidden = !button.dataset.context;
    document.getElementById('video-dialog-title').textContent = button.dataset.title || 'Video de David Rocha';
    const frame = document.createElement('iframe');
    frame.title = button.dataset.title || 'Reproductor de YouTube';
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    dialog.querySelector('.video-embed').replaceChildren(frame);
    dialog.querySelector('.watch-youtube').href = `https://www.youtube.com/watch?v=${id}`;
    dialog.showModal();
    document.dispatchEvent(new Event('player-change'));
  });
  dialog?.querySelector('[data-close-video]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => { dialog.querySelector('.video-embed').replaceChildren(); trigger?.focus(); document.dispatchEvent(new Event('player-change')); });

  // Rotador genérico: avanza solo, se pausa con el mouse encima, al enfocar, con un video abierto o con la pestaña oculta.
  function rotator({root, count, show, delay, pauseButton}) {
    let index = 0, timer, hover = false, focus = false, userPaused = reduced;
    const paused = () => userPaused || hover || focus || document.hidden || dialog?.open;
    const schedule = () => {
      clearTimeout(timer);
      root.classList.toggle('is-paused', paused());
      if (pauseButton) { pauseButton.textContent = userPaused ? '▶' : 'Ⅱ'; pauseButton.setAttribute('aria-pressed', String(userPaused)); pauseButton.setAttribute('aria-label', userPaused ? 'Reanudar' : 'Pausar'); }
      if (!paused()) timer = setTimeout(() => go(index + 1), delay);
    };
    const go = (i, announce) => { index = (i + count) % count; show(index, announce); schedule(); };
    root.addEventListener('mouseenter', () => { hover = true; schedule(); });
    root.addEventListener('mouseleave', () => { hover = false; schedule(); });
    root.addEventListener('focusin', () => { focus = true; schedule(); });
    root.addEventListener('focusout', event => { if (!root.contains(event.relatedTarget)) { focus = false; schedule(); } });
    document.addEventListener('visibilitychange', schedule);
    document.addEventListener('player-change', schedule);
    pauseButton?.addEventListener('click', () => { userPaused = !userPaused; schedule(); });
    go(0);
    return {go: (i, announce) => go(i, announce), step: (d) => go(index + d, true)};
  }

  // Noticiero del inicio
  const newsroom = document.querySelector('[data-newsroom]');
  if (newsroom) {
    const slides = [...newsroom.querySelectorAll('[data-slide]')];
    const dots = [...newsroom.querySelectorAll('[data-goto]')];
    const announce = newsroom.querySelector('[data-news-announce]');
    const delay = 8000;
    newsroom.style.setProperty('--n-time', `${delay}ms`);
    const show = (i, say) => {
      slides.forEach((s, j) => { s.classList.toggle('is-active', i === j); s.inert = i !== j; });
      dots.forEach((d, j) => { d.removeAttribute('aria-current'); if (i === j) { void d.offsetWidth; d.setAttribute('aria-current', 'true'); } });
      if (say) announce.textContent = slides[i].querySelector('h1,h2')?.textContent || '';
    };
    const r = rotator({root: newsroom, count: slides.length, show, delay, pauseButton: newsroom.querySelector('[data-pause]')});
    dots.forEach(d => d.addEventListener('click', () => r.go(Number(d.dataset.goto), true)));
    newsroom.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => r.step(Number(b.dataset.step))));
  }

  // Escaparates de Gallos Media y Vortex Lab
  document.querySelectorAll('[data-showcase]').forEach(root => {
    const items = [...root.querySelectorAll('[data-sc-item]')];
    const picks = [...root.querySelectorAll('[data-sc-pick]')];
    const show = i => {
      items.forEach((it, j) => { it.hidden = i !== j; });
      picks.forEach((p, j) => { if (i === j) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current'); });
    };
    const r = rotator({root, count: items.length, show, delay: 6000});
    picks.forEach(p => p.addEventListener('click', () => r.go(Number(p.dataset.scPick))));
  });

  // Galería de capturas de productos
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const main = gallery.querySelector('.is-main img');
    gallery.querySelectorAll('[data-shot]').forEach(button => button.addEventListener('click', () => {
      Object.assign(main, {src: button.dataset.shot, alt: button.dataset.alt, width: Number(button.dataset.width), height: Number(button.dataset.height)});
      gallery.querySelectorAll('[data-shot]').forEach(b => b === button ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
    }));
  });

  // Carga diferida cuando la sección se acerca a la pantalla.
  const lazy = (node, load) => {
    if (!node) return;
    if (!('IntersectionObserver' in window)) return load();
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { observer.disconnect(); load(); } }, {rootMargin: '600px'});
    observer.observe(node);
  };
  // Instagram: publicaciones recientes por la API oficial (si está configurada).
  const igList = document.querySelector('[data-instagram]');
  lazy(igList, async () => {
    try {
      const response = await fetch('/api/instagram', {signal: AbortSignal.timeout(10000)});
      if (!response.ok) return;
      const {posts} = await response.json();
      const safe = (posts || []).filter(p => /^https:\/\/www\.instagram\.com\//.test(p.url) && /^https:\/\//.test(p.image)).slice(0, 6);
      if (!safe.length) return;
      igList.innerHTML = safe.map(p => `<li><a href="${esc(p.url)}" target="_blank" rel="noreferrer" aria-label="${esc(p.caption || 'Publicación de Instagram')}"><img src="${esc(p.image)}" alt="" loading="lazy">${p.video ? '<i>▶ Reel</i>' : ''}</a></li>`).join('');
      igList.hidden = false;
    } catch { /* se queda el enlace al perfil */ }
  });

  // Formulario de contacto: arma el mensaje y abre WhatsApp o el correo.
  const contact = document.querySelector('[data-contact]');
  if (contact) {
    const params = new URLSearchParams(location.search);
    const wanted = contact.querySelector(`input[name="quiero"][value="${CSS.escape(params.get('quiero') || '')}"]`);
    if (wanted) wanted.checked = true;
    if (params.get('producto')) contact.elements.mensaje.value = `Me interesa ${params.get('producto')}.`;
    let channel = 'whatsapp';
    contact.querySelectorAll('[data-channel]').forEach(b => b.addEventListener('click', () => { channel = b.dataset.channel; }));
    contact.addEventListener('submit', event => {
      event.preventDefault();
      const choice = contact.querySelector('input[name="quiero"]:checked');
      const name = contact.elements.nombre.value.trim();
      const text = contact.elements.mensaje.value.trim();
      const body = [`Hola David${name ? `, soy ${name}` : ''}.`, `Me interesa: ${choice?.dataset.title || 'platicar'}.`, text].filter(Boolean).join('\n');
      const url = channel === 'email'
        ? `mailto:${contact.dataset.email}?subject=${encodeURIComponent(`Contacto desde tu página: ${choice?.dataset.title || ''}`)}&body=${encodeURIComponent(body)}`
        : `https://wa.me/${contact.dataset.whatsapp}?text=${encodeURIComponent(body)}`;
      if (channel === 'email') location.href = url; else window.open(url, '_blank', 'noopener');
    });
  }

  // Newsletter
  const valid = value => /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i.test(value);
  document.querySelectorAll('[data-subscribe]').forEach(form => {
    const status = form.querySelector('[data-subscribe-status]');
    const button = form.querySelector('button[type="submit"]');
    const original = status.textContent;
    const say = (text, state) => { status.textContent = text; form.dataset.state = state || ''; };
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const email = form.elements.email.value.trim();
      const oficio = form.elements.oficio.value.trim().replace(/\s+/g, ' ');
      if (!valid(email)) { say('Revisa tu correo: parece que le falta algo.', 'error'); form.elements.email.focus(); return; }
      if (oficio.length < 2) { say('Cuéntame en una línea a qué te dedicas.', 'error'); form.elements.oficio.focus(); return; }
      button.disabled = true;
      say('Enviando…', 'loading');
      const fallback = `mailto:david@gallosmedia.com?subject=${encodeURIComponent('Quiero el newsletter')}&body=${encodeURIComponent(`Hola David. Quiero el newsletter.\nCorreo: ${email}\nA qué me dedico: ${oficio}`)}`;
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, oficio, source: form.dataset.source, company: form.elements.company.value}),
          signal: AbortSignal.timeout(12000)
        });
        if (response.ok) { form.reset(); say('Listo. Revisa tu correo para confirmar.', 'success'); return; }
        if (response.status === 400) { say('Revisa el correo y a qué te dedicas.', 'error'); return; }
        throw new Error('unavailable');
      } catch {
        status.innerHTML = '';
        const link = Object.assign(document.createElement('a'), {href: fallback, textContent: 'mándame un correo para apartar tu lugar ↗'});
        status.append('Todavía no está conectado el envío. Mientras tanto, ', link, '.');
        form.dataset.state = 'fallback';
      } finally { button.disabled = false; }
    });
    form.addEventListener('input', () => { if (form.dataset.state === 'error') say(original); });
  });

  // Catálogo de YouTube: primero lo que vino en la página; luego el canal en vivo.
  const seedNode = document.getElementById('video-seed');
  if (!seedNode) return;
  const seed = JSON.parse(seedNode.textContent);
  const notes = seed.notes || {};
  const tagRules = (seed.tags || []).map(t => ({tag: t.tag, re: new RegExp(t.pattern, 'i')}));
  const longsBox = document.querySelector('[data-longs]');
  const shortsBox = document.querySelector('[data-shorts]');
  const shortsHead = document.querySelector('[data-shorts-head]');
  const imageUrl = value => {
    if (typeof value === 'string' && value.startsWith('/assets/')) return value;
    try { const url = new URL(value); return url.protocol === 'https:' && /(^|\.)ytimg\.com$/.test(url.hostname) ? url.href : ''; } catch { return ''; }
  };
  let catalog = seed.videos || [];
  let format = 'all', search = '', tagFilter = '';

  const tagFor = v => v.grouped ? 'Cine' : notes[v.id]?.tag || tagRules.find(t => t.re.test(v.title))?.tag || 'Opinión';
  function shape(list) {
    const clean = list.filter(v => /^[\w-]{11}$/.test(v.id) && v.title);
    const longs = clean.filter(v => !v.short);
    return {longs};
  }
  function thumb(v, cls = '') {
    const src = imageUrl(v.image) || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    const context = notes[v.id]?.note || v.context || (v.short ? 'Una idea corta del canal @davidrochaia.' : 'Un video del canal @davidrochaia.');
    return `<button class="v-thumb ${cls}" type="button" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-context="${esc(context)}" aria-label="Reproducir: ${esc(v.title)}"><img src="${esc(src)}" alt="" loading="lazy" data-fallback-id="${esc(v.id)}"><span class="v-play" aria-hidden="true">▶</span><span class="v-tag">${esc(tagFor(v))}</span></button>`;
  }
  const longCard = v => `<article class="v-card">${thumb(v)}<h3>${esc(v.title)}</h3><p class="v-meta">${esc(notes[v.id]?.note || v.publishedLabel || 'YouTube · @davidrochaia')}</p></article>`;
  function bindFallbacks(root) {
    root.querySelectorAll('img[data-fallback-id]').forEach(img => {
      if (img.dataset.bound) return;
      img.dataset.bound = 'true';
      const swap = () => { if (img.dataset.failed) return; img.dataset.failed = 'true'; img.src = `https://i.ytimg.com/vi/${img.dataset.fallbackId}/hqdefault.jpg`; };
      img.addEventListener('error', swap, {once: true});
      // YouTube devuelve un cuadro gris de 120px cuando no existe la miniatura vertical.
      img.addEventListener('load', () => { if (img.naturalWidth && img.naturalWidth <= 120) swap(); });
    });
  }
  function updateLatest(longs) {
    const slide = document.querySelector('[data-latest-video]');
    const v = longs[0];
    if (!slide || !v) return;
    const note = notes[v.id] || {};
    slide.querySelector('[data-latest-title]').textContent = note.title || v.title;
    slide.querySelector('[data-latest-note]').textContent = note.note || 'Lo más nuevo del canal: contexto, opinión y un poco de ironía.';
    slide.querySelectorAll('[data-latest-button],[data-latest-thumb]').forEach(b => { b.dataset.video = v.id; b.dataset.title = v.title; });
    const img = slide.querySelector('[data-latest-thumb] img');
    const src = imageUrl(v.image) || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    if (img.getAttribute('src') !== src) { img.src = src; img.dataset.fallbackId = v.id; delete img.dataset.failed; }
  }
  function paint() {
    const q = search.toLocaleLowerCase('es');
    const all = shape(catalog);
    updateLatest(all.longs);
    if (!longsBox) { bindFallbacks(document); return; }
    const match = v => (!q || String(v.title).toLocaleLowerCase('es').includes(q)) && (!tagFilter || tagFor(v) === tagFilter);
    const longs = all.longs.filter(match);
    const longLimit = Number(longsBox.dataset.limit) || longs.length;
    const showLong = format !== 'short', showShort = format !== 'video';
    longsBox.innerHTML = showLong ? longs.slice(0, longLimit).map(longCard).join('') : '';
    longsBox.hidden = !showLong || !longs.length;
    // Los reels vienen en la página; aquí solo se filtran por búsqueda.
    let shorts = 0;
    if (shortsBox) {
      shortsBox.querySelectorAll('[data-reel]').forEach(item => {
        const ok = showShort && !tagFilter && (!q || item.dataset.title.includes(q));
        item.hidden = !ok;
        if (ok) shorts++;
      });
      shortsBox.hidden = !showShort || !shorts;
      if (shortsHead) shortsHead.hidden = shortsBox.hidden;
    }
    bindFallbacks(document);
    const status = document.querySelector('[data-catalog-status]');
    if (status) {
      const count = (showLong ? longs.length : 0) + shorts;
      status.textContent = count ? `${count} ${count === 1 ? 'pieza' : 'piezas'} del canal.` : 'Nada coincide con esa búsqueda.';
    }
  }
  document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => {
    format = button.dataset.format;
    document.querySelectorAll('[data-format]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    paint();
  }));
  document.querySelectorAll('[data-tag]').forEach(button => button.addEventListener('click', () => {
    tagFilter = button.dataset.tag;
    document.querySelectorAll('[data-tag]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    paint();
  }));
  document.querySelector('[data-video-search]')?.addEventListener('input', event => { search = event.target.value; paint(); });
  async function sync() {
    try {
      const response = await fetch('/api/youtube', {cache: 'no-store', signal: AbortSignal.timeout(16000)});
      if (!response.ok) throw new Error('unavailable');
      const data = await response.json();
      const list = data.videos?.filter(v => /^[\w-]{11}$/.test(v.id) && typeof v.title === 'string');
      if (!list?.length) throw new Error('empty');
      catalog = list;
      paint();
      const status = document.querySelector('[data-catalog-status]');
      if (status && data.stale) status.textContent += ' YouTube no respondió; esta es la última copia.';
    } catch { /* se queda el catálogo que vino en la página */ }
  }
  paint();
  sync();
})();

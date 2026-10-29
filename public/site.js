(() => {
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
  });
  dialog?.querySelector('[data-close-video]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => { dialog.querySelector('.video-embed').replaceChildren(); trigger?.focus(); });

  // Productos: pestañas y galería de capturas. Sin JS se ven todos los productos.
  const tabs = document.querySelector('.p-tabs');
  if (tabs) {
    const buttons = [...tabs.querySelectorAll('[role=tab]')];
    const select = (tab, focus) => {
      buttons.forEach(b => {
        const on = b === tab;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    buttons.forEach(b => b.addEventListener('click', () => select(b)));
    tabs.addEventListener('keydown', event => {
      const i = buttons.indexOf(document.activeElement);
      if (i < 0 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      select(buttons[(i + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length], true);
    });
    tabs.hidden = false;
    select(buttons[0]);
  }
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const main = gallery.querySelector('.is-main img');
    gallery.querySelectorAll('[data-shot]').forEach(button => button.addEventListener('click', () => {
      Object.assign(main, {src: button.dataset.shot, alt: button.dataset.alt, width: Number(button.dataset.width), height: Number(button.dataset.height)});
      gallery.querySelectorAll('[data-shot]').forEach(b => b === button ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
    }));
  });

  // TikTok: el embed oficial del perfil se carga solo cuando la sección se acerca a la pantalla.
  const tiktok = document.querySelector('[data-tiktok]');
  if (tiktok) {
    const load = () => {
      if (document.querySelector('script[src*="tiktok.com/embed.js"]')) return;
      const script = Object.assign(document.createElement('script'), {src: 'https://www.tiktok.com/embed.js', async: true});
      document.body.append(script);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { observer.disconnect(); load(); } }, {rootMargin: '600px'});
      observer.observe(tiktok);
    } else load();
  }

  // Formularios del newsletter
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
      if (oficio.length < 2) { say('Cuéntale en una línea a qué te dedicas.', 'error'); form.elements.oficio.focus(); return; }
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
        const link = Object.assign(document.createElement('a'), {href: fallback, textContent: 'envíale un correo para apartar tu lugar ↗'});
        status.append('Todavía no está conectado el envío. Mientras tanto, ', link, '.');
        form.dataset.state = 'fallback';
      } finally { button.disabled = false; }
    });
    form.addEventListener('input', () => { if (form.dataset.state === 'error') say(original); });
  });

  // Catálogo de YouTube: primero lo que vino en la página; luego el canal en vivo.
  const seedNode = document.getElementById('video-seed');
  const longsBox = document.querySelector('[data-longs]');
  if (!seedNode || !longsBox) return;
  const shortsBox = document.querySelector('[data-shorts]');
  const shortsHead = document.querySelector('[data-shorts-head]');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const imageUrl = value => {
    if (typeof value === 'string' && value.startsWith('/assets/')) return value;
    try { const url = new URL(value); return url.protocol === 'https:' && /(^|\.)ytimg\.com$/.test(url.hostname) ? url.href : ''; } catch { return ''; }
  };
  let catalog = JSON.parse(seedNode.textContent).videos || [];
  let format = 'all';
  let search = '';

  function shape(list) {
    const clean = list.filter(v => /^[\w-]{11}$/.test(v.id) && v.title);
    const preserved = clean.filter(v => v.short && /preserved/i.test(v.title));
    const rest = clean.filter(v => !(v.short && /preserved/i.test(v.title)));
    const longs = rest.filter(v => !v.short);
    const shorts = rest.filter(v => v.short);
    if (preserved.length) {
      const film = clean.find(v => v.id === 'XfkdES89S5E') || preserved[0];
      shorts.push({id: film.id, title: 'Preserved, contada en capítulos', image: film.image, short: true, grouped: preserved.length, context: 'Los capítulos cortos de Preserved viven en una sola pieza, para que el resto del canal se pueda leer.'});
    }
    return {longs, shorts};
  }
  function thumb(v, cls = '') {
    const src = imageUrl(v.image) || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    const context = v.context || (v.short ? 'Una idea corta del canal @davidrochaia.' : 'Un video del canal @davidrochaia.');
    return `<button class="v-thumb ${cls}" type="button" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-context="${esc(context)}" aria-label="Reproducir: ${esc(v.title)}"><img src="${esc(src)}" alt="" loading="lazy" data-fallback-id="${esc(v.id)}"><span class="v-play" aria-hidden="true">▶</span></button>`;
  }
  const longCard = v => `<article class="v-card">${thumb(v)}<h3>${esc(v.title)}</h3><p class="v-meta">${esc(v.publishedLabel || 'YouTube · @davidrochaia')}</p></article>`;
  const shortCard = v => `<li><article class="v-short">${thumb(v, 'is-short')}<h3>${esc(v.title)}</h3>${v.grouped ? `<p class="v-meta">${esc(v.context)}</p>` : ''}</article></li>`;
  function bindFallbacks(root) {
    root.querySelectorAll('img[data-fallback-id]').forEach(img => img.addEventListener('error', () => {
      if (img.dataset.failed) return;
      img.dataset.failed = 'true';
      img.src = `https://i.ytimg.com/vi/${img.dataset.fallbackId}/hqdefault.jpg`;
    }, {once: true}));
  }
  function paint() {
    const q = search.toLocaleLowerCase('es');
    const {longs, shorts} = shape(catalog.filter(v => !q || String(v.title).toLocaleLowerCase('es').includes(q)));
    const longLimit = Number(longsBox.dataset.limit) || longs.length;
    const shortLimit = Number(shortsBox?.dataset.limit) || shorts.length;
    const showLong = format !== 'short';
    const showShort = format !== 'video';
    longsBox.innerHTML = showLong ? longs.slice(0, longLimit).map(longCard).join('') : '';
    longsBox.hidden = !showLong || !longs.length;
    if (shortsBox) {
      shortsBox.innerHTML = showShort ? shorts.slice(0, shortLimit).map(shortCard).join('') : '';
      shortsBox.hidden = !showShort || !shorts.length;
      if (shortsHead) shortsHead.hidden = shortsBox.hidden;
    }
    bindFallbacks(document);
    const status = document.querySelector('[data-catalog-status]');
    if (status) {
      const count = (showLong ? longs.length : 0) + (showShort ? shorts.length : 0);
      status.textContent = count ? `${count} ${count === 1 ? 'pieza' : 'piezas'} del canal.` : 'Nada coincide con esa búsqueda.';
    }
  }
  document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => {
    format = button.dataset.format;
    document.querySelectorAll('[data-format]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
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

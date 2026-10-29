(() => {
  const menu = document.querySelector('.menu');
  const mobile = document.querySelector('.mobile-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobile.hidden = !open;
  });

  const dialog = document.querySelector('.player');
  let trigger;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-video]');
    if (!button || !dialog || !/^[\w-]{11}$/.test(button.dataset.video)) return;
    trigger = button;
    const id = button.dataset.video;
    const context = dialog.querySelector('[data-video-context]');
    context.textContent = button.dataset.context || '';
    context.hidden = !button.dataset.context;
    document.getElementById('player-title').textContent = button.dataset.title || 'Video de David Rocha';
    const frame = document.createElement('iframe');
    frame.title = button.dataset.title || 'Reproductor de YouTube';
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    dialog.querySelector('.player-frame').replaceChildren(frame);
    dialog.querySelector('.watch').href = `https://www.youtube.com/watch?v=${id}`;
    dialog.showModal();
  });
  dialog?.querySelector('[data-close-video]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    dialog.querySelector('.player-frame').replaceChildren();
    trigger?.focus();
  });

  const seedNode = document.getElementById('video-seed');
  if (!seedNode) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const imageUrl = value => {
    if (typeof value === 'string' && value.startsWith('/assets/')) return value;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && /(^|\.)ytimg\.com$/.test(url.hostname) ? url.href : '';
    } catch { return ''; }
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
      shorts.push({
        id: film.id,
        title: 'Preserved, contada en capítulos',
        image: film.image,
        short: true,
        grouped: preserved.length,
        context: 'Los capítulos cortos de Preserved viven en una sola pieza, para que el resto del canal se pueda leer.'
      });
    }
    return {longs, shorts};
  }

  function thumb(v, cls = '') {
    const src = imageUrl(v.image) || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    const context = v.context || (v.short ? 'Una idea corta del canal @davidrochaia.' : 'Un video del canal @davidrochaia.');
    return `<button class="thumb ${cls}" type="button" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-context="${esc(context)}" aria-label="Reproducir: ${esc(v.title)}"><img src="${esc(src)}" alt="" loading="lazy" data-fallback-id="${esc(v.id)}"><span class="play" aria-hidden="true">▶</span></button>`;
  }

  function bindFallbacks(root) {
    root.querySelectorAll('img[data-fallback-id]').forEach(img => img.addEventListener('error', () => {
      if (img.dataset.failed) return;
      img.dataset.failed = 'true';
      img.src = `https://i.ytimg.com/vi/${img.dataset.fallbackId}/hqdefault.jpg`;
    }, {once: true}));
  }

  function visible() {
    const q = search.toLocaleLowerCase('es');
    return catalog.filter(v => !q || String(v.title).toLocaleLowerCase('es').includes(q));
  }

  function paint() {
    const {longs, shorts} = shape(visible());
    const hero = document.querySelector('[data-hero-reel]');
    if (hero) {
      hero.innerHTML = longs.slice(0, 3).map(v => `<article>${thumb(v)}<p class="reel-title">${esc(v.title)}</p></article>`).join('');
      bindFallbacks(hero);
    }
    document.querySelectorAll('[data-sala]').forEach(sala => {
      const home = sala.dataset.sala === 'home';
      const showLong = format !== 'short';
      const showShort = format !== 'video';
      const feature = longs[0];
      const side = longs.slice(1, home ? 4 : undefined);
      const railItems = showShort ? (home ? shorts.slice(0, 8) : shorts) : [];
      sala.hidden = !showLong;
      sala.innerHTML = !showLong ? '' : feature
        ? `<article class="feature">${thumb(feature, 'is-wide')}<div><p class="kicker">Para ver cómo piensa</p><h3>${esc(feature.title)}</h3><p>${esc(feature.publishedLabel || 'YouTube · @davidrochaia')}</p></div></article><ol class="essays">${side.map(v => `<li><article class="essay">${thumb(v)}<div><h3>${esc(v.title)}</h3><p>${esc(v.publishedLabel || 'Video')}</p></div></article></li>`).join('')}</ol>`
        : '<p class="fine">Nada coincide con esa búsqueda.</p>';
      const rail = sala.nextElementSibling;
      if (rail?.classList.contains('rail')) {
        rail.innerHTML = railItems.map(v => `<li><article class="chip">${thumb(v, 'is-short')}<h3>${esc(v.title)}</h3>${v.grouped ? `<p>${esc(v.context)}</p>` : ''}</article></li>`).join('');
        rail.hidden = !railItems.length;
        bindFallbacks(rail);
      }
      bindFallbacks(sala);
    });
    const status = document.querySelector('[data-catalog-status]');
    if (status) {
      const {longs, shorts} = shape(visible());
      const count = (format === 'short' ? shorts.length : format === 'video' ? longs.length : longs.length + shorts.length);
      status.textContent = count ? `${count} ${count === 1 ? 'pieza' : 'piezas'} del canal.` : 'Nada coincide con esa búsqueda.';
    }
  }

  document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => {
    format = button.dataset.format;
    document.querySelectorAll('[data-format]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    paint();
  }));
  document.querySelector('[data-video-search]')?.addEventListener('input', event => {
    search = event.target.value;
    paint();
  });

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
    } catch { /* the server-rendered catalog stays */ }
  }
  paint();
  sync();

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
        const link = Object.assign(document.createElement('a'), {href: fallback, textContent: 'envíame un correo para apartar tu lugar ↗'});
        status.append('Todavía no está conectado el envío. Mientras tanto, ', link, '.');
        form.dataset.state = 'fallback';
      } finally { button.disabled = false; }
    });
    form.addEventListener('input', () => { if (form.dataset.state === 'error') say(original); });
  });
})();

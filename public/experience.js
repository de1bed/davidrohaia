(() => {
  const toggle = document.querySelector('[data-social-toggle]');
  const popover = document.getElementById('social-popover');
  const closeSocial = () => { if (!toggle) return; toggle.setAttribute('aria-expanded', 'false'); popover.hidden = true; };
  toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); popover.hidden = !open; });
  document.addEventListener('click', e => { if (!e.target.closest('.social-dock')) closeSocial(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && popover && !popover.hidden) { closeSocial(); toggle.focus(); } });
  const seedNode = document.getElementById('journey-catalog');
  if (!seedNode) return;
  const seed = JSON.parse(seedNode.textContent);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const imageUrl = value => { if (value?.startsWith('/assets/')) return value; try { const u = new URL(value); return u.protocol === 'https:' && /(^|\.)ytimg\.com$/.test(u.hostname) ? u.href : ''; } catch { return ''; } };
  const filmContext = {
    XfkdES89S5E: {label:'Higgsfield Global Film Festival',description:'Cortometraje creado con IA para el festival de Higgsfield. Una pregunta sobre conciencia, identidad y qué llamamos artificial.',href:'/videos/preserved/'},
    '1n8a83i2yVQ': {label:'Telcel HistorIAs · Cortometraje',description:'Una historia sobre las madres y el paso del tiempo, presentada al concurso Telcel HistorIAs.'},
    _PIaniIW0Zc: {label:'Higgsfield Action · Ciencia ficción',description:'Una pieza de ficción creada con IA y presentada al concurso Higgsfield Action.'}
  };
  const asItem = v => {
    const film = filmContext[v.id];
    return {...v,key:v.id,path:'watch',kind:'video',format:film?'film':v.short?'short':'video',image:imageUrl(v.image),kicker:film?.label||(v.short?'YouTube · Una idea en corto':'YouTube · Historia completa'),description:film?.description||(v.short?'Una idea breve para seguir la conversación.':'Una historia para abrir una pregunta y explorar lo que viene después.'),context:film?.label||'Canal @davidrochaia',href:film?.href,action:'Ver video'};
  };
  let videoItems = (seed.videos || []).filter(v => /^[\w-]{11}$/.test(v.id) && imageUrl(v.image)).map(asItem);
  let path = 'all', index = 0, format = 'all', search = '', visibleCount = Number(document.querySelector('[data-live-grid]')?.dataset.limit || 12), reelOffset = 0;
  const isHome = !!document.querySelector('.live-deck');
  const pageSize = isHome ? 3 : 12;
  let timer, userPaused = matchMedia('(prefers-reduced-motion: reduce)').matches, focusPaused = false;
  const visited = new Set();
  try { for (const v of JSON.parse(sessionStorage.getItem('david-paths') || '[]')) if (['watch','build','read'].includes(v)) visited.add(v); } catch {}
  const pathName = {watch:'Mirar',build:'Resolver',read:'Leer',all:'Explorar'};
  function mix() {
    const queues = [videoItems.filter(v => !v.short), videoItems.filter(v => v.short), seed.staticItems.filter(v => v.path === 'build'), seed.staticItems.filter(v => v.path === 'read')].map(q => [...q]);
    const all = [];
    while (queues.some(q => q.length)) for (const queue of queues) if (queue.length) all.push(queue.shift());
    return path === 'all' ? all : all.filter(item => item.path === path);
  }
  function safeImageEvents(root) {
    root.querySelectorAll('img[data-fallback-id]').forEach(img => img.addEventListener('error', () => {
      if (img.dataset.failed) return;
      img.dataset.failed = 'true'; img.src = `https://i.ytimg.com/vi/${img.dataset.fallbackId}/hqdefault.jpg`;
    }, { once: true }));
  }
  function media(item) {
    if (item.art) return item.art;
    const attrs = `src="${esc(imageUrl(item.image))}" alt="${esc(item.title)}" data-fallback-id="${item.id}"`;
    return item.short ? `<img class="short-back" ${attrs} aria-hidden="true"><img class="short-front" ${attrs}>` : `<img class="story-photo" ${attrs}>`;
  }
  function renderStory(announce = false) {
    const stage = document.querySelector('[data-story-stage]');
    if (!stage) return;
    const items = mix(); if (!items.length) return;
    index = (index + items.length) % items.length;
    const item = items[index];
    const action = item.id ? `<button class="button solid" data-video="${item.id}" data-title="${esc(item.title)}" data-context="${esc(item.description)}">Ver ${item.short?'Short':'video'} ↗</button>` : `<a class="button solid" href="${esc(item.href)}">${esc(item.action)} ↗</a>`;
    const secondary = item.id ? item.href ? `<a class="text-link" href="${item.href}">La historia y el contexto ↗</a>` : `<a class="text-link" href="https://www.youtube.com/watch?v=${item.id}" target="_blank" rel="noreferrer">Abrir en YouTube ↗</a>` : '';
    stage.innerHTML = `<article class="story-card" data-story><div class="story-visual ${item.short?'is-short':''}">${media(item)}</div><div class="story-body"><div class="story-meta"><span>PARADA · ${pathName[item.path].toUpperCase()}</span><span>${esc(item.kicker)}</span></div><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><div class="story-actions">${action}${secondary}</div></div></article>`;
    safeImageEvents(stage);
    document.querySelector('[data-deck-count]').textContent = `${String(index + 1).padStart(2,'0')} / ${items.length}`;
    document.querySelector('[data-current-route]').textContent = `${pathName[item.path]} · ${item.kind === 'product'?'de un problema a una herramienta':item.kind === 'book'?'del video a una lectura':item.kind === 'newsletter'?'una conversación que continúa':'una historia para explorar'}`;
    document.querySelector('.route-map').dataset.current = item.path;
    if (announce) document.querySelector('[data-deck-announcement]').textContent = `${pathName[item.path]}: ${item.title}`;
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    const deck = document.querySelector('.live-deck'); if (!deck) return;
    const paused = userPaused || focusPaused || document.hidden || document.querySelector('.video-dialog')?.open || matchMedia('(prefers-reduced-motion: reduce)').matches;
    deck.classList.toggle('paused', paused);
    const button = document.querySelector('[data-deck="pause"]');
    button.textContent = userPaused ? '▷' : 'Ⅱ'; button.setAttribute('aria-label', userPaused?'Reanudar descubrimientos':'Pausar descubrimientos'); button.setAttribute('aria-pressed', String(userPaused));
    const line = deck.querySelector('.deck-time'); line.style.animation = 'none'; void line.offsetWidth; line.style.animation = '';
    if (!paused) timer = setTimeout(() => { index++; renderStory(); }, 9000);
  }
  function updateProgress() {
    const text = document.querySelector('[data-journey-progress]');
    if (text) text.textContent = visited.size ? `${visited.size} de 3 caminos explorados` : '3 caminos por descubrir';
    document.querySelectorAll('[data-path]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.path === path)); button.classList.toggle('visited', visited.has(button.dataset.path)); });
  }
  document.querySelectorAll('[data-path]').forEach(button => button.addEventListener('click', () => {
    path = button.dataset.path; index = 0;
    if (path !== 'all') visited.add(path);
    try { sessionStorage.setItem('david-paths', JSON.stringify([...visited])); } catch {}
    updateProgress(); renderStory(true);
  }));
  document.querySelectorAll('[data-deck]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.deck;
    if (action === 'pause') { userPaused = !userPaused; focusPaused = false; schedule(); }
    else { index += action === 'next' ? 1 : -1; renderStory(true); }
  }));
  document.querySelector('[data-surprise]')?.addEventListener('click', () => { path='all'; index=Math.floor(Math.random()*mix().length); updateProgress(); renderStory(true); document.querySelector('.discovery-layout').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}); });
  const deck = document.querySelector('.live-deck');
  deck?.addEventListener('focusin', e => { if (!e.target.closest('[data-deck]')) { focusPaused = true; schedule(); } });
  deck?.addEventListener('focusout', e => { if (!deck.contains(e.relatedTarget)) { focusPaused = false; schedule(); } });
  deck?.addEventListener('keydown', e => { if (!['ArrowLeft','ArrowRight'].includes(e.key) || e.target.tagName === 'INPUT') return; e.preventDefault(); index += e.key === 'ArrowRight' ? 1 : -1; renderStory(true); });
  document.addEventListener('visibilitychange', schedule);
  document.querySelector('.video-dialog')?.addEventListener('close', schedule);
  document.addEventListener('click', e => { if (e.target.closest('[data-video]')) setTimeout(schedule,0); });
  const selectedVideos = () => videoItems.filter(v => (format === 'all' || v.format === format) && v.title.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  function renderGrid() {
    const grid = document.querySelector('[data-live-grid]'); if (!grid) return;
    const matches = selectedVideos();
    const list = isHome ? Array.from({length:Math.min(pageSize,matches.length)},(_,i)=>matches[(reelOffset+i)%matches.length]) : matches.slice(0,visibleCount);
    grid.innerHTML = list.map(v => `<article class="video-card ${v.short?'short-card':''}"><button class="video-thumb ${v.short?'is-short':''}" data-video="${v.id}" data-title="${esc(v.title)}" data-context="${esc(v.description)}" aria-label="Reproducir: ${esc(v.title)}">${v.short?`<img class="short-back" src="${esc(v.image)}" alt="" loading="lazy">`:''}<img class="${v.short?'short-front':''}" src="${esc(v.image)}" alt="" loading="lazy" data-fallback-id="${v.id}"><span class="play-symbol" aria-hidden="true">▶</span><span class="media-tag">${v.format==='film'?'CINE CON IA':v.short?'SHORT':'VIDEO'}</span></button><div class="meta"><span>${esc(v.format==='film'?v.context:v.short?'Shorts':'YouTube')}</span><span>${esc(v.publishedLabel||'')}</span></div><h3><button class="title-button" data-video="${v.id}" data-title="${esc(v.title)}" data-context="${esc(v.description)}">${esc(v.title)}</button></h3>${v.format==='film'?`<p class="video-context-note">${esc(v.description)}</p>`:''}${v.href?`<a class="text-link film-context-link" href="${v.href}">Historia y contexto ↗</a>`:''}</article>`).join('');
    safeImageEvents(grid);
    document.querySelectorAll('[data-format]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.format === format)));
    const empty = document.querySelector('[data-empty-videos]'); if (empty) empty.hidden = matches.length > 0;
    const load = document.querySelector('[data-load-videos]'); if (load) load.hidden = visibleCount >= matches.length;
    document.querySelectorAll('[data-catalog-status]').forEach(el => el.textContent = `${matches.length} ${matches.length===1?'historia':'historias'} ${format==='all'?'en el catálogo':format==='short'?'en corto':format==='film'?'de cine con IA':'en video'} · ${isHome?'usa las flechas para seguir explorando':`mostrando ${list.length}`}`);
  }
  document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => { format=button.dataset.format; reelOffset=0; visibleCount=pageSize; renderGrid(); }));
  document.querySelector('[data-video-search]')?.addEventListener('input', e => { search=e.target.value; visibleCount=12; renderGrid(); });
  document.querySelector('[data-load-videos]')?.addEventListener('click', () => { visibleCount+=12; renderGrid(); });
  document.querySelectorAll('[data-reel]').forEach(button => button.addEventListener('click', () => { const count=selectedVideos().length;if(count)reelOffset=(reelOffset+(button.dataset.reel==='next'?pageSize:-pageSize)+count)%count;renderGrid(); }));
  let updating=false;
  async function sync() {
    if (updating) return; updating=true;
    const refresh=document.querySelector('[data-refresh-videos]');if(refresh){refresh.disabled=true;refresh.textContent='Actualizando…';}
    try {
      const response=await fetch('/api/youtube',{cache:'no-store',signal:AbortSignal.timeout(16000)});if(!response.ok)throw new Error('Unavailable');
      const data=await response.json();
      const list=data.videos?.filter(v=>/^[\w-]{11}$/.test(v.id)&&typeof v.title==='string'&&imageUrl(v.image));
      if(!list?.length)throw new Error('No videos');
      const activeKey=mix()[index]?.key;
      videoItems=list.map(asItem);
      const current=mix().findIndex(v=>v.key===activeKey);if(current>=0)index=current;else index=0;
      if(!deck?.contains(document.activeElement))renderStory();
      renderGrid();
      const status=document.querySelector('[data-sync-status]');
      if(status){status.classList.toggle('stale',!!data.stale||!!data.partial);status.innerHTML=`<i></i>${data.stale?'Última copia disponible':data.partial?`Conexión parcial · ${videoItems.length} historias`:`Canal conectado · ${videoItems.length} historias`}`;}
      if(data.stale)document.querySelectorAll('[data-catalog-status]').forEach(el=>{el.textContent+=' · YouTube no respondió; volveremos a consultar.';});
      else if(data.partial)document.querySelectorAll('[data-catalog-status]').forEach(el=>{el.textContent+=' · Un formato no respondió; conservamos sus videos guardados.';});
    } catch {
      const status=document.querySelector('[data-sync-status]');if(status){status.classList.add('stale');status.innerHTML='<i></i>Mostrando la última copia';}
      document.querySelectorAll('[data-catalog-status]').forEach(el=>{el.textContent+=' · No pudimos actualizar YouTube en este momento.';});
    } finally {updating=false;if(refresh){refresh.disabled=false;refresh.textContent='Actualizar ↻';}}
  }
  document.querySelector('[data-refresh-videos]')?.addEventListener('click',sync);
  updateProgress();renderStory();renderGrid();sync();
  setInterval(()=>{if(!document.hidden)sync();},120000);
})();

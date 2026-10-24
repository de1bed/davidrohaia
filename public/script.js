const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !open;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav?.hidden) {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    menuButton.focus();
  }
});

const carousel = document.querySelector('.news-carousel');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let carouselPause = () => {};
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const tabs = [...carousel.querySelectorAll('[data-go]')];
  const pauseButton = carousel.querySelector('[data-carousel="pause"]');
  slides.forEach((slide, index) => {
    slide.id = `slide-${index}`;
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-labelledby', `tab-${index}`);
    tabs[index].setAttribute('aria-controls', slide.id);
  });
  const reasons = new Set();
  let current = 0;
  let timer;
  let userPaused = reducedMotion.matches;
  let startX = 0;
  function schedule() {
    clearTimeout(timer);
    const paused = userPaused || reasons.size > 0 || reducedMotion.matches;
    carousel.classList.toggle('is-paused', paused);
    pauseButton.setAttribute('aria-pressed', String(userPaused));
    pauseButton.setAttribute('aria-label', userPaused ? 'Reanudar destacados' : 'Pausar destacados');
    pauseButton.textContent = userPaused ? '▷' : 'Ⅱ';
    if (!paused) timer = setTimeout(() => show(current + 1), 8000);
  }
  function show(index, announce = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.inert = i !== current;
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === current);
      tab.setAttribute('aria-selected', String(i === current));
      tab.tabIndex = i === current ? 0 : -1;
    });
    carousel.querySelector('.slide-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (announce) carousel.querySelector('[data-carousel-status]').textContent = slides[current].getAttribute('aria-label');
    schedule();
  }
  carouselPause = (reason, pause) => { pause ? reasons.add(reason) : reasons.delete(reason); schedule(); };
  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i, true)));
  carousel.querySelector('[data-carousel="next"]').addEventListener('click', () => show(current + 1, true));
  carousel.querySelector('[data-carousel="prev"]').addEventListener('click', () => show(current - 1, true));
  pauseButton.addEventListener('click', () => { userPaused = !userPaused; schedule(); });
  carousel.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') carouselPause('hover', true); });
  carousel.addEventListener('pointerleave', () => carouselPause('hover', false));
  carousel.addEventListener('focusin', () => carouselPause('focus', true));
  carousel.addEventListener('focusout', event => { if (!carousel.contains(event.relatedTarget)) carouselPause('focus', false); });
  document.addEventListener('visibilitychange', () => carouselPause('hidden', document.hidden));
  reducedMotion.addEventListener('change', schedule);
  carousel.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    if (event.target.closest('[data-carousel]')) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1);
    show(next, true);
    if (event.target.getAttribute('role') === 'tab') tabs[current].focus();
  });
  const stage = carousel.querySelector('.slide-stage');
  stage.addEventListener('touchstart', event => { startX = event.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 55) show(current + (distance > 0 ? -1 : 1), true);
  }, { passive: true });
  schedule();
}

const dialog = document.querySelector('.video-dialog');
let videoTrigger;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-video]');
  if (!trigger || !dialog || !/^[a-zA-Z0-9_-]{11}$/.test(trigger.dataset.video)) return;
  videoTrigger = trigger;
  const id = trigger.dataset.video;
  document.getElementById('video-dialog-title').textContent = trigger.dataset.title || 'Video de David Rocha';
  const frame = document.createElement('iframe');
  frame.title = trigger.dataset.title || 'Reproductor de YouTube';
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  dialog.querySelector('.video-embed').replaceChildren(frame);
  dialog.querySelector('.watch-youtube').href = `https://www.youtube.com/watch?v=${id}`;
  dialog.showModal();
  carouselPause('video', true);
});
dialog?.querySelector('[data-close-video]').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => {
  dialog.querySelector('.video-embed').replaceChildren();
  carouselPause('video', false);
  videoTrigger?.focus();
});

function safeImage(value) {
  if (value?.startsWith('/assets/')) return value;
  try { const url = new URL(value); return url.protocol === 'https:' && /(^|\.)ytimg\.com$/.test(url.hostname) ? url.href : ''; } catch { return ''; }
}
function videoCard(video) {
  const card = document.createElement('article');
  card.className = 'video-card';
  const thumb = document.createElement('button');
  thumb.className = 'video-thumb';
  thumb.dataset.video = video.id;
  thumb.dataset.title = video.title;
  thumb.setAttribute('aria-label', `Reproducir: ${video.title}`);
  const image = document.createElement('img');
  image.src = safeImage(video.image);
  image.alt = '';
  image.loading = 'lazy';
  const play = document.createElement('span');
  play.className = 'play-symbol'; play.setAttribute('aria-hidden', 'true'); play.textContent = '▶';
  const badge = document.createElement('span');
  badge.className = 'media-tag'; badge.textContent = video.short ? 'SHORT' : 'VIDEO';
  thumb.append(image, play, badge);
  const meta = document.createElement('div'); meta.className = 'meta';
  const category = document.createElement('span'); category.textContent = video.short ? 'Shorts' : 'YouTube';
  const date = document.createElement('span');
  if (video.published && Number.isFinite(Date.parse(video.published))) date.textContent = new Date(video.published).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', timeZone: 'America/Tijuana' });
  meta.append(category, date);
  const title = document.createElement('h3');
  const button = document.createElement('button'); button.className = 'title-button'; button.dataset.video = video.id; button.dataset.title = video.title; button.textContent = video.title;
  title.append(button); card.append(thumb, meta, title); return card;
}
async function updateVideos() {
  const grids = document.querySelectorAll('[data-youtube-grid]');
  if (!grids.length) return;
  try {
    const response = await fetch('/api/youtube', { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return;
    const data = await response.json();
    const items = data.videos?.filter(v => /^[a-zA-Z0-9_-]{11}$/.test(v.id) && typeof v.title === 'string' && safeImage(v.image));
    if (!items?.length) return;
    grids.forEach(grid => grid.replaceChildren(...items.slice(0, carousel ? 3 : 9).map(videoCard)));
    const latest = items.find(v => !v.short) || items[0];
    const hero = document.querySelector('[data-slide="0"]');
    const trigger = hero?.querySelector('[data-video]');
    if (hero && trigger && trigger.dataset.video !== latest.id) {
      const heading = hero.querySelector('[data-latest-headline]');
      heading.textContent = latest.title.length > 95 ? latest.title.slice(0, 92) + '…' : latest.title;
      heading.classList.add('feed-headline');
      hero.querySelector('[data-latest-description]').textContent = 'La publicación más reciente del canal. Mira el video completo y sigue la conversación.';
      trigger.dataset.video = latest.id; trigger.dataset.title = latest.title;
      const image = hero.querySelector('.image-art img'); image.src = safeImage(latest.image); image.alt = latest.title;
      hero.setAttribute('aria-label', `1 de 6: ${latest.title}`);
      const tab = document.querySelector('[data-go="0"]');
      tab.querySelector('strong').textContent = latest.title.length > 32 ? latest.title.slice(0, 30) + '…' : latest.title;
      tab.querySelector('img').src = safeImage(latest.image);
    }
  } catch { /* The verified editorial snapshot remains available. */ }
}
updateVideos();
setInterval(() => { if (!document.hidden) updateVideos(); }, 15 * 60 * 1000);

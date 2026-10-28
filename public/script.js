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

const dialog = document.querySelector('.video-dialog');
let videoTrigger;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-video]');
  if (!trigger || !dialog || !/^[a-zA-Z0-9_-]{11}$/.test(trigger.dataset.video)) return;
  videoTrigger = trigger;
  const id = trigger.dataset.video;
  const context = dialog.querySelector('[data-video-context]');
  if (context) { context.textContent = trigger.dataset.context || ''; context.hidden = !trigger.dataset.context; }
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
});
dialog?.querySelector('[data-close-video]').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => {
  dialog.querySelector('.video-embed').replaceChildren();
  videoTrigger?.focus();
});

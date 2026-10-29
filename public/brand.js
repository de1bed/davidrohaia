// Newsletter forms: subscribe through /api/subscribe; if no provider is configured
// (or it fails), fall back to a pre-filled email so the sign-up is never lost.
(() => {
  const contact = 'david@gallosmedia.com';
  const valid = value => /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i.test(value);
  const fallbackHref = email => `mailto:${contact}?subject=${encodeURIComponent('Quiero recibir Señal IA')}&body=${encodeURIComponent(`Hola David, quiero suscribirme a Señal IA con este correo: ${email}`)}`;
  document.querySelectorAll('[data-subscribe]').forEach(form => {
    const status = form.querySelector('[data-subscribe-status]');
    const button = form.querySelector('button[type="submit"]');
    const input = form.querySelector('input[type="email"]');
    const original = status.textContent;
    const say = (text, state) => { status.textContent = text; form.dataset.state = state || ''; };
    input.addEventListener('input', () => { if (form.dataset.state === 'error') say(original); });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const email = input.value.trim();
      if (!valid(email)) { say('Revisa tu correo: parece que le falta algo.', 'error'); input.focus(); return; }
      button.disabled = true; say('Enviando…', 'loading');
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, source: form.dataset.source, company: form.elements.company?.value || ''}),
          signal: AbortSignal.timeout(12000)
        });
        if (response.ok) { form.reset(); say('¡Listo! Revisa tu correo para confirmar tu suscripción.', 'success'); return; }
        if (response.status === 400) { say('Revisa tu correo: parece que le falta algo.', 'error'); return; }
        throw new Error('Unavailable');
      } catch {
        status.innerHTML = '';
        const link = Object.assign(document.createElement('a'), {href: fallbackHref(email), textContent: 'envíame un correo para confirmarla ↗'});
        status.append('Casi listo: ', link, '.');
        form.dataset.state = 'fallback';
      } finally { button.disabled = false; }
    });
  });
})();

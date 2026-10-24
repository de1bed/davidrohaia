const menu=document.querySelector('[data-menu]');
const nav=document.querySelector('[data-nav]');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('open',open);document.body.style.overflow=open?'hidden':''});
nav.addEventListener('click',e=>{if(!e.target.closest('a'))return;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');nav.classList.remove('open');document.body.style.overflow=''});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5%'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const toast=document.querySelector('[data-toast]');let timer;
document.querySelectorAll('[data-placeholder]').forEach(button=>button.addEventListener('click',()=>{toast.textContent=button.dataset.placeholder;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),3000)}));
document.querySelector('[data-year]').textContent=new Date().getFullYear();

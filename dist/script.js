const header=document.querySelector('.site-header');const menu=document.querySelector('.menu-button');
const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
menu?.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.14});document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));

import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {allPages,tagFor} from '../scripts/pages.mjs';
import {WHATSAPP_NUMBER,news,gallos,vortex,miniLibros,contactOptions,reels,agents,portfolio} from '../scripts/content.mjs';

const pages = allPages();
const html = Object.values(pages).join('\n');
const home = pages['/'];
const asset = path => existsSync(new URL(`../public${path}`, import.meta.url));

test('the site has its own routes for what I do, products and contact',()=>{
  assert.deepEqual(Object.keys(pages).sort(), ['/','/contacto/','/lo-que-hago/','/mini-libros/','/newsletter/','/productos/','/videos/']);
  for (const [href] of [['/lo-que-hago/'],['/productos/'],['/contacto/']]) assert.match(home, new RegExp(`href="${href}"`));
  assert.doesNotMatch(html, /CimaWash|Órbita|Treve|Señal IA|cientos de fuentes|usado por equipos|5 productos|biblioteca/i);
});

test('the site speaks in first person',()=>{
  assert.match(home, /Soy David, de Tijuana/);
  assert.match(home, /También produzco para Lunáticos TV/);
  assert.doesNotMatch(html, /David produce|David mete|David diseña|escríbele|Si quieres conocerlo/);
});

test('the home opens with a rotating newsroom: my photo first, then the latest video and the news',()=>{
  const stage = home.slice(home.indexOf('data-newsroom'), home.indexOf('class="b-proof"'));
  const slides = stage.match(/data-slide/g) || [];
  assert.equal(slides.length, news.length);
  assert.ok(stage.indexOf('/assets/david-rocha.webp') < stage.indexOf('data-latest-video'), 'la foto va primero');
  assert.match(stage, /La inteligencia artificial, puesta a trabajar\./);
  assert.match(stage, /data-latest-video[\s\S]*data-video="[\w-]{11}"/);
  assert.match(stage, /href="\/productos\/#ctpatrol"/);
  assert.match(stage, /data-video="XfkdES89S5E"/);
  assert.match(stage, /data-goto="0"/);
  assert.ok(asset('/assets/david-rocha.webp'));
});

test('Gallos Media and Vortex Lab are fixed sections whose work rotates with real images',()=>{
  for (const id of ['gallos','vortex']) assert.match(home, new RegExp(`id="${id}" data-showcase`));
  for (const item of [...gallos.works, ...vortex.showcase]) {
    assert.ok(home.includes(item.image), `falta ${item.title}`);
    assert.ok(asset(item.image), `no existe ${item.image}`);
  }
  assert.match(home, /data-video="XfkdES89S5E"/);
  assert.doesNotMatch(home, /gallos-home\.webp|vortex-home\.webp/, 'no screenshots of the websites');
  assert.match(home, /trámites del SAT/);
  assert.match(home, /Lunáticos TV/);
});

test('products have their real captures and every product anchor exists',()=>{
  const products = pages['/productos/'];
  for (const id of ['ctpatrol','nexa-visit','prepiq']) assert.match(products, new RegExp(`id="${id}"`));
  for (const name of ['ctpatrol-app-01','ctpatrol-app-02','ctpatrol-app-03','nexa-app-01','nexa-app-02','nexa-app-03','prepiq-app-01','prepiq-app-02','prepiq-app-03']) {
    assert.match(products, new RegExp(`/assets/${name}\\.webp`));
    assert.ok(asset(`/assets/${name}.webp`));
  }
  assert.match(products, /ctpatrol\.vortexlabai\.com/);
  assert.match(products, /nexa\.vortexlabai\.com/);
});

test('long videos carry a tag and can be filtered by topic',()=>{
  const videos = pages['/videos/'];
  assert.match(videos, /data-format="short"/);
  assert.match(videos, /data-tag="Noticias"/);
  assert.match(videos, /class="v-tag"/);
  assert.equal(tagFor({id:'aaaaaaaaaaa',title:'8 noticias de IA en 3 días'}), 'Noticias');
  assert.equal(tagFor({id:'XfkdES89S5E',title:'Preserved'}), 'Cine');
});

test('the "En corto" rail shows my reel covers and links them to TikTok',()=>{
  for (const page of [home, pages['/videos/']]) {
    const rail = page.slice(page.indexOf('data-shorts>'), page.indexOf('</ol>', page.indexOf('data-shorts>')));
    for (const r of reels) {
      assert.ok(rail.includes(r.image), `falta ${r.title}`);
      assert.ok(asset(r.image));
    }
    assert.match(rail, /href="https:\/\/www\.tiktok\.com\/@davidrochaia"/);
    assert.doesNotMatch(rail, /data-video=|oardefault|frame0/);
  }
  assert.doesNotMatch(home, /id="reels"/);
  assert.doesNotMatch(html, /tiktok-embed|tiktok\.com\/embed\.js/);
  assert.match(home, /data-instagram hidden/);
});

test('CTPatrol is shown in phone mockups in the newsroom, Vortex Lab and its product page',()=>{
  const mock = '/assets/ctpatrol-telefonos.webp';
  assert.ok(asset(mock));
  const stage = home.slice(home.indexOf('data-newsroom'), home.indexOf('class="b-proof"'));
  assert.ok(stage.includes(mock));
  assert.ok(home.slice(home.indexOf('id="vortex"')).includes(mock));
  assert.ok(pages['/productos/'].slice(pages['/productos/'].indexOf('id="ctpatrol"')).includes(mock));
});

test('mini books are placeholders that can be bought once a link is added',()=>{
  const mini = pages['/mini-libros/'];
  assert.equal(miniLibros.books.length, 3);
  assert.match(mini, /Próximamente/);
  assert.match(mini, /Avísame cuando salga/);
  assert.doesNotMatch(mini, /data-video=/, 'the books do not come from the current videos');
});

test('newsletter explains how it works and asks for the occupation',()=>{
  const nl = pages['/newsletter/'];
  assert.match(nl, /name="oficio"/);
  assert.match(nl, /name="email"/);
  assert.match(nl, /Qué pasó/);
  assert.match(nl, /Qué haría yo/);
  assert.ok(asset('/assets/newsletter-preview.svg'));
});

test('contact page has my photo, the options and WhatsApp',()=>{
  const contact = pages['/contacto/'];
  assert.match(contact, /david-rocha\.webp/);
  for (const o of contactOptions) assert.ok(contact.includes(`value="${o.key}"`));
  assert.match(contact, new RegExp(`data-whatsapp="${WHATSAPP_NUMBER}"`));
  assert.match(html, new RegExp(`wa\\.me/${WHATSAPP_NUMBER}`));
});

test('AI development (Vortex Lab) always comes before film (Gallos Media)',()=>{
  assert.ok(home.indexOf('id="vortex"') < home.indexOf('id="gallos"'));
  const work = pages['/lo-que-hago/'];
  assert.ok(work.indexOf('data-pf="Agentes de IA"') < work.indexOf('data-pf="Producciones"'));
  const stage = home.slice(home.indexOf('data-newsroom'), home.indexOf('id="vortex"'));
  assert.ok(stage.indexOf('ctpatrol') < stage.indexOf('XfkdES89S5E'), 'productos antes que cine en el noticiero');
  assert.match(home, /Desarrollo e implemento inteligencia artificial en empresas/);
  assert.equal(contactOptions[0].key, 'software');
});

test('agents are presented as a service, without counting or listing them (that lives in Vortex Lab)',()=>{
  for (const page of [home, pages['/productos/']]) {
    assert.match(page, /Implementación de agentes de IA/);
    assert.match(page, /https:\/\/vortexlabai\.com\/agentes/);
    assert.doesNotMatch(page, /[Oo]cho agentes|8 agentes|Ocho especialistas|contratar-|Clasificación arancelaria|Agente Custom|MXN al mes/);
  }
});

test('films are sold as "producciones cinematográficas con IA"; Gallos Media is only a small credit',()=>{
  const section = home.slice(home.indexOf('id="gallos"'), home.indexOf('</section>', home.indexOf('id="gallos"')));
  assert.match(section, /<h2>Producciones cinematográficas con IA<\/h2>/);
  assert.doesNotMatch(section, /<h2>Gallos Media/);
  assert.match(section, /class="sc-credit">Producido en <a[^>]*gallosmedia\.com/);
  const stage = home.slice(home.indexOf('data-newsroom'), home.indexOf('id="vortex"'));
  assert.doesNotMatch(stage, /Gallos Media/);
});

test('the header rotates without arrows or pause button and shows reels two by two in phones',()=>{
  const stage = home.slice(home.indexOf('data-newsroom'), home.indexOf('id="vortex"'));
  assert.doesNotMatch(stage, /data-step|data-pause/);
  assert.match(stage, /data-news-count/);
  const phoneSlides = stage.split('data-slide').filter(part => part.includes('class="n-media is-phones"'));
  assert.equal(phoneSlides.length, Math.ceil(reels.length / 2));
  for (const r of reels) assert.ok(stage.includes(r.image), `falta ${r.title}`);
});

test('NEXA VISIT and PrepIQ are shown in computer and iPad mockups',()=>{
  for (const name of ['nexa-dispositivos','prepiq-dispositivos']) {
    assert.ok(asset(`/assets/${name}.webp`));
    assert.ok(home.includes(`/assets/${name}.webp`));
    assert.ok(pages['/productos/'].includes(`/assets/${name}.webp`));
  }
});

test('"Lo que he hecho" is a portfolio by type of work, not split by company',()=>{
  const work = pages['/lo-que-hago/'];
  for (const t of portfolio.types) assert.ok(work.includes(`data-pf-filter="${t}"`));
  for (const it of portfolio.items) {
    assert.ok(work.includes(it.image), `falta ${it.title}`);
    assert.ok(asset(it.image));
  }
  assert.doesNotMatch(work, /<h2>Gallos Media|<h2>Vortex Lab/);
});

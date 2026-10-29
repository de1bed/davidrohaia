import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {allPages,tagFor} from '../scripts/pages.mjs';
import {WHATSAPP_NUMBER,news,gallos,vortex,miniLibros,contactOptions} from '../scripts/content.mjs';

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
  assert.match(home, /Gallos Media es mi productora/);
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

test('videos carry a tag, shorts use the vertical cover, Preserved chapters are grouped',()=>{
  const videos = pages['/videos/'];
  assert.match(videos, /data-format="short"/);
  assert.match(videos, /data-tag="Noticias"/);
  assert.match(videos, /class="v-tag"/);
  assert.match(videos, /oardefault\.jpg/);
  assert.match(videos, /Preserved, contada en capítulos/);
  assert.equal(tagFor({id:'aaaaaaaaaaa',title:'8 noticias de IA en 3 días'}), 'Noticias');
  assert.equal(tagFor({id:'XfkdES89S5E',title:'Preserved'}), 'Cine');
});

test('social section has the TikTok creator embed and an Instagram slot with a profile fallback',()=>{
  assert.match(home, /class="tiktok-embed"[^>]*data-unique-id="davidrochaia"[^>]*data-embed-type="creator"/);
  assert.doesNotMatch(home, /<script[^>]+tiktok\.com\/embed\.js/);
  assert.match(home, /data-instagram hidden/);
  assert.match(home, /data-instagram-fallback/);
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

import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {allPages} from '../scripts/pages.mjs';
import {WHATSAPP_NUMBER} from '../scripts/content.mjs';

const pages = allPages();
const html = Object.values(pages).join('\n');
const home = pages['/'];

test('the story is four pages and the old catalog is gone',()=>{
  assert.deepEqual(Object.keys(pages).sort(), ['/','/mini-libros/','/newsletter/','/videos/']);
  assert.equal(pages['/biblioteca/'], undefined);
  assert.doesNotMatch(html, /biblioteca|CimaWash|MexPads|MaxPads|Órbita|Orbita|Treve|Crisosa|Trebot|Delfos|ORO24|Señal IA|cientos de fuentes|usado por equipos|5 productos/i);
  assert.doesNotMatch(html, /david-neon|gallos-luna|gallos-vortex|nexa-visitor|Cine con IA|data-format="film"/);
});

test('reading the home page tells the four ways David helps',()=>{
  assert.match(home, /Gallos Media/);
  assert.match(home, /gallosmedia\.com/);
  assert.match(home, /Lunáticos TV/);
  assert.match(home, /potenciando ese trabajo con inteligencia artificial/);
  assert.match(home, /vortexlabai\.com/);
  assert.match(home, /trámites del SAT/);
  assert.match(home, /CTPatrol/);
  assert.match(home, /ctpatrol\.vortexlabai\.com/);
  assert.match(home, /NEXA VISIT/);
  assert.match(home, /nexa\.vortexlabai\.com/);
  assert.match(home, /PrepIQ ya está listo/);
  assert.match(home, /producto de IA para restaurantes/);
  assert.match(home, /diseña esa página/);
  assert.match(home, /Mini libros/);
  assert.match(home, /name="oficio"/);
  assert.match(home, /name="email"/);
  assert.match(home, new RegExp(`wa\\.me/${WHATSAPP_NUMBER}`));
  assert.equal(WHATSAPP_NUMBER, '520000000000');
});

test('product shots are the real app captures, not the login screen',()=>{
  for (const name of ['ctpatrol-app-01','ctpatrol-app-02','ctpatrol-app-03','nexa-app-01','nexa-app-02','nexa-app-03','prepiq-app-01','prepiq-app-02','prepiq-app-03','gallos-home','vortex-home']) {
    assert.match(home, new RegExp(`/assets/${name}\\.webp`));
    assert.equal(existsSync(new URL(`../public/assets/${name}.webp`, import.meta.url)), true);
  }
  assert.doesNotMatch(html, /ctpatrol-home|login/);
});

test('videos are not stuck on a hardcoded film filter',()=>{
  const videos = pages['/videos/'];
  assert.match(videos, /data-format="all"/);
  assert.match(videos, /data-format="video"/);
  assert.match(videos, /data-format="short"/);
  assert.doesNotMatch(videos, /data-format="film"/);
  assert.match(videos, /Preserved, contada en capítulos/);
  assert.match(home, /data-video=/);
  assert.doesNotMatch(home, /david-rocha-portrait|david-neon/);
});

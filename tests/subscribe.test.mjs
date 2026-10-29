import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {createSubscribeHandler,providerFrom} from '../worker/subscribe-handler.mjs';

async function withServer(options,run) {
  const server=createServer(createSubscribeHandler(options));
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  try {await run(`http://127.0.0.1:${server.address().port}`);}
  finally {await new Promise(resolve=>server.close(resolve));}
}
const post=(url,body)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

test('provider is chosen from environment variables',()=>{
  assert.equal(providerFrom({}),null);
  assert.equal(providerFrom({BEEHIIV_API_KEY:'k'}),null);
  assert.equal(providerFrom({BEEHIIV_API_KEY:'k',BEEHIIV_PUBLICATION_ID:'pub_1'}),'beehiiv');
  assert.equal(providerFrom({BUTTONDOWN_API_KEY:'k'}),'buttondown');
});

test('without a provider the endpoint asks the page to use the email fallback',async()=>{
  await withServer({env:{},fetchImpl:()=>assert.fail('No provider must be called')},async(url)=>{
    const response=await post(url,{email:'ana@empresa.mx'});
    assert.equal(response.status,503);
    assert.equal((await response.json()).error,'not_configured');
  });
});

test('invalid emails, other methods and bots never reach the provider',async()=>{
  await withServer({env:{BUTTONDOWN_API_KEY:'k'},fetchImpl:()=>assert.fail('Provider must not be called')},async(url)=>{
    assert.equal((await post(url,{email:'no-es-correo'})).status,400);
    assert.equal((await fetch(url,{method:'POST',body:'{'})).status,400);
    const get=await fetch(url);
    assert.equal(get.status,405);
    assert.equal(get.headers.get('allow'),'POST');
    assert.equal((await post(url,{email:'bot@spam.com',company:'x'})).status,200);
  });
});

test('Beehiiv receives the normalized email with the key and publication',async()=>{
  const calls=[];
  const fetchImpl=async(target,init)=>{calls.push([target,init]);return new Response('{}',{status:201});};
  await withServer({env:{BEEHIIV_API_KEY:'secret',BEEHIIV_PUBLICATION_ID:'pub_1'},fetchImpl},async(url)=>{
    const response=await post(url,{email:'  Ana@Empresa.MX ',source:'hero'});
    assert.equal(response.status,200);
    assert.equal((await response.json()).ok,true);
  });
  assert.equal(calls.length,1);
  assert.equal(calls[0][0],'https://api.beehiiv.com/v2/publications/pub_1/subscriptions');
  assert.equal(calls[0][1].headers.Authorization,'Bearer secret');
  const sent=JSON.parse(calls[0][1].body);
  assert.equal(sent.email,'ana@empresa.mx');
  assert.equal(sent.utm_medium,'hero');
});

test('occupation travels with the subscriber and an oversized one is rejected',async()=>{
  const calls=[];
  const fetchImpl=async(target,init)=>{calls.push([target,init]);return new Response('{}',{status:201});};
  await withServer({env:{BEEHIIV_API_KEY:'secret',BEEHIIV_PUBLICATION_ID:'pub_1'},fetchImpl},async(url)=>{
    assert.equal((await post(url,{email:'ana@empresa.mx',oficio:'  Opero un restaurante  '})).status,200);
    assert.equal((await post(url,{email:'ana@empresa.mx',oficio:'x'.repeat(81)})).status,400);
  });
  assert.equal(calls.length,1);
  assert.equal(JSON.parse(calls[0][1].body).utm_content,'Opero un restaurante');
  calls.length=0;
  const down=[];
  await withServer({env:{BUTTONDOWN_API_KEY:'k'},fetchImpl:async(target,init)=>{down.push(JSON.parse(init.body));return new Response('{}',{status:201});}},async(url)=>{
    assert.equal((await post(url,{email:'ana@empresa.mx',oficio:'Dirijo una planta'})).status,200);
  });
  assert.equal(down[0].notes,'Dirijo una planta');
});

test('Buttondown duplicates count as success and outages report a failure',async()=>{
  let reply=()=>new Response('{"code":"email_already_exists","detail":"already subscribed"}',{status:400});
  await withServer({env:{BUTTONDOWN_API_KEY:'k'},fetchImpl:async()=>reply()},async(url)=>{
    assert.equal((await post(url,{email:'ana@empresa.mx'})).status,200);
    reply=()=>new Response('down',{status:500});
    assert.equal((await post(url,{email:'ana@empresa.mx'})).status,502);
    reply=()=>{throw new Error('network');};
    assert.equal((await post(url,{email:'ana@empresa.mx'})).status,502);
  });
});

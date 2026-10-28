import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {createYouTubeHandler} from '../worker/youtube-handler.mjs';

async function withServer(load,run) {
  const fallback=[{id:'idNfU7ePvRU',title:'Saved video'}];
  const server=createServer(createYouTubeHandler({load,fallback,channelId:'channel'}));
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  try {await run(`http://127.0.0.1:${server.address().port}`,fallback);}
  finally {await new Promise(resolve=>server.close(resolve));}
}

test('Vercel endpoint returns live JSON and short shared-cache headers',async()=>{
  await withServer(async(fallback,channelId)=>{
    assert.equal(channelId,'channel');
    return {videos:fallback,stale:false,source:'youtube-channel'};
  },async(url)=>{
    const response=await fetch(url);
    assert.equal(response.status,200);
    assert.match(response.headers.get('content-type'),/application\/json/);
    assert.match(response.headers.get('cache-control'),/s-maxage=60/);
    assert.equal((await response.json()).source,'youtube-channel');
  });
});

test('upstream failures return an explicit fallback that expires sooner',async()=>{
  await withServer(async()=>{throw new Error('Upstream unavailable');},async(url,fallback)=>{
    const response=await fetch(url);
    const data=await response.json();
    assert.equal(response.status,200);
    assert.equal(data.stale,true);
    assert.equal(data.source,'snapshot');
    assert.deepEqual(data.videos,fallback);
    assert.match(response.headers.get('cache-control'),/s-maxage=15/);
  });
});

test('unsupported methods and HEAD do not call YouTube',async()=>{
  await withServer(()=>{assert.fail('Upstream must not be called');},async(url)=>{
    const post=await fetch(url,{method:'POST'});
    assert.equal(post.status,405);
    assert.equal(post.headers.get('allow'),'GET, HEAD');
    const head=await fetch(url,{method:'HEAD'});
    assert.equal(head.status,200);
    assert.equal(await head.text(),'');
  });
});

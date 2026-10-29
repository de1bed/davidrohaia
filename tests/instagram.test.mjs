import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {createInstagramHandler,shapePosts} from '../worker/instagram-handler.mjs';

async function withServer(options,run) {
  const server=createServer(createInstagramHandler(options));
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  try {await run(`http://127.0.0.1:${server.address().port}`);}
  finally {await new Promise(resolve=>server.close(resolve));}
}

test('without a token the page is told to show the profile link',async()=>{
  await withServer({env:{},fetchImpl:()=>assert.fail('Instagram must not be called')},async(url)=>{
    const data=await (await fetch(url)).json();
    assert.deepEqual(data,{configured:false,posts:[]});
    assert.equal((await fetch(url,{method:'POST'})).status,405);
  });
});

test('posts keep only Instagram images and links, using the video cover for reels',()=>{
  const posts=shapePosts({data:[
    {id:'1',media_type:'VIDEO',thumbnail_url:'https://scontent.cdninstagram.com/a.jpg',media_url:'https://video.mp4',permalink:'https://www.instagram.com/reel/abc/',caption:'Primera línea\nsegunda'},
    {id:'2',media_type:'IMAGE',media_url:'https://evil.example.com/x.jpg',permalink:'https://www.instagram.com/p/def/'},
    {id:'3',media_type:'IMAGE',media_url:'https://scontent.xx.fbcdn.net/b.jpg',permalink:'javascript:alert(1)'}
  ]});
  assert.equal(posts.length,1);
  assert.equal(posts[0].image,'https://scontent.cdninstagram.com/a.jpg');
  assert.equal(posts[0].caption,'Primera línea');
  assert.equal(posts[0].video,true);
});

test('with a token the latest posts are fetched and failures degrade quietly',async()=>{
  const calls=[];
  let ok=true;
  const fetchImpl=async(target)=>{calls.push(target);if(!ok)throw new Error('down');return Response.json({data:[{id:'9',media_type:'IMAGE',media_url:'https://scontent.cdninstagram.com/c.jpg',permalink:'https://www.instagram.com/p/xyz/'}]});};
  await withServer({env:{INSTAGRAM_ACCESS_TOKEN:'tok'},fetchImpl},async(url)=>{
    const data=await (await fetch(url)).json();
    assert.equal(data.posts.length,1);
    assert.match(calls[0],/graph\.instagram\.com\/me\/media/);
    assert.match(calls[0],/access_token=tok/);
    ok=false;
    const fallback=await (await fetch(url)).json();
    assert.deepEqual(fallback.posts,[]);
    assert.equal(fallback.stale,true);
  });
});

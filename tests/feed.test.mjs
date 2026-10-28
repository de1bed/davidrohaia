import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,parseChannel,initialData,combineCatalog,recentVideos} from '../worker/feed.mjs';
test('parses and orders YouTube entries without trusting invalid IDs or dates',()=>{
 const xml=`<feed><entry><yt:videoId>4wwDfZezlQM</yt:videoId><title>A &amp; B</title><published>2026-10-19T03:07:00Z</published><link href="https://www.youtube.com/watch?v=4wwDfZezlQM"/></entry><entry><yt:videoId>sH3SfbTnh9s</yt:videoId><title>Noticias #Shorts</title><published>2026-10-24T01:02:36Z</published><link href="https://www.youtube.com/shorts/sH3SfbTnh9s"/></entry><entry><yt:videoId>bad/id</yt:videoId><title>Bad</title><published>not-a-date</published></entry></feed>`;
 const items=parseFeed(xml);assert.equal(items.length,2);assert.equal(items[0].id,'sH3SfbTnh9s');assert.equal(items[0].short,true);assert.equal(items[1].title,'A & B');assert.equal(items[1].short,false);
});
test('an empty upstream response produces no fabricated content',()=>assert.deepEqual(parseFeed('<feed></feed>'),[]));
test('reads current YouTube lockups and preserves custom thumbnail URLs',()=>{
 const data={contents:[{lockupViewModel:{contentId:'idNfU7ePvRU',metadata:{lockupMetadataViewModel:{title:{content:'Hinton: a new video'},metadata:{contentMetadataViewModel:{metadataRows:[{metadataParts:[{accessibilityLabel:'hace 2 horas'}]}]}}}},contentImage:{thumbnailViewModel:{image:{sources:[{url:'https://i.ytimg.com/vi/idNfU7ePvRU/hq720_custom_1.jpg'}]}}}}}]};
 const html='<script>var ytInitialData = '+JSON.stringify(data)+';</script>';
 const parsed=parseChannel(html);assert.equal(parsed.length,1);assert.equal(parsed[0].title,'Hinton: a new video');assert.match(parsed[0].image,/hq720_custom_1/);assert.equal(parsed[0].publishedLabel,'hace 2 horas');
});
test('extracts JSON without executing scripts, including braces inside titles',()=>{
 const data={title:'An idea { with } braces and "quotes"'};
 assert.deepEqual(initialData('<script>var ytInitialData = '+JSON.stringify(data)+';</script>'),data);
 assert.equal(initialData('<script>var ytInitialData = invalid;</script>'),null);
});
test('reads Shorts and deduplicates live catalog ahead of old fallback items',()=>{
 const shorts={contents:[{shortsLockupViewModel:{entityId:'shorts-shelf-item-SVRzlfCbcS0',overlayMetadata:{primaryText:{content:'Siri en español'}},onTap:{innertubeCommand:{reelWatchEndpoint:{videoId:'SVRzlfCbcS0',thumbnail:{thumbnails:[{url:'https://i.ytimg.com/vi/SVRzlfCbcS0/frame0.jpg'}]}}}}}}]};
 const parsed=parseChannel('<script>var ytInitialData = '+JSON.stringify(shorts)+';</script>',true);
 assert.equal(parsed[0].short,true);assert.equal(parsed[0].id,'SVRzlfCbcS0');
 const merged=combineCatalog([{id:'idNfU7ePvRU',title:'New'}],parsed,[],[{id:'idNfU7ePvRU',title:'Old'}]);assert.equal(merged.length,2);assert.equal(merged[0].title,'New');
});
test('a broken RSS feed does not hide new videos available on the channel page',async()=>{
 const savedFetch=globalThis.fetch;
 const data={contents:[{videoRenderer:{videoId:'idNfU7ePvRU',title:{simpleText:'A new Hinton video'},thumbnail:{thumbnails:[{url:'https://i.ytimg.com/vi/idNfU7ePvRU/hqdefault.jpg'}]}}}]};
 globalThis.fetch=async url=>String(url).includes('/videos?')?new Response('<script>var ytInitialData = '+JSON.stringify(data)+';</script>'):new Response('Not found',{status:404});
 try{const result=await recentVideos([],'UC4MSDfKsvDTxbUDd9w7tavQ');assert.equal(result.stale,false);assert.equal(result.source,'youtube-channel');assert.equal(result.videos[0].id,'idNfU7ePvRU');}finally{globalThis.fetch=savedFetch;}
});

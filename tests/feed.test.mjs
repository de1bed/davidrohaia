import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed} from '../worker/feed.mjs';
test('parses and orders YouTube entries without trusting invalid IDs or dates',()=>{
 const xml=`<feed><entry><yt:videoId>4wwDfZezlQM</yt:videoId><title>A &amp; B</title><published>2026-10-19T03:07:00Z</published><link href="https://www.youtube.com/watch?v=4wwDfZezlQM"/></entry><entry><yt:videoId>sH3SfbTnh9s</yt:videoId><title>Noticias #Shorts</title><published>2026-10-24T01:02:36Z</published><link href="https://www.youtube.com/shorts/sH3SfbTnh9s"/></entry><entry><yt:videoId>bad/id</yt:videoId><title>Bad</title><published>not-a-date</published></entry></feed>`;
 const items=parseFeed(xml);assert.equal(items.length,2);assert.equal(items[0].id,'sH3SfbTnh9s');assert.equal(items[0].short,true);assert.equal(items[1].title,'A & B');assert.equal(items[1].short,false);
});
test('an empty upstream response produces no fabricated content',()=>assert.deepEqual(parseFeed('<feed></feed>'),[]));

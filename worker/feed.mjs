export function decodeXml(value='') {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const code=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return code>=0&&code<=0x10ffff?String.fromCodePoint(code):'';}).replace(/&(amp|lt|gt|quot|apos);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[n]));
}
export function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([,entry])=>{
    const get=tag=>decodeXml(entry.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]||'').trim();
    const id=get('yt:videoId');
    const published=get('published');
    if(!/^[a-zA-Z0-9_-]{11}$/.test(id)||!get('title')||!Number.isFinite(Date.parse(published)))return null;
    return {id,title:get('title'),published,short:/href="https:\/\/www\.youtube\.com\/shorts\//.test(entry)||/#shorts/i.test(get('title')),image:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`};
  }).filter(Boolean).sort((a,b)=>Date.parse(b.published)-Date.parse(a.published)).slice(0,15);
}
export function initialData(html) {
  const marker=/(?:var\s+ytInitialData\s*=|window\["ytInitialData"\]\s*=)\s*/g.exec(html);
  if(!marker)return null;
  const start=marker.index+marker[0].length;
  let depth=0,quoted=false,escaped=false;
  for(let i=start;i<html.length;i++){
    const ch=html[i];
    if(quoted){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')quoted=false;continue;}
    if(ch==='"'){quoted=true;continue;}
    if(ch==='{')depth++;
    if(ch==='}'&&--depth===0){try{return JSON.parse(html.slice(start,i+1));}catch{return null;}}
  }
  return null;
}
export function parseChannel(html,short=false) {
  const data=initialData(html);if(!data)return [];
  const items=new Map();
  const text=value=>value?.content||value?.simpleText||value?.runs?.map(x=>x.text).join('')||'';
  const image=value=>{try{const u=new URL(value);return u.protocol==='https:'&&/(^|\.)ytimg\.com$/.test(u.hostname)?u.href:'';}catch{return '';}};
  function add(item){if(/^[a-zA-Z0-9_-]{11}$/.test(item.id||'')&&item.title&&item.image&&!items.has(item.id))items.set(item.id,item);}
  function walk(node){
    if(!node||typeof node!=='object')return;
    if(node.lockupViewModel){
      const v=node.lockupViewModel,m=v.metadata?.lockupMetadataViewModel;
      const sources=v.contentImage?.thumbnailViewModel?.image?.sources||[];
      const parts=m?.metadata?.contentMetadataViewModel?.metadataRows?.flatMap(r=>r.metadataParts||[])||[];
      const publishedLabel=parts.map(p=>p.accessibilityLabel||text(p.text)).find(t=>/ago|hace|streamed|emitido/i.test(t))||'';
      add({id:v.contentId,title:text(m?.title),image:image(sources.at(-1)?.url),short,publishedLabel});
      return;
    }
    if(node.videoRenderer){const v=node.videoRenderer;add({id:v.videoId,title:text(v.title),image:image(v.thumbnail?.thumbnails?.at(-1)?.url),short,publishedLabel:text(v.publishedTimeText)});return;}
    if(node.shortsLockupViewModel){
      const v=node.shortsLockupViewModel;
      const endpoint=v.onTap?.innertubeCommand?.reelWatchEndpoint;
      const id=endpoint?.videoId||v.entityId?.replace('shorts-shelf-item-','');
      const sources=v.thumbnail?.sources||endpoint?.thumbnail?.thumbnails||[];
      add({id,title:text(v.overlayMetadata?.primaryText),image:image(sources.at(-1)?.url)||`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,short:true});return;
    }
    for(const child of Object.values(node))if(typeof child==='object')walk(child);
  }
  walk(data);return [...items.values()];
}
export function combineCatalog(longVideos,shorts,rss=[],fallback=[]) {
  const exact=new Map(rss.map(v=>[v.id,v]));
  const unique=new Map();
  for(const v of [...longVideos,...shorts]){
    if(unique.has(v.id))continue;
    const date=exact.get(v.id)?.published;
    unique.set(v.id,{...v,...(date?{published:date}:{}),kind:v.short?'short':'video'});
  }
  for(const v of [...rss,...fallback])if(!unique.has(v.id))unique.set(v.id,{...v,kind:v.short?'short':'video'});
  return [...unique.values()].slice(0,120);
}
let cached;
let inFlight;
export async function recentVideos(fallback,channelId) {
  if(cached&&cached.until>Date.now())return cached.payload;
  if(inFlight)return inFlight;
  inFlight=(async()=>{
    const headers={'Accept-Language':'es-MX,es;q=0.9','User-Agent':'Mozilla/5.0'};
    const base=`https://www.youtube.com/channel/${channelId}`;
    const endpoints=[`${base}/videos?hl=es`,`${base}/shorts?hl=es`,`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`];
    const responses=await Promise.allSettled(endpoints.map(async url=>{
      const r=await fetch(url,{headers,signal:AbortSignal.timeout(10000)});
      if(!r.ok)throw new Error(`Upstream ${r.status}`);
      return r.text();
    }));
    const long=responses[0].status==='fulfilled'?parseChannel(responses[0].value):[];
    const shorts=responses[1].status==='fulfilled'?parseChannel(responses[1].value,true):[];
    const rss=responses[2].status==='fulfilled'?parseFeed(responses[2].value):[];
    const live=long.length+shorts.length+rss.length>0;
    let payload;
    if(live){
      const items=combineCatalog(long,shorts,rss,fallback);
      payload={videos:items,source:long.length||shorts.length?'youtube-channel':'youtube-rss',stale:false,checkedAt:new Date().toISOString(),counts:{videos:items.filter(v=>!v.short).length,shorts:items.filter(v=>v.short).length},partial:!long.length||!shorts.length};
    }else{
      payload={...(cached?.payload||{videos:fallback}),source:'snapshot',stale:true,checkedAt:cached?.payload?.checkedAt||null,message:'YouTube no respondió. Mostramos la última copia disponible.'};
    }
    cached={until:Date.now()+(live?120000:30000),payload};return payload;
  })().finally(()=>{inFlight=undefined;});
  return inFlight;
}

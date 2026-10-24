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
let cached;
let inFlight;
export async function recentVideos(fallback,channelId) {
  if(cached&&cached.until>Date.now())return cached.payload;
  if(inFlight)return inFlight;
  inFlight=(async()=>{
    try{
      const response=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,{headers:{Accept:'application/atom+xml'},signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error('Feed unavailable');
      const items=parseFeed(await response.text());
      if(!items.length)throw new Error('Empty feed');
      const payload={videos:items,source:'youtube',checkedAt:new Date().toISOString()};
      cached={until:Date.now()+15*60*1000,payload};
      return payload;
    }catch{
      const payload=cached?.payload||{videos:fallback,source:'snapshot'};
      cached={until:Date.now()+60*1000,payload};
      return payload;
    }finally{inFlight=undefined;}
  })();
  return inFlight;
}

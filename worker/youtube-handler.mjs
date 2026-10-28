// Node HTTP interface shared by Vercel Functions and the local preview.
export function createYouTubeHandler({load,fallback,channelId}) {
  return async function youtube(req,res) {
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options','nosniff');
    if(req.method!=='GET'&&req.method!=='HEAD') {
      res.statusCode=405;
      res.setHeader('Allow','GET, HEAD');
      res.setHeader('Cache-Control','no-store');
      res.end(JSON.stringify({error:'Method not allowed'}));
      return;
    }
    if(req.method==='HEAD') {
      res.statusCode=200;
      res.setHeader('Cache-Control','no-store');
      res.end();
      return;
    }
    let payload;
    try {
      payload=await load(fallback,channelId);
    } catch {
      payload={videos:fallback,source:'snapshot',stale:true,checkedAt:null,message:'YouTube no respondió. Mostramos la última copia disponible.'};
    }
    // Keep browsers revalidating; share short-lived live results at the CDN.
    const seconds=payload.stale?15:60;
    res.statusCode=200;
    res.setHeader('Cache-Control',`public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${seconds}`);
    res.end(JSON.stringify(payload));
  };
}

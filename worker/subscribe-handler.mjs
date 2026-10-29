// Newsletter sign-up shared by Vercel Functions and the local preview.
// Provider is chosen from environment variables; without one the endpoint answers 503
// and the page falls back to a pre-filled email so no subscriber is lost.
const emailPattern=/^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

export function providerFrom(env) {
  if(env.BEEHIIV_API_KEY&&env.BEEHIIV_PUBLICATION_ID)return 'beehiiv';
  if(env.BUTTONDOWN_API_KEY)return 'buttondown';
  return null;
}

async function readBody(req) {
  if(req.body&&typeof req.body==='object')return req.body;
  if(typeof req.body==='string')return JSON.parse(req.body||'{}');
  let raw='';
  for await(const chunk of req){raw+=chunk;if(raw.length>4096)throw new Error('Body too large');}
  return JSON.parse(raw||'{}');
}

async function send(provider,email,source,env,fetchImpl) {
  if(provider==='beehiiv') {
    const response=await fetchImpl(`https://api.beehiiv.com/v2/publications/${encodeURIComponent(env.BEEHIIV_PUBLICATION_ID)}/subscriptions`,{
      method:'POST',
      headers:{Authorization:`Bearer ${env.BEEHIIV_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({email,reactivate_existing:true,send_welcome_email:true,utm_source:'sitio-david-rocha',utm_medium:source}),
      signal:AbortSignal.timeout(8000)
    });
    return response.ok;
  }
  const response=await fetchImpl('https://api.buttondown.com/v1/subscribers',{
    method:'POST',
    headers:{Authorization:`Token ${env.BUTTONDOWN_API_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify({email_address:email,tags:['sitio',source]}),
    signal:AbortSignal.timeout(8000)
  });
  if(response.ok)return true;
  // An existing subscriber is a success for the visitor.
  return response.status===400&&/already/i.test(await response.text());
}

export function createSubscribeHandler({env=process.env,fetchImpl=fetch}={}) {
  return async function subscribe(req,res) {
    const reply=(status,payload)=>{
      res.statusCode=status;
      res.setHeader('Content-Type','application/json; charset=utf-8');
      res.setHeader('Cache-Control','no-store');
      res.setHeader('X-Content-Type-Options','nosniff');
      res.end(JSON.stringify(payload));
    };
    if(req.method!=='POST') {
      res.setHeader('Allow','POST');
      return reply(405,{error:'method_not_allowed'});
    }
    let body;
    try {body=await readBody(req);} catch {return reply(400,{error:'invalid_body'});}
    // Bots fill the hidden field; pretend success without contacting the provider.
    if(body.company)return reply(200,{ok:true});
    const email=String(body.email||'').trim().toLowerCase();
    if(email.length>254||!emailPattern.test(email))return reply(400,{error:'invalid_email'});
    const source=String(body.source||'sitio').replace(/[^\w-]/g,'').slice(0,32)||'sitio';
    const provider=providerFrom(env);
    if(!provider)return reply(503,{error:'not_configured'});
    try {
      if(await send(provider,email,source,env,fetchImpl))return reply(200,{ok:true});
    } catch {}
    return reply(502,{error:'provider_failed'});
  };
}

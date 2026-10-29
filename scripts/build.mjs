import {mkdirSync,readFileSync,readdirSync,writeFileSync,cpSync,statSync,rmSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {allPages} from './pages.mjs';
import {videos,channelId} from './content.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const vercel=process.argv.includes('--target=vercel');
const assets={};
let assetCount=0;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
function record(url,bytes,type){assetCount++;if(!vercel)assets[url]={type,body:bytes.toString('base64')};}
function copyTree(dir,prefix=''){
 for(const name of readdirSync(dir)){
  const source=path.join(dir,name);const url=`${prefix}/${name}`;
  if(statSync(source).isDirectory()){copyTree(source,url);continue;}
  const bytes=readFileSync(source);record(url,bytes,mime[path.extname(name)]||'application/octet-stream');
  const target=path.join(out,url);mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,bytes);
 }
}
// Only remove the generated directory inside this project, including old hosting bundles.
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw new Error('Invalid build output path');
rmSync(out,{recursive:true,force:true});
mkdirSync(out,{recursive:true});copyTree(path.join(root,'public'));
const pages=allPages();
for(const [url,html]of Object.entries(pages)){
 record(url,Buffer.from(html),'text/html; charset=utf-8');
 const target=path.join(out,url,'index.html');mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,html);
}
if(!vercel){
const feed=readFileSync(path.join(root,'worker','feed.mjs'),'utf8').replace(/^export /gm,'');
const worker=`${feed}\nconst files=${JSON.stringify(assets)};\nconst fallback=${JSON.stringify(videos)};\nexport default{async fetch(request,env,ctx){const url=new URL(request.url);if(url.pathname==='/api/youtube'){if(request.method!=='GET')return new Response('Method not allowed',{status:405,headers:{Allow:'GET'}});return Response.json(await recentVideos(fallback,${JSON.stringify(channelId)}),{headers:{'cache-control':'public, max-age=60','x-content-type-options':'nosniff'}});}if(url.pathname==='/api/subscribe')return Response.json({error:'not_configured'},{status:503,headers:{'cache-control':'no-store'}});if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});const key=url.pathname.replace(/index\\.html$/,'');if(!key.endsWith('/')&&!key.includes('.')){const next=new URL(request.url);next.pathname+='/';return Response.redirect(next.href,308);}const file=files[key];if(!file)return new Response('Página no encontrada',{status:404,headers:{'content-type':'text/plain; charset=utf-8'}});const data=request.method==='HEAD'?null:Uint8Array.from(atob(file.body),c=>c.charCodeAt(0));return new Response(data,{headers:{'content-type':file.type,'cache-control':key.startsWith('/assets/')?'public, max-age=86400':'public, max-age=60','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin'}});}};`;
mkdirSync(path.join(out,'server'),{recursive:true});writeFileSync(path.join(out,'server','index.js'),worker);
mkdirSync(path.join(out,'.openai'),{recursive:true});cpSync(path.join(root,'.openai','hosting.json'),path.join(out,'.openai','hosting.json'));
}
console.log(`Built ${Object.keys(pages).length} pages and ${assetCount} files for ${vercel?'Vercel CDN + api/youtube.js':'Sites Worker'}.`);

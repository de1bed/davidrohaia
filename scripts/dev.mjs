import {createServer} from 'node:http';
import {recentVideos} from '../worker/feed.mjs';
import {channelId,videos} from './content.mjs';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/youtube'){res.setHeader('content-type','application/json');res.end(JSON.stringify(await recentVideos(videos,channelId)));return;}
  let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}
  const info=await stat(file);if(info.isDirectory())file=path.join(file,'index.html');
  res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');
  res.end(await readFile(file));
 }catch{res.writeHead(404);res.end('Página no encontrada');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173/'));

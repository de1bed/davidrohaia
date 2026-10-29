import {mkdirSync,readFileSync,readdirSync,writeFileSync,statSync,rmSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {allPages} from './pages.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const vercel=process.argv.includes('--target=vercel');
let assetCount=0;
function record(){assetCount++;}
function copyTree(dir,prefix=''){
 for(const name of readdirSync(dir)){
  const source=path.join(dir,name);const url=`${prefix}/${name}`;
  if(statSync(source).isDirectory()){copyTree(source,url);continue;}
  const bytes=readFileSync(source);record();
  const target=path.join(out,url);mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,bytes);
 }
}
// Only remove the generated directory inside this project, including old hosting bundles.
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw new Error('Invalid build output path');
rmSync(out,{recursive:true,force:true});
mkdirSync(out,{recursive:true});copyTree(path.join(root,'public'));
const pages=allPages();
for(const [url,html]of Object.entries(pages)){
 record();
 const target=path.join(out,url,'index.html');mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,html);
}
console.log(`Built ${Object.keys(pages).length} pages and ${assetCount} files${vercel?' for Vercel':''}.`);

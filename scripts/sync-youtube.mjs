import {writeFile} from 'node:fs/promises';
import {recentVideos} from '../worker/feed.mjs';
const data=await recentVideos([],'UC4MSDfKsvDTxbUDd9w7tavQ');
if(data.stale||!data.videos.length)throw new Error('YouTube no respondió; se conserva el catálogo guardado.');
await writeFile(new URL('./youtube-snapshot.mjs',import.meta.url),`// Generated from the public channel. No account data or credentials.\nexport default ${JSON.stringify(data,null,2)};\n`);
console.log(JSON.stringify({source:data.source,count:data.videos.length,latest:data.videos[0].title}));

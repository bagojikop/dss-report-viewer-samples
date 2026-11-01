import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {SITE} from '../src/app/site-info.ts';
import {SEO_PAGES,PRERENDER_PATHS} from '../src/app/site-pages.ts';

const webRoot=fileURLToPath(new URL('../',import.meta.url));
const workspace=JSON.parse(await readFile(resolve(webRoot,'angular.json'),'utf8'));
const project=Object.keys(workspace.projects).find(name=>workspace.projects[name].projectType==='application');
const output=resolve(webRoot,'dist',project,'browser');
const routes=await readFile(resolve(webRoot,'src/app/app.routes.ts'),'utf8');
const paths=[...new Set([...routes.matchAll(/path\s*:\s*['"]([^'"]*)['"]/g)].map(match=>'/'+match[1]))]
 .filter(path=>path!=='/'&&!path.includes('*')&&!path.includes(':')&&!SEO_PAGES[path]?.noindex);
const canonical=path=>SITE.reportingUrl+path+(PRERENDER_PATHS.includes(path)?'/':'');
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+paths.map(path=>'  <url><loc>'+canonical(path)+'</loc></url>').join('\n')+'\n</urlset>\n';
const robots='User-agent: *\nAllow: /\n\nSitemap: '+SITE.reportingUrl+'/sitemap.xml\n';
for(const destination of [resolve(webRoot,'public'),output]){
 await mkdir(destination,{recursive:true});
 await writeFile(resolve(destination,'robots.txt'),robots);
 await writeFile(resolve(destination,'sitemap.xml'),sitemap);
}
console.log(`Generated robots.txt and sitemap.xml for ${paths.length} public routes.`);

import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {existsSync} from 'node:fs';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {resolve,sep,extname,basename} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {PRERENDER_PATHS} from '../src/app/site-pages.ts';

const webRoot=fileURLToPath(new URL('../',import.meta.url));
const workspace=JSON.parse(await readFile(resolve(webRoot,'angular.json'),'utf8'));
const project=Object.keys(workspace.projects).find(name=>workspace.projects[name].projectType==='application');
const output=resolve(webRoot,'dist',project,'browser');
const shell=await readFile(resolve(output,'index.html'),'utf8');
const candidates=[process.env.DSS_PRERENDER_BROWSER,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const browserPath=candidates.find(path=>existsSync(path));
if(!browserPath)throw new Error('A Chromium browser is required to pre-render public pages. Set DSS_PRERENDER_BROWSER to its executable path.');
const profile=await mkdtemp(resolve(tmpdir(),'dss-seo-'));
const card='<!doctype html><html lang="en"><meta charset="utf-8"><title>DSS Reporting</title><style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#101e35;color:white;font:20px Arial,sans-serif;padding:64px 72px}.brand{color:#a5beff;font-size:21px;letter-spacing:3px;margin-bottom:50px}h1{font-size:68px;line-height:1.08;letter-spacing:-2px;margin:0 0 24px}.accent{color:#9bbcff}p{font-size:25px;color:#c1d0e9;line-height:1.5;max-width:900px}.tags{display:flex;gap:14px;margin-top:34px}.tags span{padding:9px 15px;border:1px solid #476494;border-radius:8px;color:#c9d9f5;font-size:18px}.footer{margin-top:37px;font-size:18px;color:#9fb5d6}</style><body><div class="brand">DSS REPORTING</div><h1>Free reporting for<br><span class="accent">.NET and Angular.</span></h1><p>RDL / RDLC templates. JSON and SQL datasets.<br>PDF, Word and Excel exports. Developer guides.</p><div class="tags"><span>ASP.NET Core</span><span>Angular viewer</span><span>Free to use*</span></div><div class="footer">rdlreports.dsserp.in &nbsp; | &nbsp; dsserp.com &nbsp; | &nbsp; *Proprietary package license</div></body></html>';
const server=createServer(async(request,response)=>{
 try{
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if(pathname==='/__seo-card'){response.setHeader('Content-Type','text/html');response.end(card);return;}
  if(pathname==='/'||!extname(pathname)){
   response.setHeader('Content-Type','text/html');response.end(shell);return;
  }
  const file=resolve(output,'.'+pathname);
  if(!file.startsWith(output+sep)){response.writeHead(403).end();return;}
  const content=await readFile(file);
  response.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'}[extname(file)]??'application/octet-stream');
  response.end(content);
 }catch{response.writeHead(404).end();}
});
let browser,socket,send;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(check,message){for(let i=0;i<200;i++){try{const value=await check();if(value)return value;}catch{}await sleep(100);}throw new Error(message);}
try{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const origin='http://127.0.0.1:'+server.address().port;
 browser=spawn(browserPath,['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-gpu','about:blank'],{windowsHide:true,stdio:'ignore'});
 const debugPort=await until(async()=>Number((await readFile(resolve(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]),'SEO browser did not start.');
 const target=await until(async()=>{const targets=await(await fetch(`http://127.0.0.1:${debugPort}/json`)).json();return targets.find(item=>item.type==='page');},'SEO browser page unavailable.');
 socket=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 let id=0;const pending=new Map();
 socket.onmessage=event=>{const result=JSON.parse(event.data);if(!result.id)return;const request=pending.get(result.id);pending.delete(result.id);if(result.error)request.reject(result.error);else request.resolve(result.result);};
 send=(method,params={})=>new Promise((resolve,reject)=>{const request=++id;pending.set(request,{resolve,reject});socket.send(JSON.stringify({id:request,method,params}));});
 const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;};
 await send('Page.enable');await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1366,height:1000,deviceScaleFactor:1,mobile:false});
 for(const path of PRERENDER_PATHS){
  await send('Page.navigate',{url:origin+path+'/'});
  await until(()=>evaluate(`document.documentElement.dataset.dssReady==='true' && !!document.querySelector('app-root h1') && !!document.querySelector('link[rel="canonical"]') && !document.querySelector('.api-loading')`),'Could not pre-render '+path);
  await sleep(100);
  const html=await evaluate(`'<!doctype html>\\n'+document.documentElement.outerHTML.replace(' data-dss-ready="true"','')`);
  const folder=resolve(output,'.'+path);
  if(!folder.startsWith(output+sep))throw new Error('Invalid pre-render path.');
  await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'index.html'),html.replace('<!doctype html>\\n','<!doctype html>\n'));
  if(path==='/docs/getting-started')await writeFile(resolve(output,'index.html'),html.replace('<!doctype html>\\n','<!doctype html>\n'));
  console.log('Pre-rendered '+path+'/');
 }
 await send('Emulation.setDeviceMetricsOverride',{width:1200,height:630,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:origin+'/__seo-card'});
 await until(()=>evaluate(`document.title==='DSS Reporting' && !!document.querySelector('.brand')`),'Could not render social preview.');
 const shot=await send('Page.captureScreenshot',{format:'png'});
 for(const folder of [resolve(webRoot,'public/assets'),resolve(output,'assets')]){await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'dss-reporting-social.png'),Buffer.from(shot.data,'base64'));}
 console.log(`SEO complete: ${PRERENDER_PATHS.length} public pages, homepage HTML, and social preview.`);
}finally{
 if(send)await Promise.race([send('Browser.close').catch(()=>{}),sleep(1500)]);
 socket?.close();browser?.kill();server.close();await sleep(300);
 const resolved=resolve(profile);
 if(resolved.startsWith(resolve(tmpdir())+sep)&&basename(resolved).startsWith('dss-seo-'))await rm(resolved,{recursive:true,force:true,maxRetries:5,retryDelay:200});
}

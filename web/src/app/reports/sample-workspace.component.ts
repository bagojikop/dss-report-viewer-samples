import {Component,inject,ChangeDetectorRef} from '@angular/core';
import {Router,RouterOutlet,NavigationEnd} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
interface SourceEntry {path:string;kind:string;report?:string}
interface SourceFile {path:string;kind:string;content:string}
interface SourceCatalog {examples:Record<string,SourceEntry[]>;files:Record<string,SourceFile>}
@Component({
 selector:'app-sample-workspace',standalone:true,imports:[RouterOutlet,FormsModule],
 template:`
  @if(!isDocumentation){<div class="sample-bar" role="tablist" aria-label="Sample view">
   <button id="sample-preview-tab" role="tab" [attr.aria-selected]="view==='preview'" [attr.tabindex]="view==='preview'?0:-1" aria-controls="sample-preview" (click)="showPreview()" (keydown)="tabKey($event)">Preview</button>
   <button id="sample-code-tab" role="tab" [attr.aria-selected]="view==='code'" [attr.tabindex]="view==='code'?0:-1" aria-controls="sample-code" (click)="showCode()" (keydown)="tabKey($event)">&lt;&gt; Web</button>
   @for(tab of extraTabs;track tab.id){<button [id]="'sample-'+tab.id+'-tab'" role="tab" [attr.aria-selected]="view===tab.id" [attr.tabindex]="view===tab.id?0:-1" aria-controls="sample-code" (click)="showCode(tab.id)" (keydown)="tabKey($event)">{{tab.label}}</button>}
   <span class="sample-title">{{title}}</span>
  </div>}
  <div id="sample-preview" class="sample-preview" [attr.role]="isDocumentation?null:'tabpanel'" [attr.aria-labelledby]="isDocumentation?null:'sample-preview-tab'" [hidden]="!isDocumentation && view!=='preview'">
   <router-outlet (activate)="activeComponent=$event" />
  </div>
  <section id="sample-code" class="sample-code" role="tabpanel" [attr.aria-labelledby]="'sample-'+view+'-tab'" [hidden]="isDocumentation || view==='preview'" [attr.aria-busy]="loading">
   @if(loading){<p role="status">Loading sample source…</p>}
   @else if(error){<p role="alert">{{error}}</p><button (click)="showCode(view==='preview'?'code':view)">Retry</button>}
   @else {
    <p class="category-help">{{categoryHelp}}</p>
    <div class="source-toolbar">
     <label for="sample-source-file">Source file</label>
     <select id="sample-source-file" [(ngModel)]="selectedPath" (ngModelChange)="selectFile($event)">
      @for(kind of kinds;track kind){<optgroup [label]="kind">@for(entry of entries;track entry.path){@if(entry.kind===kind){<option [value]="entry.path">{{entry.path}}</option>}}</optgroup>}
     </select>
     <button (click)="copy()" [disabled]="!source">Copy</button>
     <button (click)="download()" [disabled]="!source">Download</button>
    </div>
    <div class="source-info"><span>{{source?.kind}} · {{lineCount}} lines</span><span role="status">{{message}}</span></div>
    <pre tabindex="0" aria-label="Sample source code"><code>{{source?.content}}</code></pre>
   }
  </section>
 `,
 styles:[`
 :host{display:flex;flex-direction:column;height:100%;min-width:0;--sample-preview-height:calc(100dvh - 94px);font:14px Arial,sans-serif;color:#334155}
 [hidden]{display:none!important}
 .sample-bar{height:52px;overflow-x:auto;flex-shrink:0;display:flex;align-items:center;gap:4px;padding:0 18px;background:white;border-bottom:1px solid #dce2ec;box-sizing:border-box}
 button{font:inherit;cursor:pointer;border:1px solid #cbd5e1;border-radius:6px;background:white;color:#334155;padding:8px 14px}
 .sample-bar button{flex-shrink:0;white-space:nowrap;height:100%;border:0;border-radius:0;border-bottom:3px solid transparent;background:transparent}
 .sample-bar button[aria-selected=true]{border-bottom-color:#4f46e5;color:#4338ca;font-weight:600}
 button:focus-visible,select:focus-visible,pre:focus-visible{outline:2px solid #6366f1;outline-offset:-2px}
 .sample-title{margin-left:auto;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 .sample-preview{flex:1;min-height:0;overflow:hidden}
 .sample-code{flex:1;min-height:0;display:flex;flex-direction:column;padding:18px;gap:12px;background:#f8fafc;box-sizing:border-box}
 .category-help{font-size:12px;color:#64748b;margin:0;line-height:1.6}
 .source-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
 select{flex:1;min-width:160px;max-width:100%;padding:9px;border:1px solid #cbd5e1;border-radius:6px;background:white;color:#334155;font:inherit}
 .source-info{display:flex;justify-content:space-between;gap:12px;color:#64748b;font-size:12px}
 pre{flex:1;min-height:0;margin:0;padding:20px;overflow:auto;background:#0f172a;color:#e2e8f0;border:1px solid #1e293b;border-radius:8px;tab-size:2;line-height:1.6;font-size:13px}
 code{font-family:Consolas,'Courier New',monospace}
 @media(max-width:600px){.sample-bar{padding:0 8px}.sample-title{display:none}.sample-code{padding:10px}.source-toolbar label{width:100%}}
 @media print{.sample-bar,.sample-code{display:none!important}.sample-preview{display:block!important;overflow:visible}:host{height:auto;display:block;--sample-preview-height:auto}}
 `]
})
export class SampleWorkspaceComponent {
 private router=inject(Router);
 private changes=inject(ChangeDetectorRef);
 view:'preview'|'code'|'data'|'sql'|'procedure'|'rdl'='preview';
 readonly extraTabs=[{id:'data',label:'Data'},{id:'sql',label:'SQL Script'},{id:'procedure',label:'Procedure'},{id:'rdl',label:'RDL'}] as const;
 title='';activeComponent:any;
 catalog?:SourceCatalog;allEntries:SourceEntry[]=[];selectedPath='';loading=false;error='';message='';
 readonly kinds=['Angular','RDL','JSON','Configuration','SQL','Procedure'];
 get entries(){return this.allEntries.filter(entry=>{
  const shared=entry.kind==='Configuration'||/\/(app\.config|report-api\.config)\.ts$/.test(entry.path);
  if(this.view==='code')return entry.kind==='Angular'&&!shared;
  if(this.view==='data')return entry.kind==='JSON'||entry.path.startsWith('configuration/');
  if(this.view==='sql')return entry.kind==='SQL';
  if(this.view==='procedure')return entry.kind==='Procedure';
  return this.view==='rdl'&&entry.kind==='RDL';
 });}
 get categoryHelp(){return {
  preview:'',code:'Angular components: viewer binding, report names, parameters, and form actions.',
  data:'Fictional JSON datasets and the dataset-name mappings for this example.',
  sql:'SQL setup templates only: replace the table names, add filters and typed parameters, and configure the built-in provider and Reporting connection. The live preview uses JSON.',
  procedure:'Stored procedure setup templates only: adapt and deploy to your database, then configure the built-in provider and Reporting connection. The live preview uses JSON.',
  rdl:'RDL/RDLC templates for this example, including related subreports and drillthrough targets.',
 }[this.view];}
 constructor(){this.router.events.pipe(takeUntilDestroyed()).subscribe(event=>{if(event instanceof NavigationEnd){this.view='preview';this.message='';this.title=this.router.routerState.snapshot.root.firstChild?.title??'Report example';}});}
 get isDocumentation(){return this.router.url.startsWith('/docs/')||this.router.url==='/'||/^\/(about-us|contact-us)(?:[/?#]|$)/.test(this.router.url);}
 get source(){return this.catalog?.files[this.selectedPath];}
 get lineCount(){return this.source?.content.split('\n').length??0;}
 showPreview(){this.view='preview';}
 async showCode(category:'code'|'data'|'sql'|'procedure'|'rdl'='code'){
  this.view=category;this.error='';this.message='';this.loading=true;
  const route=this.router.url.split(/[?#]/)[0];
  try{
   if(!this.catalog)this.catalog=(await import('./sample-sources.generated')).default as SourceCatalog;
   if(route!==this.router.url.split(/[?#]/)[0])return;
   this.allEntries=this.catalog!.examples[route]??[];
   const report=this.activeComponent?.reportName;
   this.selectedPath=this.entries.find(entry=>entry.report===report)?.path??this.entries[0]?.path??'';
   if(!this.entries.length)this.error='No source files are available for this example.';
  }catch{this.error='Could not load sample source. Please retry.';}finally{this.loading=false;this.changes.markForCheck();}
 }
 selectFile(path:string){this.selectedPath=path;this.message='';}
 async copy(){try{await navigator.clipboard.writeText(this.source?.content??'');this.message='Source copied.';}catch{this.message='Select the code and copy it with your keyboard.';}finally{this.changes.markForCheck();}}
 download(){if(!this.source)return;const url=URL.createObjectURL(new Blob([this.source.content],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=this.selectedPath.split('/').at(-1)??'sample.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 tabKey(event:KeyboardEvent){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const tabs=['preview','code','data','sql','procedure','rdl'] as const;
  const index=tabs.indexOf(this.view);
  const next=event.key==='Home'?'preview':event.key==='End'?'rdl':tabs[(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];
  if(next==='preview')this.showPreview();else void this.showCode(next);
  document.getElementById('sample-'+next+'-tab')?.focus();
 }
}

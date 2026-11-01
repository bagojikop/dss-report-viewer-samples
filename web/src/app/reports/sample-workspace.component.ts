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
   <button id="sample-preview-tab" role="tab" [attr.aria-selected]="view==='preview'" [attr.tabindex]="view==='preview'?0:-1" aria-controls="sample-preview" (click)="showPreview()" (keydown)="tabKey($event,'code')">Preview</button>
   <button id="sample-code-tab" role="tab" [attr.aria-selected]="view==='code'" [attr.tabindex]="view==='code'?0:-1" aria-controls="sample-code" (click)="showCode()" (keydown)="tabKey($event,'preview')">Code</button>
   <span class="sample-title">{{title}}</span>
  </div>}
  <div id="sample-preview" class="sample-preview" [attr.role]="isDocumentation?null:'tabpanel'" [attr.aria-labelledby]="isDocumentation?null:'sample-preview-tab'" [hidden]="!isDocumentation && view!=='preview'">
   <router-outlet (activate)="activeComponent=$event" />
  </div>
  <section id="sample-code" class="sample-code" role="tabpanel" aria-labelledby="sample-code-tab" [hidden]="isDocumentation || view!=='code'" [attr.aria-busy]="loading">
   @if(loading){<p role="status">Loading sample source…</p>}
   @else if(error){<p role="alert">{{error}}</p><button (click)="showCode()">Retry</button>}
   @else {
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
 :host{display:flex;flex-direction:column;height:100%;min-width:0;--sample-preview-height:calc(100dvh - 52px);font:14px Arial,sans-serif;color:#334155}
 [hidden]{display:none!important}
 .sample-bar{height:52px;flex-shrink:0;display:flex;align-items:center;gap:4px;padding:0 18px;background:white;border-bottom:1px solid #dce2ec;box-sizing:border-box}
 button{font:inherit;cursor:pointer;border:1px solid #cbd5e1;border-radius:6px;background:white;color:#334155;padding:8px 14px}
 .sample-bar button{height:100%;border:0;border-radius:0;border-bottom:3px solid transparent;background:transparent}
 .sample-bar button[aria-selected=true]{border-bottom-color:#4f46e5;color:#4338ca;font-weight:600}
 button:focus-visible,select:focus-visible,pre:focus-visible{outline:2px solid #6366f1;outline-offset:-2px}
 .sample-title{margin-left:auto;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 .sample-preview{flex:1;min-height:0;overflow:hidden}
 .sample-code{flex:1;min-height:0;display:flex;flex-direction:column;padding:18px;gap:12px;background:#f8fafc;box-sizing:border-box}
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
 view:'preview'|'code'='preview';
 title='';activeComponent:any;
 catalog?:SourceCatalog;entries:SourceEntry[]=[];selectedPath='';loading=false;error='';message='';
 readonly kinds=['Angular','RDL','JSON','Configuration'];
 constructor(){this.router.events.pipe(takeUntilDestroyed()).subscribe(event=>{if(event instanceof NavigationEnd){this.view='preview';this.message='';this.title=this.router.routerState.snapshot.root.firstChild?.title??'Report example';}});}
 get isDocumentation(){return this.router.url.startsWith('/docs/')||this.router.url==='/';}
 get source(){return this.catalog?.files[this.selectedPath];}
 get lineCount(){return this.source?.content.split('\n').length??0;}
 showPreview(){this.view='preview';}
 async showCode(){
  this.view='code';this.error='';this.message='';this.loading=true;
  const route=this.router.url.split(/[?#]/)[0];
  try{
   if(!this.catalog)this.catalog=(await import('./sample-sources.generated')).default as SourceCatalog;
   if(route!==this.router.url.split(/[?#]/)[0])return;
   this.entries=this.catalog!.examples[route]??[];
   const report=this.activeComponent?.reportName;
   this.selectedPath=this.entries.find(entry=>entry.report===report)?.path??this.entries[0]?.path??'';
   if(!this.entries.length)this.error='No source files are available for this example.';
  }catch{this.error='Could not load sample source. Please retry.';}finally{this.loading=false;this.changes.markForCheck();}
 }
 selectFile(path:string){this.selectedPath=path;this.message='';}
 async copy(){try{await navigator.clipboard.writeText(this.source?.content??'');this.message='Source copied.';}catch{this.message='Select the code and copy it with your keyboard.';}finally{this.changes.markForCheck();}}
 download(){if(!this.source)return;const url=URL.createObjectURL(new Blob([this.source.content],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=this.selectedPath.split('/').at(-1)??'sample.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 tabKey(event:KeyboardEvent,target:'preview'|'code'){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const next=event.key==='Home'?'preview':event.key==='End'?'code':target;
  if(next==='code')void this.showCode();else this.showPreview();
  document.getElementById('sample-'+next+'-tab')?.focus();
 }
}

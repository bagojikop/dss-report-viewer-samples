import {ShareDocumentGuideComponent} from './share-document-guide.component';
import {ReportPathGuideComponent} from './report-path-guide.component';
import {QueryMapGuideComponent} from './query-map-guide.component';
import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {GettingStartedComponent} from './getting-started.component';
import {DocCodeComponent} from './doc-code.component';

@Component({
 selector:'app-common-settings', standalone:true, imports:[RouterLink,DocCodeComponent,QueryMapGuideComponent,ReportPathGuideComponent,ShareDocumentGuideComponent],
 template:`<div class="settings-page"><span class="eyebrow">DOCUMENTATION / CONFIGURATION</span><h1>Common Settings</h1><p>Configure shared settings once, then reuse them across your report examples.</p>
 <div class="settings-tabs" role="tablist" aria-label="Common settings category">@for(tab of tabs;track tab.id){<button [id]="'settings-'+tab.id+'-tab'" role="tab" [attr.aria-selected]="section===tab.id" [attr.tabindex]="section===tab.id?0:-1" [attr.aria-controls]="'settings-'+tab.id" (click)="section=tab.id" (keydown)="settingsKey($event)">{{tab.label}}</button>}</div>
 <section id="settings-api" role="tabpanel" aria-labelledby="settings-api-tab" [hidden]="section!=='api'"><h2>API address and requests</h2><p>The reports endpoint is the connection between Web and .NET Core API. Send the report name and parameter values; the server loads datasets.</p><app-doc-code label="API | catalog and definition" [code]="checkApi" /><app-doc-code label="API | render and export with parameters" [code]="renderRequest" /></section>
 <section id="settings-web" role="tabpanel" aria-labelledby="settings-web-tab" [hidden]="section!=='web'"><h2>Web configuration</h2><p>Set reportApiUrl in public/aa.config.json. After deployment, edit the copy beside index.html and reload. Use /api/reports for a shared origin or your complete HTTPS endpoint.</p><app-doc-code label="Web | aa.config.json" [code]="runtimeSettings" /><p>Load this file before Angular starts and register HttpClient once. Keep database credentials on the API server.</p><app-doc-code label="Web | complete bootstrap example" [code]="bootstrap" /></section>
 <section id="settings-core" role="tabpanel" aria-labelledby="settings-core-tab" [hidden]="section!=='core'"><h2>.NET Core API configuration</h2><p>Install the NuGet package, register reporting, configure report roots and dataset names, and allow the frontend origin.</p><app-doc-code label="API | installation" [code]="newApi" /><app-doc-code label="API | Program.cs" [code]="program" /><app-doc-code label="API | appsettings.json" [code]="settings" /><app-doc-code label="API | report-query-map.json" [code]="jsonMap" /><app-doc-code label="API | include report files in publish output" [code]="publishFiles" /><app-report-path-guide /><app-query-map-guide /><h3>Built-in SQL file and procedure support</h3><p>Package 0.1.23+ includes the unified provider. Choose jsonFile, sqlFile, or storedProcedure in report-query-map.json. No additional provider registration or UseSqlReportData switch is needed. Add a Reporting connection string only for SQL sources. JSON does not require a connection string or duplicate ReportDataFiles mapping.</p><app-doc-code label="API | built-in registration" [code]="sqlRegistration" /><app-doc-code label="API | SQL connection settings" [code]="sqlSettings" /><app-doc-code label="API | publish the query map" [code]="sqlPublish" /></section>
 <section id="settings-sharing" role="tabpanel" aria-labelledby="settings-sharing-tab" [hidden]="section!=='sharing'"><app-share-document-guide /></section>
 <a routerLink="/docs/getting-started">Read the full integration and deployment guide</a></div>`,
 styles:[`:host{display:block;height:100%;overflow:auto;background:#fff;color:#243650;font:14px/1.8 Arial,sans-serif}[hidden]{display:none!important}.settings-page{max-width:960px;padding:48px 38px;margin:auto;box-sizing:border-box}.eyebrow{font-size:10px;letter-spacing:1.5px;color:#6c819f}h1{font-size:38px;margin:10px 0}h2{font-size:24px}p{color:#637690}a{color:#3765da}.settings-tabs{display:flex;gap:8px;border-bottom:1px solid #dce5f4;margin:28px 0;overflow:auto}.settings-tabs button{white-space:nowrap;padding:12px 18px;border:0;border-bottom:3px solid transparent;background:transparent;color:#657995;cursor:pointer;font:inherit}.settings-tabs button[aria-selected=true]{border-bottom-color:#426ee3;color:#2e56ad;font-weight:600}button:focus-visible,a:focus-visible{outline:2px solid #426ee3}app-doc-code{margin:18px 0}section{margin-bottom:30px}@media(max-width:700px){.settings-page{padding:28px 16px}h1{font-size:30px}.settings-tabs button{padding:10px}}`],
})
export class CommonSettingsComponent extends GettingStartedComponent {
 section:'api'|'web'|'core'|'sharing'='api';
 readonly tabs=[{id:'api',label:'API'},{id:'web',label:'Web'},{id:'core',label:'.NET Core API'},{id:'sharing',label:'Share Documents'}] as const;
 settingsKey(event:KeyboardEvent){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const ids=['api','web','core','sharing'] as const;const index=ids.indexOf(this.section);
  this.section=event.key==='Home'?'api':event.key==='End'?'sharing':ids[(index+(event.key==='ArrowRight'?1:-1)+ids.length)%ids.length];
  document.getElementById('settings-'+this.section+'-tab')?.focus();
 }
}

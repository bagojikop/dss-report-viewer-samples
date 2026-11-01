import {Component,inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DssReportViewerComponent} from '@bagojikop/report-viewer';
import {REPORT_API_URL} from '../report-api.config';
@Component({selector:'app-share-preview',standalone:true,imports:[RouterLink,DssReportViewerComponent],
 template:`<header><div><strong>Document sharing preview</strong><p>Live delivery is not yet tested. Source and configuration examples are available; opening a dialog does not send a message.</p></div><a routerLink="/docs/share/whatsapp">WhatsApp guide</a><a routerLink="/docs/share/rcs">RCS / SMS guide</a><a routerLink="/docs/share/email">Mail guide</a></header><dss-report-viewer [apiUrl]="apiUrl" reportName="docs/GuideDemo.rdl" [reportParameters]="parameters" [showHeader]="true" [showSend]="true" height="100%" />`,
 styles:[`:host{display:flex;flex-direction:column;height:100%;min-height:0;font:13px/1.6 Arial,sans-serif;color:#2b4366}header{display:flex;align-items:center;gap:20px;padding:14px 20px;background:white;flex-wrap:wrap;border-bottom:1px solid #dce5f4}header div{flex:1;min-width:180px}header p{margin:4px 0 0;font-size:11px;color:#7186a4}a{color:#3a61b5;font-size:11px}dss-report-viewer{flex:1;min-height:0}@media(max-width:700px){header{padding:12px;gap:10px}}`]
})
export class SharePreviewComponent {
 readonly apiUrl=inject(REPORT_API_URL);
 readonly parameters={InvoiceId:'1002'};
}

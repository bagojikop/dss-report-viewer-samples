import {Component,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DssReportViewerComponent} from '@bagojikop/report-viewer';
import {REPORT_API_URL} from '../report-api.config';

@Component({
 selector:'app-report-viewer-demo',standalone:true,imports:[FormsModule,DssReportViewerComponent],
 template:`<form (ngSubmit)="parameters={InvoiceId:invoiceId}"><label>Invoice <select name="invoiceId" [(ngModel)]="invoiceId"><option value="1001">1001</option><option value="1002">1002</option><option value="1003">1003</option></select></label><button type="submit">Apply parameters</button></form>
 <div class="preview"><dss-report-viewer [apiUrl]="apiUrl" reportName="drillthrough/InvoiceDetails.rdl" [reportParameters]="parameters" [showHeader]="false" height="100%" /></div>`,
 styles:[`:host{display:flex;flex-direction:column;height:var(--sample-preview-height,100dvh);min-height:0}form{display:flex;gap:12px;align-items:center;padding:12px;border-bottom:1px solid #dbe3ef;font:13px Arial}select,button{font:inherit;padding:7px;border:1px solid #cbd5e1;border-radius:5px}label{display:flex;gap:8px;align-items:center}.preview{flex:1;min-height:0;overflow:hidden}`]
})
export class ReportViewerDemoComponent {
 readonly apiUrl=inject(REPORT_API_URL);
 invoiceId='1002';
 parameters:Record<string,string>={InvoiceId:'1002'};
}

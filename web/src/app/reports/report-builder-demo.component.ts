import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CURRENCY_OPTIONS} from './currency-options';
import {DssReportTabsComponent, ReportUrlActionRoute} from '@bagojikop/report-viewer';
import {REPORT_API_URL} from '../report-api.config';
import {InvoiceActionFormComponent} from './invoice-action-form.component';

@Component({
 selector:'app-report-builder-demo', standalone:true, imports:[FormsModule,DssReportTabsComponent],
 template:`
  <form #options="ngForm" class="options" aria-label="Report parameters" (ngSubmit)="apply()">
   <div class="heading"><label>Example <select name="example" [(ngModel)]="reportName" (ngModelChange)="apply()"><option value="docs/SymbolOptions.rdl">Currency and image options</option><option value="docs/GuideDemo.rdl">Symbols and report actions</option></select></label><button type="submit" [disabled]="options.invalid">Apply</button></div>
   @if(reportName==='docs/SymbolOptions.rdl') {
    <div class="fields">
     <label>Amount <input name="amount" type="number" step="0.0001" required [(ngModel)]="amount"></label>
     <label>Currency code <select name="currency" required [(ngModel)]="currency" aria-describedby="currency-help">@for(option of currencies; track option.code){<option [value]="option.code">{{option.code}} ? {{option.name}}</option>}</select></label>
     <label class="wide">QR / barcode text <input name="payload" [(ngModel)]="payload"></label>
     <label>QR ECC <select name="ecc" [(ngModel)]="ecc"><option>L</option><option>M</option><option>Q</option><option>H</option></select></label>
     <label>QR pixels / module <input name="pixels" type="number" min="1" max="32" step="1" required [(ngModel)]="pixels"></label>
     <label>QR quiet border <select name="quiet" [(ngModel)]="quiet"><option value="True">Enabled</option><option value="False">Disabled</option></select></label>
     <label>Barcode type <select name="type" [(ngModel)]="barcodeType"><option>CODE128</option><option>CODE39Extended</option></select></label>
     <label>Barcode width (0 = auto) <input name="width" type="number" min="0" max="8192" step="1" required [(ngModel)]="width"></label>
     <label>Barcode height <input name="height" type="number" min="1" max="2048" step="1" required [(ngModel)]="height"></label>
     <label>Barcode margin <input name="margin" type="number" min="0" max="1024" step="1" required [(ngModel)]="margin"></label>
    </div>
    <p id="currency-help">Amounts use English wording; INR uses lakh/crore. QR defaults: M, 4 pixels per module, quiet border enabled. Barcode defaults: automatic width, height 80, margin 12.</p>
    <details><summary>Base64 image</summary><label>Raw base64 or image data URI <textarea name="base64" rows="2" [(ngModel)]="imageBase64"></textarea></label><p>The default is a tiny PNG swatch. Paste a PNG or JPEG image to preview it.</p></details>
   }
  </form>
  <div class="viewer" role="region" aria-label="Report preview"><dss-report-tabs [apiUrl]="apiUrl" [reportName]="reportName" [reportParameters]="parameters" [urlActionRoutes]="formRoutes" rootTabTitle="Symbols and currency" height="100%" /></div>`,
 styles:[`:host{display:grid;grid-template-columns:290px minmax(0,1fr);height:var(--sample-preview-height,100dvh);max-height:100%;min-height:0;min-width:0;overflow:hidden}.options{box-sizing:border-box;margin:0;padding:16px;min-height:0;min-width:0;overflow-y:scroll;overflow-x:hidden;scrollbar-gutter:stable;background:#f7f9fd;border-right:1px solid #dbe3ef;font:12px Arial,sans-serif;color:#2c466b}.heading{position:sticky;top:-16px;z-index:1;display:flex;flex-direction:column;gap:12px;margin:-16px -16px 0;padding:16px;background:#f7f9fd;border-bottom:1px solid #dbe3ef}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 10px;margin-top:18px}label{display:flex;flex-direction:column;gap:6px;min-width:0;line-height:1.5}.wide{grid-column:span 2}input,select,textarea,button{width:100%;font:inherit;padding:8px;border:1px solid #c5d2e5;border-radius:5px;box-sizing:border-box;min-width:0}textarea{resize:vertical}button{background:#315fc5;color:white;cursor:pointer}button:disabled{opacity:.5;cursor:default}input:focus-visible,select:focus-visible,textarea:focus-visible,button:focus-visible{outline:2px solid #315fc5;outline-offset:2px}p{line-height:1.7;margin:16px 0 0}summary{cursor:pointer;margin:16px 0}.viewer{height:100%;min-height:0;min-width:0;overflow:hidden}.viewer dss-report-tabs{display:flex;height:100%;min-height:0;min-width:0}@media(max-width:760px){:host{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,30dvh) minmax(0,1fr)}.options{border-right:0;border-bottom:1px solid #dbe3ef}.heading{flex-direction:row;align-items:end}.heading label{flex:1}.heading button{width:auto}.fields{grid-template-columns:repeat(2,minmax(0,1fr))}}@media print{:host{display:block;height:auto;max-height:none;overflow:visible}.options{display:none}.viewer{height:auto;overflow:visible}}`]
})
export class ReportBuilderDemoComponent {
 readonly apiUrl=inject(REPORT_API_URL);
 readonly currencies=CURRENCY_OPTIONS;
 reportName='docs/SymbolOptions.rdl';
 amount=123456.50; currency='INR'; payload='DSS-DEMO-1002'; ecc='M'; pixels=4; quiet='True';
 width=0; height=80; margin=12; barcodeType='CODE128';
 imageBase64='iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAF0lEQVR4nGMwjD9KEmIY1TCq4eiw1QAAtZdVELAfNvsAAAAASUVORK5CYII=';
 parameters:Record<string,string>={};
 constructor(){this.apply();}
 apply(){
  this.parameters=this.reportName==='docs/GuideDemo.rdl'?{InvoiceId:'1002'}:{
   Amount:String(this.amount), CurrencyCode:this.currency.trim().toUpperCase(), Payload:this.payload,
   EccLevel:this.ecc, PixelsPerModule:String(this.pixels), DrawQuietZones:this.quiet,
   BarcodeWidth:String(this.width), BarcodeHeight:String(this.height), BarcodeMargin:String(this.margin),
   BarcodeType:this.barcodeType, ImageBase64:this.imageBase64,
  };
 }
 readonly formRoutes:ReportUrlActionRoute[]=[{
  path:'/forms/invoice/:id',component:InvoiceActionFormComponent,title:'Invoice form',
  inputs:action=>({invoiceId:action.pathParams['id'],firmId:action.queryParams['firmId']??'',
   customer:action.queryParams['customer']??'',amount:action.queryParams['amount']??''}),
 }];
}

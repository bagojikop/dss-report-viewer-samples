import {Component,inject} from '@angular/core';
import {DssReportTabsComponent,ReportUrlActionRoute} from '@bagojikop/report-viewer';
import {REPORT_API_URL} from '../report-api.config';
import {InvoiceActionFormComponent} from './invoice-action-form.component';

@Component({selector:'app-report-builder-demo',standalone:true,imports:[DssReportTabsComponent],
 template:`<dss-report-tabs [apiUrl]="apiUrl" reportName="docs/GuideDemo.rdl"
  [reportParameters]="parameters" [urlActionRoutes]="formRoutes"
  rootTabTitle="Symbols and actions" height="var(--sample-preview-height,100dvh)" />`})
export class ReportBuilderDemoComponent {
 readonly apiUrl=inject(REPORT_API_URL);
 readonly parameters={InvoiceId:'1002'};
 readonly formRoutes:ReportUrlActionRoute[]=[{
  path:'/forms/invoice/:id',component:InvoiceActionFormComponent,title:'Invoice form',
  inputs:action=>({invoiceId:action.pathParams['id'],firmId:action.queryParams['firmId']??'',
   customer:action.queryParams['customer']??'',amount:action.queryParams['amount']??''}),
 }];
}

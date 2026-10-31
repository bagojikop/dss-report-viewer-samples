import {Component} from '@angular/core';
import {DssReportTabsComponent,ReportUrlActionRoute} from '@bagojikop/report-viewer';
import {InvoiceActionFormComponent} from './invoice-action-form.component';

@Component({
  selector:'app-textbox-actions-report',
  standalone:true,
  imports:[DssReportTabsComponent],
  template:`<dss-report-tabs apiUrl="http://localhost:5000/api/reports"
    reportName="TextboxActions.rdl" [urlActionRoutes]="modalRoutes"
    [showHeader]="false" rootTabTitle="Invoice actions" height="var(--sample-preview-height, 100dvh)" />`,
})
export class TextboxActionsReportComponent {
  readonly modalRoutes:ReportUrlActionRoute[]=[{
    path:'/forms/invoice/:id',
    component:InvoiceActionFormComponent,
    title:'Invoice form',
    inputs:action=>({
      invoiceId:action.pathParams['id'],
      firmId:action.queryParams['firmId'],
      customer:action.queryParams['customer'],
      amount:action.queryParams['amount'],
    }),
  }];
}

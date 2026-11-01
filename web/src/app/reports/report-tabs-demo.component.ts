import {inject} from '@angular/core';
import {REPORT_API_URL} from '../report-api.config';
import {Component} from '@angular/core';
import {DssReportTabsComponent} from '@bagojikop/report-viewer';

@Component({
  selector:'app-report-tabs-demo',
  standalone:true,
  imports:[DssReportTabsComponent],
  template:`<dss-report-tabs [apiUrl]="apiUrl"
    reportName="drillthrough/Invoices.rdl" rootTabTitle="Invoices" height="var(--sample-preview-height, 100dvh)" />`,
})
export class ReportTabsDemoComponent {
  readonly apiUrl=inject(REPORT_API_URL);}

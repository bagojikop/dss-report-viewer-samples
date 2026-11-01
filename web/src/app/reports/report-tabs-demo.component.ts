import {Component} from '@angular/core';
import {DssReportTabsComponent} from '@bagojikop/report-viewer';

@Component({
  selector:'app-report-tabs-demo',
  standalone:true,
  imports:[DssReportTabsComponent],
  template:`<dss-report-tabs apiUrl="http://localhost:5000/api/reports"
    reportName="drillthrough/Invoices.rdl" rootTabTitle="Invoices" height="var(--sample-preview-height, 100dvh)" />`,
})
export class ReportTabsDemoComponent {}

import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DssReportViewerComponent} from '@bagojikop/report-viewer';
import {chartCatalog} from './chart-catalog';

@Component({
  selector: 'app-charts-report',
  standalone: true,
  imports: [FormsModule, DssReportViewerComponent],
  template: `
    <div class="chart-toolbar">
      <label for="chart-example">Chart example</label>
      <select id="chart-example" [(ngModel)]="reportName">
        @for (family of families; track family) {
          <optgroup [label]="family">
            @for (chart of catalog; track chart.report) {
              @if (chart.family === family) { <option [value]="chart.report">{{chart.label}}</option> }
            }
          </optgroup>
        }
      </select>
    </div>
    <dss-report-viewer apiUrl="http://localhost:5000/api/reports"
      [reportName]="reportName" [reportParameters]="parameters"
      [showHeader]="false" height="calc(var(--sample-preview-height, 100dvh) - 56px)" />
  `,
  styles: [`.chart-toolbar { display:flex; align-items:center; gap:12px; height:56px; padding:0 18px; box-sizing:border-box; background:#fff; border-bottom:1px solid #e2e8f0; font:14px Arial,sans-serif; }
    select { max-width:70%; padding:7px 12px; border:1px solid #cbd5e1; border-radius:5px; background:white; color:#27364b; }
    @media print { .chart-toolbar { display:none; } }`],
})
export class ChartsReportComponent {
  readonly catalog = chartCatalog;
  readonly families = [...new Set(chartCatalog.map(chart => chart.family))];
  reportName = 'charts/Column-Plain.rdl';
  parameters: Record<string, string> = {};
}

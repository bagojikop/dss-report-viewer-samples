import {inject} from '@angular/core';
import {REPORT_API_URL} from '../report-api.config';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DssReportViewerComponent} from '@bagojikop/report-viewer';
import {visualCatalog} from './visual-catalog';

@Component({
  selector: 'app-visuals-report',
  standalone: true,
  imports: [FormsModule, DssReportViewerComponent],
  template: `
    <div class="visual-toolbar">
      <label for="visual-example">Visualization</label>
      <select id="visual-example" [(ngModel)]="reportName">
        @for (family of families; track family) {
          <optgroup [label]="family">
            @for (example of catalog; track example.report) {
              @if (example.family === family) { <option [value]="example.report">{{example.label}}</option> }
            }
          </optgroup>
        }
      </select>
    </div>
    <dss-report-viewer [apiUrl]="apiUrl"
      [reportName]="reportName" [reportParameters]="parameters"
      [showHeader]="false" height="calc(var(--sample-preview-height, 100dvh) - 56px)" />
  `,
  styles: [`.visual-toolbar { display:flex; align-items:center; gap:12px; height:56px; padding:0 18px; box-sizing:border-box; background:white; border-bottom:1px solid #e2e8f0; font:14px Arial,sans-serif; }
    select { max-width:75%; padding:7px 12px; border:1px solid #cbd5e1; border-radius:5px; background:white; color:#27364b; }
    @media print { .visual-toolbar { display:none; } }`],
})
export class VisualsReportComponent {
  readonly apiUrl=inject(REPORT_API_URL);
  readonly catalog = visualCatalog;
  readonly families = [...new Set(visualCatalog.map(example => example.family))];
  reportName = 'visuals/GaugeDashboard.rdl';
  parameters: Record<string, string> = {};
}

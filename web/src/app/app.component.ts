import {Component, inject} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ApiLoadingService} from './api-loading.service';
import {ReportMenuComponent} from './reports/report-menu.component';
import {SampleWorkspaceComponent} from './reports/sample-workspace.component';
import {ApiLoadingComponent} from './api-loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SampleWorkspaceComponent, ReportMenuComponent, ApiLoadingComponent],
  template: `
    <div class="report-app">
      <app-report-menu />
      <div class="report-content">
        <app-sample-workspace />
      </div>
    </div>
    <app-api-loading />
  `,
  styles: [`
    .report-app { display:grid; grid-template-columns:220px minmax(0,1fr); height:100dvh; overflow:hidden; }
    .report-content { position:relative; min-width:0; overflow:hidden; }
    @media (max-width:700px) { .report-app { grid-template-columns:60px minmax(0,1fr); } }
    @media print { .report-app { display:block; height:auto; overflow:visible; } .report-content { overflow:visible; } }
  `],
})
export class AppComponent {
  constructor() {
    const loading = inject(ApiLoadingService);
    inject(Router).events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) loading.start();
      else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) loading.finish();
    });
  }
}

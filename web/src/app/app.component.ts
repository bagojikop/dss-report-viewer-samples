import {Component, inject} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ApiLoadingService} from './api-loading.service';
import {ReportMenuComponent} from './reports/report-menu.component';
import {SampleWorkspaceComponent} from './reports/sample-workspace.component';
import {ApiLoadingComponent} from './api-loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SampleWorkspaceComponent, ReportMenuComponent, ApiLoadingComponent, RouterLink, RouterLinkActive],
  template: `
    <div class="report-app">
      <app-report-menu />
      <div class="report-content">
        <nav class="company-nav" aria-label="Company">
          <a routerLink="/about-us" routerLinkActive="active" ariaCurrentWhenActive="page">About us</a>
          <a routerLink="/contact-us" routerLinkActive="active" ariaCurrentWhenActive="page">Contact us</a>
        </nav>
        <app-sample-workspace />
      </div>
    </div>
    <app-api-loading />
  `,
  styles: [`
    .report-app { display:grid; grid-template-columns:220px minmax(0,1fr); height:100dvh; overflow:hidden; }
    .report-content { position:relative; min-width:0; overflow:hidden; display:flex; flex-direction:column; }
    app-sample-workspace { flex:1; min-height:0; height:auto; }
    .company-nav { display:flex; justify-content:flex-end; align-items:center; gap:24px; height:42px; flex-shrink:0; box-sizing:border-box; padding:0 22px; background:#fff; border-bottom:1px solid #e1e7f0; font:12px Arial,sans-serif; }
    .company-nav a { color:#61748f; text-decoration:none; padding:7px 0; }
    .company-nav a:hover,.company-nav a.active { color:#315fc5; }
    .company-nav a.active { font-weight:600; }
    .company-nav a:focus-visible { outline:2px solid #426ee3; outline-offset:4px; }
    @media (max-width:700px) { .report-app { grid-template-columns:60px minmax(0,1fr); } }
    @media print { .report-app { display:block; height:auto; overflow:visible; } .report-content { overflow:visible; display:block; } .company-nav { display:none; } }
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

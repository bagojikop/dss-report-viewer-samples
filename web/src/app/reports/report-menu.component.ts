import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-report-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Reports">
      <a class="brand" routerLink="/docs/getting-started" aria-label="DSS Reporting home"><span class="brand-icon">D</span><span class="brand-text"><strong>DSS Reporting</strong><small>GITHUB SAMPLES</small></span></a>
      <span class="menu-section">START HERE</span>
      <a routerLink="/docs/getting-started" routerLinkActive="active" ariaCurrentWhenActive="page" title="Setup"><span class="menu-marker">1</span><span class="menu-text">Setup</span></a>
      <a routerLink="/docs/report-builder" routerLinkActive="active" ariaCurrentWhenActive="page" title="Symbols guide"><span class="menu-marker">?</span><span class="menu-text">Symbols guide</span></a>
      <span class="menu-section examples-label">EXAMPLES</span>
      @for (report of reports; track report.path) {
        <a [routerLink]="report.path" routerLinkActive="active"
          [attr.aria-label]="report.label" [title]="report.label" ariaCurrentWhenActive="page"><span class="menu-marker" aria-hidden="true">{{report.label.charAt(0)}}</span><span class="menu-text">{{report.label}}</span></a>
      }
    </nav>
  `,
  styles: [`
    :host { display:block;min-width:0;background:#111c2f;border-right:1px solid #1c2b43;overflow-y:auto;overflow-x:hidden;scrollbar-gutter:stable;overscroll-behavior-y:contain;color:#91a1bb;font:12px Arial,sans-serif; }
    :host::-webkit-scrollbar { width:8px; }
    :host::-webkit-scrollbar-track { background:transparent; margin-block:12px; }
    :host::-webkit-scrollbar-thumb { background:#344761;border:2px solid #111c2f;border-radius:999px; }
    :host::-webkit-scrollbar-thumb:hover { background:#607da5; }
    :host::-webkit-scrollbar-thumb:active { background:#88aef2; }
    @supports not selector(::-webkit-scrollbar) {
      :host { scrollbar-width:thin;scrollbar-color:#344761 #111c2f; }
      :host:hover, :host:focus-within { scrollbar-color:#607da5 #111c2f; }
    }
    nav { display:flex;flex-direction:column;gap:5px;padding:24px 13px; }
    a { display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:7px;color:#93a3bd;text-decoration:none;font-size:12px;font-weight:400; }
    a:hover { background:#1c2b43;color:#e5edfa; }
    a.active { background:#253e69;color:#e5edff; }
    a:focus-visible { outline:2px solid #88aef2;outline-offset:2px; }
    a.brand { padding:0 9px 29px;gap:11px; }
    a.brand:hover{background:none}.brand-icon{display:grid;place-items:center;width:31px;height:34px;background:#426ee3;border:1px solid #6c8fed;border-radius:8px;color:white;font-size:19px;font-weight:700;box-shadow:0 4px 14px #0002}
    .brand-text{display:flex;flex-direction:column;gap:5px}.brand-text strong{color:#f1f5fd;font-size:14px;letter-spacing:-.2px}.brand-text small{font-size:8px;letter-spacing:1.2px;color:#6f819f}
    .menu-section{font-size:8px;font-weight:700;letter-spacing:1.7px;color:#5f728f;padding:4px 13px 8px}.examples-label{margin-top:22px}.menu-marker{display:grid;place-items:center;width:17px;flex-shrink:0;font:11px Consolas,monospace;color:#7189b1}.active .menu-marker{color:#94b5ef}
    @media(max-width:700px){nav{padding:20px 7px}a{justify-content:center;padding:12px 8px}.brand-text,.menu-text,.menu-section{display:none}a.brand{padding:0 0 24px}.menu-marker{font-size:14px}.examples-label{margin-top:12px}}
    @media print { :host { display:none; } }
  `],
})
export class ReportMenuComponent {
  readonly reports = [
    {path:'/reports/viewer',label:'Report Viewer'},
    {path:'/reports/report-tabs',label:'Report Tabs'},
    {path:'/reports/report-builder',label:'Dss.Reporting.Symbols'},
  ];
}

import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-report-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Reports">
      <a class="brand" routerLink="/docs/getting-started" aria-label="DSS Reporting home"><span class="brand-icon">D</span><span class="brand-text"><strong>DSS Reporting</strong><small>DEVELOPER TOOLKIT</small></span></a>
      <span class="menu-section">DOCUMENTATION</span>
      <a routerLink="/docs/getting-started" routerLinkActive="active" ariaCurrentWhenActive="page" aria-label="Getting started"><span class="menu-marker" aria-hidden="true">&#8599;</span><span class="menu-text">Getting started</span></a>
      <a routerLink="/docs/common-settings" routerLinkActive="active" ariaCurrentWhenActive="page" aria-label="Common Settings" title="Common Settings"><span class="menu-marker" aria-hidden="true">S</span><span class="menu-text">Common Settings</span></a>
      <a routerLink="/docs/report-builder" routerLinkActive="active" ariaCurrentWhenActive="page" aria-label="Report Builder Guide" title="Report Builder Guide"><span class="menu-marker" aria-hidden="true">B</span><span class="menu-text">Report Builder Guide</span></a>
      <span class="menu-section examples-label">COMPANY</span>
      <a href="https://www.dsserp.com/" target="_blank" rel="noopener noreferrer" aria-label="Dynamic Super Software main website" title="Main website: dsserp.com"><span class="menu-marker" aria-hidden="true">D</span><span class="menu-text">dsserp.com &#8599;</span></a>
      <span class="menu-section examples-label">SHARE REPORTS</span>
      <a routerLink="/docs/share/whatsapp" routerLinkActive="active" ariaCurrentWhenActive="page" aria-label="Share via WhatsApp" title="Share via WhatsApp"><span class="menu-marker" aria-hidden="true">W</span><span class="menu-text">WhatsApp</span></a>
      <a routerLink="/docs/share/rcs" routerLinkActive="active" ariaCurrentWhenActive="page" aria-label="Share via RCS / SMS" title="Share via RCS / SMS"><span class="menu-marker" aria-hidden="true">R</span><span class="menu-text">RCS / SMS</span></a>
      <a routerLink="/docs/share/email" routerLinkActive="active" ariaCurrentWhenActive="page" aria-label="Share via Mail" title="Share via Mail"><span class="menu-marker" aria-hidden="true">&#64;</span><span class="menu-text">Mail</span></a>
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
    {path:'/reports/report-builder',label:'Symbols and actions'},
    {path:'/reports/report-tabs',label:'Report tabs'},
    {path:'/reports/textbox-actions',label:'Textbox actions'},
    {path:'/reports/charts',label:'Charts'},
    {path:'/reports/visuals',label:'Gauges & maps'},
  ];
}

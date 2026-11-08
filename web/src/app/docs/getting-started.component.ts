import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DocCodeComponent} from './doc-code.component';
@Component({selector:'app-getting-started',standalone:true,imports:[RouterLink,DocCodeComponent],
 template:`<article><h1>DSS Reporting samples</h1><p>Three examples showing how to use the Angular viewer, report tabs, and shared currency/image helpers. All invoice data is fictional.</p>
 <nav><a routerLink="/reports/viewer"><strong>1. Report Viewer</strong><span>Bind an API, report name and invoice parameter.</span></a><a routerLink="/reports/report-tabs"><strong>2. Report Tabs</strong><span>Open invoice details from a report action in a new tab.</span></a><a routerLink="/reports/report-builder"><strong>3. Dss.Reporting.Symbols</strong><span>Try currency words, QR/barcode options, and base64 images.</span></a></nav>
 <h2>Run the API and web app</h2><app-doc-code label="Terminal 1 | repository root" [code]="api"/><app-doc-code label="Terminal 2 | repository root" [code]="web"/>
 <p>Open http://localhost:4200. The API must be running on port 5000. Each example has Preview, Web, Data and RDL tabs with copy/download controls.</p>
 <h2>Configure the API address</h2><app-doc-code label="web/public/app.config.json" [code]="config"/><p>Change this file when your API uses another address. Status 0 in the browser usually means the API cannot be reached or its CORS origin does not match the web app.</p>
 <h2>Using the latest Symbols options</h2><p>The new currency, configurable image, and base64 helpers require the updated reporting engine and Symbols DLL. An older installed package does not gain these functions from a report wrapper alone. The README explains the source-checkout build option and the package versions used by this repository.</p>
 <p>See <a routerLink="/docs/report-builder">the Symbols guide</a> for report Code wrappers, parameters, MIME types, and defaults. For integration in your own app, start with docs/report-viewer-integration.md in the GitHub repository.</p></article>`,
 styles:[`:host{display:block;height:100%;overflow:auto;color:#334155;font:14px/1.7 Arial}article{max-width:1000px;padding:32px;margin:auto}h1{font-size:32px}h2{margin-top:28px;font-size:21px}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:26px 0}a{color:#315fc5}nav a{padding:18px;border:1px solid #dbe3ef;border-radius:8px;text-decoration:none}strong,span{display:block}span{margin-top:8px;color:#64748b}app-doc-code{margin:16px 0}`]
})
export class GettingStartedComponent {
 readonly api='dotnet restore api\ndotnet run --project api --urls http://localhost:5000';
 readonly web='cd web\nnpm.cmd ci\nnpm.cmd start';
 readonly config='{\n  "reportApiUrl": "http://localhost:5000/api/reports"\n}';
}

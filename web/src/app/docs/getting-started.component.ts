import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DocCodeComponent} from './doc-code.component';
@Component({selector:'app-getting-started',standalone:true,imports:[RouterLink,DocCodeComponent],templateUrl:'./getting-started.component.html',styleUrl:'./getting-started.component.css'})
export class GettingStartedComponent {
 path:'existing'|'new'='existing';
 pathKey(event:KeyboardEvent,next:'existing'|'new'){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();this.path=event.key==='Home'?'existing':event.key==='End'?'new':next;
  document.getElementById(this.path+'-path-tab')?.focus();
 }
 navigateSection(event:MouseEvent){
  const anchor=(event.target as Element)?.closest('a[href^="#"]');
  const id=anchor?.getAttribute('href')?.slice(1);
  if(id){event.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
 }
 readonly prerequisites=[{title:'.NET 9 SDK',detail:'ASP.NET Core API & report rendering',tag:'API'},{title:'Node.js 24.15+',detail:'Use Node 24.15+ in the 24.x line',tag:'WEB'},{title:'Angular 22',detail:'Standalone components & HttpClient',tag:'VIEWER'}];
 readonly examples=[{name:'Report tabs',detail:'Open invoice details with dataset parameters.',path:'/reports/report-tabs',icon:'01'},{name:'Charts',detail:'Columns, bars, areas, lines and more.',path:'/reports/charts',icon:'02'},{name:'Gauges & maps',detail:'KPIs, indicators and geographic data.',path:'/reports/visuals',icon:'03'},{name:'Report actions',detail:'Open forms in modals or reports in tabs.',path:'/reports/textbox-actions',icon:'04'}];
 readonly apiRun='dotnet restore api\ndotnet run --project api --urls http://localhost:5000';
 readonly webRun='cd web\nnpm.cmd install\nnpm.cmd start';
 readonly newApi=`dotnet new web -n MyReportApi -f net9.0
cd MyReportApi
dotnet add package Bagojikop.Dss.Reporting.AspNetCore --version 0.1.20`;
 readonly program=`using Dss.Reporting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDssReporting();
builder.Services.AddCors(options => options.AddPolicy("web", policy =>
    policy.WithOrigins("http://localhost:4200")
          .AllowAnyHeader().AllowAnyMethod()
          .WithExposedHeaders("X-Report-Warnings")));

var app = builder.Build();
app.UseCors("web");
app.MapControllers();
app.Run();`;
 readonly copyData=`# Copy the Reports and Data folders from this sample repository
# into MyReportApi, then run:
dotnet run --urls http://localhost:5000`;
 readonly settings=JSON.stringify({ReportRoot:'Reports',ReportDataRoot:'Data',ReportDataFiles:{TextboxActions:'textbox_actions_demo.json'}},null,2);
 readonly packageWeb=`# In an existing Angular 22 app:
npm.cmd install @bagojikop/report-viewer@0.1.14`;
 readonly newWeb=`npx @angular/cli@22 new my-report-web --standalone --routing --style=css
cd my-report-web
npm.cmd install @bagojikop/report-viewer@0.1.14`;
 readonly bootstrap=`import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {DssReportTabsComponent} from '@bagojikop/report-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DssReportTabsComponent],
  template: \`<dss-report-tabs
    apiUrl="http://localhost:5000/api/reports"
    reportName="drillthrough/Invoices.rdl"
    rootTabTitle="Invoices"
    height="100dvh" />\`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
}).catch(console.error);`;
 readonly checkApi=`Invoke-RestMethod http://localhost:5000/api/reports
# Expected: a list containing drillthrough/Invoices.rdl`;
 readonly endpoints=[['GET','/api/reports','List available report templates'],['GET','/api/reports/definition/{report}','Read parameters and report metadata'],['POST','/api/reports/render/{report}','Render pages with parameter values'],['POST','/api/reports/pdf/{report}','Export the report as a PDF']];
}

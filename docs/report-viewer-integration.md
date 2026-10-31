# Integrate DSS ReportViewer

Use the published packages to add reporting to your ASP.NET Core API and Angular application. This repository contains runnable sample applications and fictional data, not the reporting engine implementation.

- [Run the sample](../README.md#run-locally)
- [Angular package on npm](https://www.npmjs.com/package/@bagojikop/report-viewer)
- [ASP.NET Core package on NuGet](https://www.nuget.org/packages/Bagojikop.Dss.Reporting.AspNetCore/0.1.20)
- [Symbols dependency on NuGet](https://www.nuget.org/packages/Bagojikop.Dss.Reporting.Symbols/1.0.3)

## 1. Create the API

Install the .NET 9 SDK. In PowerShell:

```powershell
dotnet new web -n MyReportApi -f net9.0
cd MyReportApi
dotnet add package Bagojikop.Dss.Reporting.AspNetCore --version 0.1.20
```

The Symbols package is installed as a dependency. Package IDs begin with `Bagojikop.Dss`; code namespaces remain `Dss.Reporting`.

Replace `Program.cs`:

```csharp
using Dss.Reporting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDssReporting();
builder.Services.AddCors(options => options.AddPolicy("web", policy =>
    policy.WithOrigins("http://localhost:4200")
          .AllowAnyHeader().AllowAnyMethod()
          .WithExposedHeaders("X-Report-Warnings")));
var app = builder.Build();
app.UseCors("web");
app.MapControllers();
app.Run();
```

Copy this repository's [api/Reports](../api/Reports) and [api/Data](../api/Data) folders into your API. Merge the dataset configuration from [appsettings.json](../api/appsettings.json). For the invoice-tab sample alone:

```json
{
  "ReportRoot": "Reports",
  "ReportDataRoot": "Data",
  "ReportDataFiles": {
    "TextboxActions": "textbox_actions_demo.json"
  }
}
```

The dataset name `TextboxActions` must match the RDL. Include the three templates from `Reports/drillthrough` and `Data/textbox_actions_demo.json`.

```powershell
dotnet run --urls http://localhost:5000
```

Verify `http://localhost:5000/api/reports` returns the report catalog. The [sample API project](../api/ReportViewer.SampleApi.csproj) also shows how to include reports and JSON files in published output. Configure your own origins and application authentication when deploying.

## 2. Install the Angular viewer

Use Angular 22 and Node.js 24.15+ in the 24.x line. In an existing Angular 22 application:

```powershell
npm.cmd install @bagojikop/report-viewer@0.1.14
```

For a new application, first run:

```powershell
npx.cmd @angular/cli@22 new my-report-web --standalone --routing --style=css
cd my-report-web
npm.cmd install @bagojikop/report-viewer@0.1.14
```

Replace `src/main.ts` with this minimal complete example:

```typescript
import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {DssReportTabsComponent} from '@bagojikop/report-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DssReportTabsComponent],
  template: `<dss-report-tabs
    apiUrl="http://localhost:5000/api/reports"
    reportName="drillthrough/Invoices.rdl"
    rootTabTitle="Invoices"
    height="100dvh" />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
}).catch(console.error);
```

Register `provideHttpClient()` once in your application's bootstrap providers. Add `body { margin: 0; }` to `src/styles.css`, then run `npm.cmd start` and open `http://localhost:4200`.

## 3. Supply report parameters

Bind string parameter values by their RDL parameter names:

```typescript
parameters: Record<string, string> = {InvoiceId: '1002'};
```

```html
<dss-report-viewer
  apiUrl="http://localhost:5000/api/reports"
  reportName="drillthrough/InvoiceDetails.rdl"
  [reportParameters]="parameters"
  height="600px" />
```

Import `DssReportViewerComponent` for the single-viewer variant. Report names are relative to `ReportRoot`; use forward slashes and omit the leading `Reports/` directory. The target report must actually use its parameters to filter data. Passing a parameter does not automatically filter a JSON dataset.

## 4. Open another report in a tab

In Report Builder choose **Textbox Properties > Action > Go to report**, then map target parameters to dataset expressions. The [invoice RDL](../api/Reports/drillthrough/Invoices.rdl) demonstrates:

```xml
<ActionInfo>
  <Actions>
    <Action>
      <Drillthrough>
        <ReportName>InvoiceDetails</ReportName>
        <Parameters>
          <Parameter Name="InvoiceId">
            <Value>=Fields!InvoiceId.Value</Value>
          </Parameter>
        </Parameters>
      </Drillthrough>
    </Action>
  </Actions>
</ActionInfo>
```

`DssReportTabsComponent` opens the target with the clicked row's parameters. The source viewer stays mounted. Repeated clicks on the same report and parameters reuse its tab. Set `[reuseReportTabs]="false"` for a new tab on every click.

To use your application's existing tabs, handle `(reportAction)` on `DssReportViewerComponent`. The `ReportDrillthroughAction` payload includes `reportName`, `parameters`, `sourceReportName`, `itemId`, `itemName`, and `text`. See the [report tab sample component](../web/src/app/reports/report-tabs-demo.component.ts).

## 5. Open an Angular form in a modal

Use **Action > Go to URL** with a dataset-based route such as `/forms/invoice/1002?firmId=2`. Register a `ReportUrlActionRoute` for `/forms/invoice/:id`, providing your Angular component and an input mapping. URL-encode dataset values when constructing query strings.

The complete implementation is in [textbox-actions-report.component.ts](../web/src/app/reports/textbox-actions-report.component.ts), its [Angular form](../web/src/app/reports/invoice-action-form.component.ts), and [TextboxActions.rdl](../api/Reports/TextboxActions.rdl). The sample uses both modal and report-tab actions together.

## Explore and troubleshoot

- Every sample route has **Preview** and **Code** tabs with copy/download controls.
- If the viewer cannot connect, check the API port and CORS origin.
- If a template is missing, check `ReportRoot` and the relative report name.
- If data is missing, check dataset names and `ReportDataFiles` mappings.
- Charts, gauges, and maps in this sample use Windows rendering.
- Reporting binaries are proprietary and free to use under their package licenses. The sample source has its own [license](../LICENSE.txt).

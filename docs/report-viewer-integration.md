# Integrating the samples

Start with the [repository README](../README.md) for installation, runnable components, and package availability.

## Minimal ASP.NET Core host

```csharp
using Dss.Reporting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDssReporting();
builder.Services.AddCors(options => options.AddPolicy("web", policy =>
    policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
          .AllowAnyHeader().AllowAnyMethod()
          .WithExposedHeaders("X-Report-Warnings")));
var app = builder.Build();
app.UseCors("web");
app.MapControllers();
app.Run();
```

The real [Program.cs](../api/Program.cs) also reads `Cors:Origins` from configuration. Run on the same port configured in [app.config.json](../web/public/app.config.json). No SQL connection is needed: the sample maps `TextboxActions` to the fictional `textbox_actions_demo.json` fixture.

## Angular providers

Register `provideHttpClient()` and `provideRouter(routes)` once. The sample loads `reportApiUrl` from `app.config.json` and provides a `REPORT_API_URL` injection token; see [app.config.ts](../web/src/app/app.config.ts). Keep credentials out of that public file.

| Integration | Source | Behavior |
| --- | --- | --- |
| Single report | [report-viewer-demo.component.ts](../web/src/app/reports/report-viewer-demo.component.ts) | `DssReportViewerComponent` binds `apiUrl`, `reportName`, and `reportParameters`; change invoice and apply. |
| Multiple reports | [report-tabs-demo.component.ts](../web/src/app/reports/report-tabs-demo.component.ts) | `DssReportTabsComponent` starts at Invoices and opens RDL drillthrough targets in tabs. |
| Currency and images | [report-builder-demo.component.ts](../web/src/app/reports/report-builder-demo.component.ts) | Shared helper expressions with editable options, currency dropdown, and split parameter/preview panels. |

A standalone viewer does not create report tabs: subscribe to `reportAction` if your application wants to navigate. The tabs wrapper handles that output for you. URL actions are separate: the Symbols actions example registers `urlActionRoutes` to display its host-owned [invoice form](../web/src/app/reports/invoice-action-form.component.ts). That form changes local demo state only.

## Reports and parameters

Use report names relative to the configured `ReportRoot`, for example `drillthrough/InvoiceDetails.rdl`. Pass parameter names exactly as declared in the report. In Angular, replace the parameters object when values change:

```ts
this.parameters = {InvoiceId: selectedInvoiceId};
```

The sample's source tabs include report templates, JSON data, and API configuration. They do not include library implementation files, synthetic SQL placeholders, or production connection strings.

## Symbols

See [the Symbols guide](report-builder-guide.md) for assembly references, optional QR/barcode arguments, currency wording and base64 images. The new helpers require compatible updated engine/Symbols assemblies; the README explains published-package pins and the optional engine-source build.

## Troubleshooting

- HTTP status 0: ensure the API is running, `reportApiUrl` points to its listening port, and CORS allows the exact web origin. Use HTTPS for the API when serving the web app over HTTPS.
- Missing report: verify the relative report path under `api/Reports` and deploy the target RDLs as well as the source.
- Missing data: match report dataset names to `report-query-map.json`; `CustomerSummary` and the Symbols demos are static and need no data map.
- Unsupported helper expression: deploy a reporting engine and Symbols version that implements that helper; changing report Code alone does not update the native evaluator.
- Invisible report scrolling: keep a definite viewer height. The sample uses a constrained flex/grid parent and independently scrolling preview.

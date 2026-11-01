# Integrate DSS ReportViewer

For full documentation and live examples, visit [rdlReports.dsserp.in](https://rdlReports.dsserp.in).

Use [Bagojikop.Dss.Reporting.AspNetCore on NuGet](https://www.nuget.org/packages/Bagojikop.Dss.Reporting.AspNetCore) for the API and [@bagojikop/report-viewer on npm](https://www.npmjs.com/package/@bagojikop/report-viewer) for Angular. Runnable examples are in the [public samples](https://github.com/bagojikop/dss-report-viewer-samples).

**The unified query-map configuration below requires ASP.NET Core package 0.1.23 or later.** Version 0.1.22 and earlier do not support `jsonFile` in the map or the built-in SQL provider. Before 0.1.23 is published, install the locally built package from your artifacts feed.

## Report types and features

Examples cover tables, invoices, matrices, document maps, drilldown, nested tablixes, subreports, charts, gauges, maps, KPIs, data bars, sparklines, and indicators. Go to report opens another report with parameters; Go to URL can open a registered Angular form in a modal. Compatibility is partial; validate your templates and exports. Charts, gauges, and maps in the examples require a Windows API host.

## 1. Create the .NET 9 API

```powershell
dotnet new web -n MyReportApi -f net9.0
cd MyReportApi
dotnet add package Bagojikop.Dss.Reporting.AspNetCore --version 0.1.23
```

The Symbols package installs as a dependency. Package IDs use `Bagojikop.Dss`; namespaces use `Dss.Reporting`.

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

`AddDssReporting()` registers the built-in `ReportQueryDataProvider` and the report controllers. It supports JSON, SQL files, and stored procedures without an additional provider registration.

## 2. Common settings: shared roots and connections only

Merge this into your API's `appsettings.json`:

```json
{
  "ReportRoot": "Reports",
  "ReportDataRoot": "Data",
  "ReportSqlRoot": "Sql"
}
```

Paths are relative to the API content root; absolute roots are also supported. Keep credentials in server configuration or a secret store. **Do not duplicate dataset mappings in `ReportDataFiles`. No `UseSqlReportData` switch is required.**

### What each root path means

| Setting | Files located here | Example |
| --- | --- | --- |
| `ReportRoot` | Physical RDL/RDLC report templates | `Reports/sales/Invoice.rdl` |
| `ReportDataRoot` | JSON dataset files selected by `jsonFile` | `Data/invoice.json` |
| `ReportSqlRoot` | SQL scripts selected by `sqlFile` | `Sql/InvoiceReport.sql` |

These are API server folder paths. Relative values start at the API content root, usually the folder containing appsettings.json; absolute roots also work. For `reportName="sales/Invoice.rdl"`, omit the ReportRoot prefix. The map's `jsonFile: "invoice.json"` reads under ReportDataRoot, and `sqlFile: "InvoiceReport.sql"` reads under ReportSqlRoot. Stored-procedure commands do not need a loose SQL file.

### Embedded RDL/RDLC templates and namespaces

When templates are embedded in an assembly, configure the **resource namespace**, independently of ReportRoot:

```json
{
  "ReportRoot": "Reports",
  "ReportDataRoot": "Data",
  "ReportSqlRoot": "Sql",
  "EmbeddedSourceNamespaces": [
    "dss_hrm_reporting_engine.Reporting.Reports"
  ]
}
```

Set the templates' Build Action to **Embedded Resource**. Explicit logical names avoid ambiguity:

```xml
<ItemGroup>
  <EmbeddedResource Include="Reporting/Reports/Invoice.rdl"
    LogicalName="dss_hrm_reporting_engine.Reporting.Reports.Invoice.rdl" />
  <EmbeddedResource Include="Reporting/Reports/Employee.rdlc"
    LogicalName="dss_hrm_reporting_engine.Reporting.Reports.Employee.rdlc" />
</ItemGroup>
```

| Value | Example |
| --- | --- |
| Resource namespace in settings | `dss_hrm_reporting_engine.Reporting.Reports` |
| Full resource name compiled into the assembly | `dss_hrm_reporting_engine.Reporting.Reports.Invoice.rdl` |
| Report name used in Angular and query-map keys | `Invoice.rdl` |

For a separate DLL, deploy it and explicitly include its assembly name:

```json
{
  "EmbeddedSourceNamespaces": [
    "dss_hrm_reporting_engine.Reporting.Reports, dss_hrm_reporting_engine"
  ]
}
```

The part after the comma is the assembly name without `.dll`, which may differ from the namespace. Replace it with your actual assembly name. A namespace-only entry searches loaded assemblies and the API host assembly. Inspect `typeof(Program).Assembly.GetManifestResourceNames()` in the assembly containing the templates to confirm the resource names.

Namespace/resource matching is case sensitive. Nested resources such as `dss_hrm_reporting_engine.Reporting.Reports.sales.Invoice.rdl` become `sales/Invoice.rdl`. Namespace entries are searched in array order. Physical files under ReportRoot take precedence, followed by explicit EmbeddedReports mappings, then namespace discovery. Embedded templates are read-only; saving XML creates a file override under ReportRoot.

Embedded report templates still use the same dataset query map. `EmbeddedSourceNamespaces` locates RDL/RDLC templates; `EmbeddedSqlSources` locates embedded SQL scripts. JSON data stays under ReportDataRoot.

## 3. One report-query-map.json for every dataset

Create **`report-query-map.json`** alongside `appsettings.json`. That exact filename is read by the provider; `report-query.api.json` is not read. The map connects report names to query sets and each report dataset to one source:

```text
Report name -> query-set key -> dataset name -> jsonFile / sqlFile / storedProcedure
```

This is a complete JSON-backed example:

```json
{
  "reports": {
    "sales/Invoice.rdl": "invoice"
  },
  "querySets": {
    "invoice": {
      "DataSet1": {
        "jsonFile": "invoice.json"
      }
    }
  }
}
```

Place the report at `Reports/sales/Invoice.rdl` and its data at `Data/invoice.json`. The RDL must declare `DataSet1` with fields matching the JSON properties:

```json
[
  { "InvoiceId": 1002, "InvoiceNo": "DEMO-INV-002", "Amount": 1250.50 }
]
```

One JSON object or an array of objects is accepted. JSON uses no SQL connection. Report parameters do not automatically filter JSON; use report/group filters or a custom provider.

| Field | Purpose |
| --- | --- |
| `reports` | Full report path relative to ReportRoot, including .rdl/.rdlc extension, mapped to a query-set key. Report-name matching ignores case. |
| `querySets` | Reusable groups of dataset definitions; `invoice` must match the selected value in `reports`. |
| `DataSet1` | Exact dataset name inside the RDL. Every dataset in a mapped report needs an entry. |
| `jsonFile` | JSON filename under ReportDataRoot. No duplicate appsettings mapping is needed. |
| `sqlFile` | SQL file under ReportSqlRoot, or a configured embedded SQL resource. |
| `storedProcedure` | Existing SQL Server procedure name, without EXEC. |
| `parameters` | SQL parameter definitions; keys omit the @ prefix. |
| `timeoutSeconds` | SQL command timeout, 1 through 300 seconds; defaults to 30. |

Configure **exactly one** of `jsonFile`, `sqlFile`, or `storedProcedure` per dataset. One report may mix different source types across its datasets. Keep all reports in one map; do not deploy separate map filenames for JSON, SQL, and procedures.

## 4. SQL-file alternative

Add the server's database connection in API configuration:

```json
{
  "ConnectionStrings": {
    "Reporting": "Server=YOUR_SERVER;Database=YOUR_DATABASE;Integrated Security=True;Encrypt=True"
  }
}
```

Create `Sql/InvoiceReport.sql` in your API. Adapt this example table and columns to your database:

```sql
SELECT InvoiceId, InvoiceNo, Amount
FROM dbo.Invoices
WHERE InvoiceId = @invoice_id;
```

Replace `DataSet1` inside `querySets.invoice` with:

```json
"DataSet1": {
  "sqlFile": "InvoiceReport.sql",
  "timeoutSeconds": 30,
  "parameters": {
    "invoice_id": { "type": "Int64", "source": "InvoiceId", "required": true }
  }
}
```

Declare the report parameter `InvoiceId` in the RDL. The provider binds its value as `@invoice_id`, without text substitution. Column aliases must match the RDL dataset's `DataField` values. SQL paths must remain inside ReportSqlRoot; path traversal and symbolic links within it are rejected.

### Optional embedded SQL

Loose SQL files are supported directly. To use compiled SQL resources instead, mark the files as EmbeddedResource and configure resource namespaces and assembly names:

```xml
<ItemGroup>
  <EmbeddedResource Include="Sql/InvoiceReport.sql"
                    LogicalName="MyReportApi.Sql.InvoiceReport.sql" />
</ItemGroup>
```

```json
{
  "EmbeddedSqlSources": [ "MyReportApi.Sql, MyReportApi" ]
}
```

For the engine repository's existing queries assembly, use `Dss.Reporting.Queries.Sql, Dss.Reporting.Queries` and deploy that assembly. A loose file under ReportSqlRoot takes precedence over embedded sources. Embedded resource names are case sensitive; changing them requires rebuilding and deploying their assembly.

## 5. Stored-procedure alternative

Create the procedure in your database through your normal database deployment process:

```sql
CREATE OR ALTER PROCEDURE dbo.GetInvoiceReport
    @invoice_id bigint
AS
BEGIN
    SET NOCOUNT ON;
    SELECT InvoiceId, InvoiceNo, Amount
    FROM dbo.Invoices
    WHERE InvoiceId = @invoice_id;
END;
```

Replace the dataset entry with:

```json
"DataSet1": {
  "storedProcedure": "dbo.GetInvoiceReport",
  "parameters": {
    "invoice_id": { "type": "Int64", "source": "InvoiceId", "required": true }
  }
}
```

The key is `storedProcedure`, not `SqlProcedure`. The procedure must already exist and the API identity must have permission to execute it. Return one result set per dataset command. For multiple RDL datasets, configure a command for each. Procedures need no loose SQL file.

An optional `prepareSqlFile` is allowed only with `sqlFile`; its SQL is prepended to the command and should not return another result set. Put procedure preparation inside the procedure itself. JSON datasets cannot define SQL parameter mappings or prepareSqlFile.

### Why the dataset entry is named TextboxActions

`TextboxActions` is **the dataset name declared inside the sample RDL**, not a reserved map keyword. If the report contains `<DataSet Name="TextboxActions">`, use `TextboxActions` as the dataset key in its query set. If your report declares `DataSet1` or `InvoiceLines`, use that exact name instead.

```json
{
  "querySets": {
    "invoice": {
      "TextboxActions": {
        "jsonFile": "textbox_actions_demo.json"
      }
    }
  }
}
```

Here `invoice` is your query-set grouping key, `TextboxActions` is the RDL dataset name, and `textbox_actions_demo.json` is the data filename. They do not have to match one another. A tablix binds to its intended dataset. The dataset's name does not enable actions; Go to report and Go to URL are configured in the RDL and handled by the viewer.

### When to use prepareSqlFile

`prepareSqlFile` is optional setup SQL prepended to a dataset's main `sqlFile`. Use it when the main query depends on a preparation step, such as resolving the invoice's company before running a reusable company-information query. Omit it when one SQL file is sufficient.

Example dataset entry, assuming the report declares `CompanyInfo` and the report parameter `InvoiceId`:

```json
{
  "CompanyInfo": {
    "prepareSqlFile": "ResolveInvoiceCompany.sql",
    "sqlFile": "CompanyInfo.sql",
    "parameters": {
      "invoice_id": {
        "type": "Int64",
        "source": "InvoiceId",
        "required": true
      }
    }
  }
}
```

`Sql/ResolveInvoiceCompany.sql` (adapt the example schema):

```sql
-- Example schema: adapt dbo.Invoices and CompanyId to your database.
DECLARE @ResolvedCompanyId int;
SELECT @ResolvedCompanyId = CompanyId
FROM dbo.Invoices
WHERE InvoiceId = @invoice_id;

IF @ResolvedCompanyId IS NULL
    THROW 50001, 'Invoice company was not found.', 1;
```

`Sql/CompanyInfo.sql`:

```sql
-- Runs immediately after ResolveInvoiceCompany.sql in the same SQL batch.
SELECT CompanyId, CompanyName
FROM dbo.Companies
WHERE CompanyId = @ResolvedCompanyId;
```

The provider sends preparation SQL plus a newline plus the main SQL as **one command in the same batch**, with the same bound parameters and timeout. Declared variables are available to the main query. Preparation should not produce a separate result set; the main SQL returns the dataset rows. Do not add `GO`, which is a client batch separator and is not executed by the provider.

Preparation applies only to this dataset command, not to the whole report. Both files resolve under ReportSqlRoot or through EmbeddedSqlSources. `prepareSqlFile` is supported only with `sqlFile`; JSON and stored-procedure entries reject it. Put procedure setup inside the stored procedure.

## 6. Typed SQL parameters

`source` reads a report parameter; if omitted, it uses the configured SQL parameter name. `defaultValue` supplies a fallback string for missing/blank input. Otherwise optional missing values become SQL NULL. `required: true` rejects missing input without a usable default. RDL defaults resolved by the engine are available to the provider.

Supported types: Int16, Int32, Int64, Decimal, Double, Boolean, Date, DateTime, String, and Guid. Boolean accepts true/false/1/0. Use unambiguous dates such as `2026-10-01`. Declare every SQL parameter used in the query; unrelated incoming values are not passed to it. A configured NULL argument does not invoke a procedure parameter's database default; handle NULL in the procedure or use defaultValue.

## 7. Angular viewer and parameters

Use Angular 22. Install the viewer in your app:

```powershell
npm.cmd install @bagojikop/report-viewer
```

Register `provideHttpClient()` in your application providers and import `DssReportViewerComponent` in your standalone component. Set:

```typescript
parameters: Record<string, string> = { InvoiceId: '1002' };
```

```html
<dss-report-viewer
  [apiUrl]="apiUrl"
  reportName="sales/Invoice.rdl"
  [reportParameters]="parameters"
  height="700px" />
```

The same viewer bindings work for all three sources. Values must use RDL parameter names. Replace the parameters object to reload, for example `this.parameters = {...this.parameters, InvoiceId: '1003'};`.

This website loads `reportApiUrl` from `public/aa.config.json` before bootstrapping Angular:

```json
{ "reportApiUrl": "http://localhost:5000/api/reports" }
```

Use the Getting Started Web example for the complete bootstrap implementation in a separate consuming app. After deployment, edit aa.config.json beside index.html and reload; no rebuild is needed. Use `/api/reports` for a shared origin, or the complete HTTPS endpoint for separate domains. This file is public: do not put credentials in it.

## Report Builder: symbols and action screenshots

See the [illustrated Report Builder guide](https://github.com/bagojikop/dss-report-viewer-samples/blob/main/docs/report-builder-guide.md) for Dss.Reporting.Symbols installation, QR/barcode expressions, image MIME types, Go to report parameters, Go to URL expressions, and Angular host wiring. The website includes the same guide and a working Symbols and actions example.

## 8. API requests and report actions

| Request | Purpose |
| --- | --- |
| GET /api/reports | List report templates |
| GET /api/reports/definition/sales/Invoice.rdl | Inspect metadata and parameters |
| POST /api/reports/render/sales/Invoice.rdl | Load mapped datasets and render |
| POST /api/reports/pdf/sales/Invoice.rdl | Load mapped datasets and export PDF |

```json
{ "parameters": { "InvoiceId": "1002" }, "layout": "paginated" }
```

There is no raw `/datasets` endpoint. Preview, printing, exports, and delivery use the configured provider. Report names are relative to ReportRoot; use forward slashes and omit the Reports directory prefix.

Use `DssReportTabsComponent` for Go to report actions, or handle `(reportAction)` in your own tab host. Configure `[urlActionRoutes]` or handle `(urlAction)` to open Angular forms through Go to URL. Templates and host mappings are available in the public samples.

## Share report documents

Open **Common Settings > Share Documents** in the website for Send-button setup, Share Settings, Email/WhatsApp/RCS delivery, SMTP, draft mode, supported attachments, API requests, and protected settings storage. See the [complete sharing guide](https://github.com/bagojikop/dss-report-viewer-samples/blob/main/docs/share-documents.md). Enable showSend in your host; the default is false. No messages are sent automatically by opening the documentation.

## 9. Publish and deploy

Add these rules to your API project:

```xml
<ItemGroup>
  <None Update="Reports/**/*.rdl;Reports/**/*.rdlc"
        CopyToOutputDirectory="PreserveNewest" CopyToPublishDirectory="PreserveNewest" />
  <Content Update="Data/**/*.json;report-query-map.json"
           CopyToOutputDirectory="PreserveNewest" CopyToPublishDirectory="PreserveNewest" />
  <None Update="Sql/**/*.sql"
        CopyToOutputDirectory="PreserveNewest" CopyToPublishDirectory="PreserveNewest" />
</ItemGroup>
```

```powershell
# In your API:
dotnet publish -c Release -o ./publish
# In your Angular app:
npx.cmd ng build -c production
```

Deploy the API publish folder to a .NET 9 host. Deploy the frontend's browser output, set its API address, and configure the web host to serve index.html for Angular application routes. Use the correct base href when hosting under a subfolder. Configure CORS for the frontend's exact origin when using separate domains. Authentication, authorization, and dataset access remain your host application's responsibility.

Map edits are loaded on each request. Procedures require database deployment; compiled SQL requires rebuilding its assembly. Loose SQL files and JSON data must be included in the deployed API content root or configured roots.

## Compatibility and troubleshooting

Older ReportDataFiles configurations remain a fallback when no map exists, or when a report is unmapped and all requested legacy mappings exist. A mapped report always uses its map entries, even if conflicting legacy settings exist. Missing mapped datasets, malformed JSON, and multiple sources per dataset produce errors. If no map and no legacy mapping exist, loading fails with a missing JSON configuration error. Reports with no datasets do not require a map.

When a report is empty, verify its dataset names, DataField values, parameters, and report filters. When SQL fails, check the API logs, connection configuration, table/procedure names, and database permissions. JSON-only maps do not connect to SQL Server.

## Disclaimer and support

This is independent software, not an official Microsoft product and not affiliated with, endorsed by, or supported by Microsoft. Use at your own risk. Before production, validate report data, calculations, actions, printing, and exports in your own environment. Support responses and fixes are not guaranteed. Responsibility limitations are subject to applicable law and the package license.

For issues, share anonymized sample data, the affected RDL/RDLC and subreports, parameter values, reproduction steps, and relevant errors. Remove credentials and sensitive information before sharing.

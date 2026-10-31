# DSS Report Viewer Samples

A standalone sample website for the published DSS reporting packages. It contains **sample application source and fictional data only**. The report engine, QR/barcode implementation and Angular viewer library source are not included.

**[ReportViewer integration guide](docs/report-viewer-integration.md)** ? API setup, Angular installation, parameters, report tabs, and modal actions.

## Packages

- npm: `@bagojikop/report-viewer` **0.1.14**
- NuGet: `Bagojikop.Dss.Reporting.AspNetCore` **0.1.20**
- NuGet dependency: `Bagojikop.Dss.Reporting.Symbols` **1.0.3**

## Run locally

Use Windows for the chart, gauge and map examples. Install the .NET 9 SDK and Node.js 24.15+ (24.x). Commands below use PowerShell; `npm.cmd` avoids PowerShell script policy issues.

Clone this repository, then open two terminals at its root.

API:

```powershell
dotnet restore api
dotnet run --project api --urls http://localhost:5000
```

Web:

```powershell
cd web
npm.cmd ci
npm.cmd start
```

Open **http://localhost:4200**. The documentation home explains the API and web setup. Choose an example from the sidebar and switch between **Preview** and **Code**. Code can be copied or downloaded.

## Examples

| Example | What to try |
| --- | --- |
| Report tabs | Click an invoice number to open a report in a new tab with dataset parameters. Click its customer action for a second drillthrough. |
| Textbox actions | Click the invoice number to open an Angular modal. Click the customer name to open a report tab. |
| Charts | Select from 54 generated chart definitions using fictional category/series values. |
| Gauges and maps | Select from 15 generated gauge, indicator, sparkline, data bar and map examples. |

The modal saves form state only; it never writes back to the sample JSON. API data comes from the seven JSON fixtures in `api/Data`. There is no SQL connection configuration or SQL provider in this repository.

## Structure

```text
api/
  Program.cs                 Minimal consuming API host
  ReportViewer.SampleApi.csproj  Published NuGet dependency
  appsettings.json           Sample dataset mappings only
  Reports/                   Generated example templates
  Data/                      Fictional fixtures only
web/
  src/app/docs/              Getting-started website
  src/app/reports/           Angular integration examples
  scripts/                   Generates the Code tab catalog
```

Build checks:

```powershell
dotnet build api
cd web
npm.cmd run build
```

`npm start` and `npm run build` generate a lazy source catalog from this repository's sample files. No engine source is fetched or included. `api` uses only a NuGet PackageReference and `web` uses only the published npm package, with no local library path aliases.

Report names are relative to `api/Reports`. Dataset mappings must match the dataset names in the RDL. Include the sample Reports and Data folders when deploying the API. For development CORS allows localhost:4200; configure your own origin and host authentication before deploying an application.

## License

See [LICENSE.txt](LICENSE.txt) for sample source permissions. The reporting libraries remain proprietary and free to use under the licenses in their packages. Third-party dependencies retain their own licenses.

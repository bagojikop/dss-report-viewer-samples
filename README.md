# DSS Reporting integration samples

A small Angular + ASP.NET Core application demonstrating **Report Viewer**, **Report Tabs**, and **Dss.Reporting.Symbols**. It contains consuming application code, report templates, and fictional invoice data. Engine and viewer library implementations are not included.

## Run

Prerequisites: .NET 9 SDK and Node.js 24.15+ (24.x).

From the repository root, run the API in one terminal:

```powershell
dotnet restore api
dotnet run --project api --urls http://localhost:5000
```

Run the web app in another terminal:

```powershell
cd web
npm.cmd ci
npm.cmd start
```

Open **http://localhost:4200**. Select one of the three examples. **Web**, **Data**, and **RDL** tabs show the files used by that example, with copy/download controls.

The API address comes from [`web/public/app.config.json`](web/public/app.config.json):

```json
{"reportApiUrl":"http://localhost:5000/api/reports"}
```

If the browser reports HTTP status 0, check that this address responds and that `Cors:Origins` includes your web origin. The sample allows localhost:4200 and 127.0.0.1:4200. Report names are relative to `api/Reports`.

## 1. Report Viewer

Open **Report Viewer**, choose invoice 1001, 1002, or 1003, and select **Apply parameters**.

Source: [`report-viewer-demo.component.ts`](web/src/app/reports/report-viewer-demo.component.ts).

```ts
import {Component} from '@angular/core';
import {DssReportViewerComponent} from '@bagojikop/report-viewer';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [DssReportViewerComponent],
  template: `<dss-report-viewer
    [apiUrl]="apiUrl"
    reportName="drillthrough/InvoiceDetails.rdl"
    [reportParameters]="parameters"
    height="700px" />`,
})
export class InvoiceComponent {
  apiUrl = 'http://localhost:5000/api/reports';
  parameters: Record<string, string> = {InvoiceId: '1002'};
}
```

Register `provideHttpClient()` once in your Angular application providers. The sample injects the API address using `REPORT_API_URL`; it is loaded before bootstrap in [`app.config.ts`](web/src/app/app.config.ts). Replace the parameters object when the selection changes. A standalone viewer displays one report; handle its `reportAction` output yourself if you want custom drillthrough navigation.

## 2. Report Tabs

Open **Report Tabs**. Click an invoice number to open `InvoiceDetails` in a new tab with its `InvoiceId`. The target's customer action opens `CustomerSummary` in another tab. The wrapper manages tab activation and closing.

Source: [`report-tabs-demo.component.ts`](web/src/app/reports/report-tabs-demo.component.ts).

```ts
import {Component} from '@angular/core';
import {DssReportTabsComponent} from '@bagojikop/report-viewer';

@Component({
  selector: 'app-invoice-tabs',
  standalone: true,
  imports: [DssReportTabsComponent],
  template: `<dss-report-tabs
    [apiUrl]="apiUrl"
    reportName="drillthrough/Invoices.rdl"
    rootTabTitle="Invoices"
    height="700px" />`,
})
export class InvoiceTabsComponent {
  apiUrl = 'http://localhost:5000/api/reports';
}
```

Copy the source and target RDLs from [`api/Reports/drillthrough`](api/Reports/drillthrough). Report actions, target names and parameter mappings are stored in the RDL. Dataset-to-JSON mappings are in [`api/report-query-map.json`](api/report-query-map.json).

## 3. Dss.Reporting.Symbols

Open **Dss.Reporting.Symbols**. Parameters are on the left and the report preview is on the right. Choose a currency, QR settings, barcode settings, or base64 image and select **Apply**. The example selector also includes the original QR/barcode report with drillthrough and an Angular modal action.

Source: [`report-builder-demo.component.ts`](web/src/app/reports/report-builder-demo.component.ts). Report: [`SymbolOptions.rdl`](api/Reports/docs/SymbolOptions.rdl). See the [Symbols authoring guide](docs/report-builder-guide.md) for complete wrappers and Report Builder screenshots.

```csharp
using Dss.Reporting.Symbols;

// English words; currency-specific precision and INR lakh/crore grouping.
string amount = CurrencyWords.CurrencyInWord(123456.50m, "INR");
// One Lakh Twenty Three Thousand Four Hundred Fifty Six Rupees and Fifty Paise Only

byte[] qr = SymbolImages.GenerateQRCode("INV-1002", "H", 8, true);
byte[] barcode = SymbolImages.GenerateBarcode("1002", 640, 120, 24, "CODE128");
byte[] code39 = SymbolImages.GenerateCode39Barcode("ABC-1002");
byte[] logo = SymbolImages.Base64ToImage(base64OrImageDataUri);
```

Report expressions use the wrappers under Report Properties ? Code:

```vb
=Code.CurrencyInWord(123456.50, "INR")
=Code.GenerateQRCode("INV-1002", "H", 8, True)
=Code.GenerateBarcode("1002", 640, 120, 24, "CODE128")
=Code.Base64ToImage(Parameters!ImageBase64.Value)
```

QR defaults: ECC M, 4 pixels/module, quiet zones enabled. Barcode defaults: automatic width, height 80, margin 12, Code128 (Code39 for its helper). Value-only calls keep those defaults. Images use Database source: PNG MIME type for QR and BMP for barcodes. Base64 images retain their original format. Currency wording supports 165 ISO codes in English.

### Package availability and engine source builds

The sample pins `@bagojikop/report-viewer` 0.1.14 and `Bagojikop.Dss.Reporting.AspNetCore` 0.1.23. The latter brings `Bagojikop.Dss.Reporting.Symbols` transitively. These pins support the basic viewer/tabs example; **the new currency, configurable-image, and Base64ToImage helpers are source updates and require the corresponding updated engine and Symbols DLL**. This repository does not claim that the old published packages include those additions.

In the combined engine source checkout, run the sample against the current projects explicitly:

```powershell
dotnet run --project sample-repositories/dss-report-viewer-samples/api -p:UseLocalDssReporting=true --urls http://localhost:5000
```

A standalone GitHub clone uses packages by default. Update its package references when the corresponding new packages are published, or supply the compatible updated assemblies. `UseLocalDssReporting=true` requires the engine source at the relative path in the sample project file; it is not a standalone-clone setup step.

## API integration

[`api/Program.cs`](api/Program.cs) is the minimal host: register `AddDssReporting()`, allow your web origin through CORS, and call `MapControllers()`. Copy `Reports`, `Data`, and `report-query-map.json` with the application when deploying. No SQL database or company credentials are required.

See [integration details](docs/report-viewer-integration.md) for provider setup, component inputs, and action differences.

## Validate

```powershell
dotnet build api
cd web
npm.cmd ci
npm.cmd run build
```

The build generates the example source catalog locally. Company pages, sharing/marketing pages, SEO/prerender scripts, unrelated chart galleries and unused fixtures have been removed from this sample. The main DSS website is maintained separately.

## License

See [LICENSE.txt](LICENSE.txt) for the sample source license. The reporting libraries retain the licenses supplied in their packages.

import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DocCodeComponent} from './doc-code.component';
@Component({selector:'app-report-builder-guide',standalone:true,imports:[RouterLink,DocCodeComponent],templateUrl:'./report-builder-guide.component.html',styleUrl:'./report-builder-guide.component.css'})
export class ReportBuilderGuideComponent {
 navigateSection(event:MouseEvent){
  const anchor=(event.target as Element)?.closest('a[href^="#"]');
  const id=anchor?.getAttribute('href')?.slice(1);
  if(id){event.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
 }

 readonly install="# ASP.NET Core already brings Symbols as a dependency.\n# To use it directly in a separate compatible host:\ndotnet add package Bagojikop.Dss.Reporting.Symbols --version 1.0.3";
 readonly assembly="<CodeModules>\n  <CodeModule>Dss.Reporting.Symbols</CodeModule>\n</CodeModules>";
 readonly wrappers="Public Function GenerateQRCode(value As String, Optional eccLevel As String = \"M\", Optional pixelsPerModule As Integer = 4, Optional drawQuietZones As Boolean = True) As Byte()\n    Return Dss.Reporting.Symbols.SymbolImages.GenerateQRCode(value, eccLevel, pixelsPerModule, drawQuietZones)\nEnd Function\n\nPublic Function StringToQR(value As String, Optional eccLevel As String = \"M\", Optional pixelsPerModule As Integer = 4, Optional drawQuietZones As Boolean = True) As Byte()\n    Return Dss.Reporting.Symbols.SymbolImages.StringToQR(value, eccLevel, pixelsPerModule, drawQuietZones)\nEnd Function\n\nPublic Function GenerateBarcode(value As String, Optional width As Integer = 0, Optional height As Integer = 80, Optional margin As Integer = 12, Optional barcodeType As String = \"CODE128\") As Byte()\n    Return Dss.Reporting.Symbols.SymbolImages.GenerateBarcode(value, width, height, margin, barcodeType)\nEnd Function\n\nPublic Function GenerateCode39Barcode(value As String, Optional width As Integer = 0, Optional height As Integer = 80, Optional margin As Integer = 12, Optional barcodeType As String = \"CODE39\") As Byte()\n    Return Dss.Reporting.Symbols.SymbolImages.GenerateCode39Barcode(value, width, height, margin, barcodeType)\nEnd Function\n\nPublic Function CurrencyInWord(amount As Decimal, currencyCode As String) As String\n    Return Dss.Reporting.Symbols.CurrencyWords.CurrencyInWord(amount, currencyCode)\nEnd Function\n\nPublic Function Base64ToImage(value As String) As Byte()\n    Return Dss.Reporting.Symbols.SymbolImages.Base64ToImage(value)\nEnd Function";
 readonly qr="=Code.GenerateQRCode(\"DSS-DEMO-1002\")";
 readonly qrField="=Code.GenerateQRCode(Fields!InvoiceNo.Value)";
 readonly qrOutside="=Code.GenerateQRCode(First(Fields!InvoiceNo.Value, \"TextboxActions\"))";
 readonly barcode="=Code.GenerateBarcode(\"1002\")";
 readonly barcodeField="=Code.GenerateBarcode(Fields!InvoiceId.Value & \"\")";
 readonly qrOptions="=Code.GenerateQRCode(Fields!SignedQRCode.Value, \"H\", 8, True)";
 readonly barcodeOptions="=Code.GenerateBarcode(Fields!AckNo.Value, 640, 120, 24, \"CODE128\")\n=Code.GenerateCode39Barcode(Fields!ProductCode.Value, 640, 100, 12)";
 readonly currencyWords="=Code.CurrencyInWord(Fields!NetAmount.Value, Fields!CurrencyCode.Value)\n=Code.CurrencyInWord(123456.50, \"INR\")";
 readonly base64Image="=Code.Base64ToImage(Fields!Logo.Value)\n=Code.Base64ToImage(Parameters!LogoBase64.Value)";
 readonly drillValue="=Parameters!InvoiceId.Value";
 readonly drillField="=Fields!InvoiceId.Value";
 readonly url="=\"/forms/invoice/\" & System.Uri.EscapeDataString(Parameters!InvoiceId.Value) & \"?firmId=2\"";
 readonly urlField="=\"/forms/invoice/\" & System.Uri.EscapeDataString(Fields!InvoiceId.Value) &\n \"?firmId=\" & System.Uri.EscapeDataString(Fields!FirmId.Value) &\n \"&customer=\" & System.Uri.EscapeDataString(Fields!CustomerName.Value)";
 readonly webTabs="import {Component, inject} from '@angular/core';\nimport {DssReportTabsComponent, ReportUrlActionRoute} from '@bagojikop/report-viewer';\nimport {REPORT_API_URL} from '../report-api.config';\nimport {InvoiceActionFormComponent} from './invoice-action-form.component';\n\n@Component({\n  selector: 'app-report-builder-demo',\n  standalone: true,\n  imports: [DssReportTabsComponent],\n  template: `<dss-report-tabs\n    [apiUrl]=\"apiUrl\"\n    reportName=\"docs/GuideDemo.rdl\"\n    [reportParameters]=\"parameters\"\n    [urlActionRoutes]=\"formRoutes\"\n    rootTabTitle=\"Symbols and actions\"\n    height=\"700px\" />`,\n})\nexport class ReportBuilderDemoComponent {\n  // Host token provided from app.config.json; see Getting Started.\n  readonly apiUrl = inject(REPORT_API_URL);\n  readonly parameters = {InvoiceId: '1002'};\n  readonly formRoutes: ReportUrlActionRoute[] = [{\n    path: '/forms/invoice/:id',\n    component: InvoiceActionFormComponent,\n    title: 'Invoice form',\n    inputs: action => ({\n      invoiceId: action.pathParams['id'],\n      firmId: action.queryParams['firmId'] ?? '',\n      customer: action.queryParams['customer'] ?? '',\n      amount: action.queryParams['amount'] ?? '',\n    }),\n  }];\n}";
 readonly formInputs="// Inputs on the host-owned InvoiceActionFormComponent:\n@Input() invoiceId = '';\n@Input() firmId = '';\n@Input() customer = '';\n@Input() amount = '';";
}

# Share report documents

> **Live delivery is not yet tested.** Source code and configuration examples are available. Checks cover viewer controls and local mocks only; real WhatsApp, RCS/SMS, Mail API, and SMTP delivery require provider-specific testing before production use.


Separate illustrated guides: [WhatsApp](share-via-whatsapp.md), [RCS / SMS](share-via-rcs.md), and [Mail](share-via-mail.md). The website lists them under **Share Reports** in the sidebar.

Open **Common Settings > Share Documents** on the website. This guide explains the viewer's Send menu and server-side document delivery. Common Settings is documentation; **Share Settings** is the viewer's runtime configuration dialog.

## 1. Enable the Send button

```html
<!-- Import DssReportViewerComponent and register HttpClient in your host. -->
<dss-report-viewer
  [apiUrl]="apiUrl"
  reportName="docs/GuideDemo.rdl"
  [reportParameters]="parameters"
  [showHeader]="true"
  [showSend]="true"
  height="700px" />

<!-- For report tabs, set the same inputs on dss-report-tabs. -->
```

`showSend` defaults to false. Send appears only when showSend is true and server sharing is enabled. Set showHeader to true to expose the account/settings icon while configuring. Report tabs accept the same inputs. Configure HttpClient and apiUrl as described in the integration guide.

When apiUrl ends in `/reports`, the viewer derives the sibling `/share-settings` endpoint, including its hosting prefix. Supply `shareSettingsUrl` explicitly for a different route.

## 2. Configure Share Settings

1. Open the viewer's account/settings icon, or Configure sharing settings from a Send dialog.
2. Enable the share option.
3. Configure required channel endpoints, methods, authorization, and headers, or SMTP for email.
4. Save settings.

Supported external API methods: POST, PUT, PATCH. Authorization: none, bearer, basic (already Base64 encoded), x-verify. URLs may be absolute HTTP(S) URLs or paths starting with `/`, resolved against the reporting API's origin.

`GET /api/share-settings` returns public settings. `PUT /api/share-settings` saves them. Example complete channel configuration:

```json
{
  "enabled": true,
  "whatsapp": {
    "url": "",
    "method": "POST",
    "authorization": "none",
    "token": "",
    "headers": []
  },
  "rcs": {
    "url": "",
    "method": "POST",
    "authorization": "none",
    "token": "",
    "headers": []
  },
  "email": {
    "url": "https://delivery.example.invalid/reports",
    "method": "POST",
    "authorization": "bearer",
    "token": "YOUR_SERVER_TOKEN",
    "headers": []
  },
  "smtpEnabled": false
}
```

Replace reserved example domains and credentials with your service details. Merge your existing channel/SMTP configuration before updating; saving settings is not a partial channel update. The server uses saved connection details, not credentials supplied in a document-send request.

## 3. SMTP email

Select Send email using SMTP in Share Settings, then enter the server, port, username/password, and sender details. Merge this section into the settings payload:

```json
{
  "smtpEnabled": true,
  "smtp": {
    "host": "smtp.example.invalid",
    "port": 587,
    "enableSsl": true,
    "username": "YOUR_SMTP_USERNAME",
    "password": "YOUR_SMTP_PASSWORD",
    "fromAddress": "reports@example.invalid",
    "fromName": "Reporting"
  }
}
```

EnableSsl uses STARTTLS, commonly on port 587. Implicit TLS on 465 is not supported here. SMTP takes precedence over the Email API when smtpEnabled is true. Verify the server accepts the configured sender and recipient.

## 4. Send or open a draft

Open a report, set its parameters, select Send, choose Email/WhatsApp/RCS/SMS, enter the recipient and message, and choose an attachment format. For configured services, use Send via API or Send via SMTP.

| Format value | File extension |
| --- | --- |
| pdf | .pdf |
| word | .docx |
| excel | .xlsx |
| csv | .csv |
| html | .html |

The attachment is regenerated from the report name and parameters. The current sharing request does not carry expanded drilldown state; viewer zoom does not affect export generation.

Without an Email API or SMTP, Email opens a mailto draft. Without a WhatsApp API, WhatsApp opens a wa.me draft; use a phone number with country code. **Download report and attach it manually.** Browser drafts do not automatically receive attachments. RCS/SMS needs an API and has no draft fallback.

## 5. Report send endpoint

POST to `/api/reports/send/docs/GuideDemo.rdl`, replacing the report path as needed:

```json
{
  "channel": "email",
  "recipient": "recipient@example.invalid",
  "apiEndpoint": "https://delivery.example.invalid/reports",
  "subject": "Invoice 1002",
  "message": "Please find the attached report.",
  "format": "pdf",
  "parameters": {
    "InvoiceId": "1002"
  }
}
```

The model includes apiEndpoint, but the controller replaces connection details with server-saved settings. Valid channels: email, whatsapp, rcs. A browser-supplied endpoint/token does not override saved configuration.

## 6. Your delivery adapter

The reporting API sends this JSON to your configured endpoint:

```json
{
  "channel": "email",
  "recipient": "recipient@example.invalid",
  "subject": "Invoice 1002",
  "message": "Please find the attached report.",
  "reportName": "docs/GuideDemo.rdl",
  "parameters": {
    "InvoiceId": "1002"
  },
  "attachment": {
    "fileName": "GuideDemo.pdf",
    "contentType": "application/pdf",
    "base64": "<base64-encoded report bytes>"
  }
}
```

Your service must accept the contract, decode the Base64 attachment, and translate it into your provider's API. Simply entering a provider URL does not translate proprietary request formats. API acceptance is not proof of final delivery; track that through the provider. Redirects are not followed. On timeout, inspect provider status before retrying to avoid duplicates.

## 7. Persistence and deployment

Settings are encrypted in `Data/share-settings.protected` under the API content root by default. `ShareSettingsDirectory` can select another server directory; this is independent of ReportDataRoot. GET redacts tokens, header values, and SMTP passwords. Blank secret inputs retain existing secrets.

Persist data-protection keys in the host:

```csharp
using Microsoft.AspNetCore.DataProtection;

// In Program.cs, before builder.Build():
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(
        Path.Combine(builder.Environment.ContentRootPath, "Data", "share-keys")))
    .SetApplicationName("Dss.Reporting");
```

When moving hosts or sharing settings across instances, preserve the settings file, data-protection keys, and application name. Protect settings and delivery routes with your application's authentication/authorization. Never put service credentials in aa.config.json, report-query-map.json, or datasets.

## Troubleshooting

- Send missing: check showSend, the server sharing toggle, and the share-settings GET response.
- Settings icon missing: enable showHeader or use Configure sharing settings inside Send.
- Draft opens instead of delivery: configure the channel API or SMTP.
- RCS/SMS disabled: configure its API endpoint and adapter.
- Service errors: inspect API logs, saved credentials, report parameters, adapter contract, and SMTP configuration.

Examples use reserved domains. Automated delivery tests use local mocks and do not contact real messaging services.

export interface PageSeo {title:string;description:string;noindex?:boolean;}
export const SEO_PAGES: Record<string,PageSeo> = {
  "/docs/getting-started": {
    "title": "Free Reporting Tool for ASP.NET Core & Angular | DSS Reporting",
    "description": "Build RDL and RDLC reports with a free-to-use .NET reporting library and Angular viewer. Follow JSON, SQL, PDF export, QR code, and deployment examples."
  },
  "/docs/common-settings": {
    "title": "Reporting API, JSON & SQL Settings | DSS Reporting",
    "description": "Configure the DSS Reporting API, Angular viewer, report paths, embedded RDL/RDLC templates, JSON datasets, SQL scripts, stored procedures, and document sharing."
  },
  "/docs/report-builder": {
    "title": "Report Builder QR Codes, Barcodes & Actions | DSS Reporting",
    "description": "Use Dss.Reporting.Symbols with QR codes and Code128 barcodes. Follow real Report Builder screenshots for Go to report and Go to URL actions."
  },
  "/docs/share/whatsapp": {
    "title": "Share Report Documents via WhatsApp | DSS Reporting",
    "description": "Set up WhatsApp report sharing with real viewer screenshots, API adapter examples, PDF attachments, and draft mode. Live delivery remains untested."
  },
  "/docs/share/rcs": {
    "title": "Share Reports via RCS and SMS | DSS Reporting",
    "description": "Configure an RCS/SMS delivery adapter for report documents with real viewer screenshots and Base64 attachment examples. Live delivery remains untested."
  },
  "/docs/share/email": {
    "title": "Email Report Attachments with SMTP or API | DSS Reporting",
    "description": "Configure report email through a Mail API or SMTP, with real screenshots, PDF and Excel attachments, and draft mode. Live delivery remains untested."
  },
  "/about-us": {
    "title": "About DSS Reporting & Dynamic Super Software",
    "description": "Learn about DSS Reporting, a free-to-use proprietary RDL/RDLC reporting library for .NET and Angular, and Dynamic Super Software in Sangli, India."
  },
  "/contact-us": {
    "title": "Contact Dynamic Super Software | DSS Reporting",
    "description": "Contact Dynamic Super Software in Sangli for DSS Reporting questions and business software enquiries. Find our email, phone, office address, and main website."
  },
  "/docs/share/preview": {
    "title": "Document Sharing Preview | DSS Reporting",
    "description": "Inspect the DSS viewer document-sharing controls. Live delivery is not yet tested.",
    "noindex": true
  },
  "/reports/report-builder": {
    "title": "QR Code, Barcode & Report Actions Demo | DSS Reporting",
    "description": "Preview working QR and Code128 symbols, report tabs, and Angular modal form actions, with downloadable RDL templates and source examples."
  }
};
export const PRERENDER_PATHS = ["/docs/getting-started", "/docs/common-settings", "/docs/report-builder", "/docs/share/whatsapp", "/docs/share/rcs", "/docs/share/email", "/about-us", "/contact-us"] as const;

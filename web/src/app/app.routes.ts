import {AboutUsComponent} from './docs/about-us.component';
import {ContactUsComponent} from './docs/contact-us.component';
import {ShareChannelGuideComponent} from './docs/share-channel-guide.component';
import {SharePreviewComponent} from './docs/share-preview.component';
import {ReportBuilderDemoComponent} from './reports/report-builder-demo.component';
import {ReportBuilderGuideComponent} from './docs/report-builder-guide.component';
import {CommonSettingsComponent} from './docs/common-settings.component';
import {Routes} from '@angular/router';
import {GettingStartedComponent} from './docs/getting-started.component';
import {ReportTabsDemoComponent} from './reports/report-tabs-demo.component';
import {TextboxActionsReportComponent} from './reports/textbox-actions-report.component';
import {ChartsReportComponent} from './reports/charts-report.component';
import {VisualsReportComponent} from './reports/visuals-report.component';
export const routes:Routes=[
 {path:'reports/report-builder',component:ReportBuilderDemoComponent,title:'Symbols and actions'},
  {path:'docs/report-builder',component:ReportBuilderGuideComponent,title:'Report Builder Guide'},
  {path:'about-us',component:AboutUsComponent,title:'About Us'},
  {path:'contact-us',component:ContactUsComponent,title:'Contact Us'},
  {path:'docs/share/whatsapp',component:ShareChannelGuideComponent,data:{channel:'whatsapp'},title:'Share via WhatsApp'},
  {path:'docs/share/rcs',component:ShareChannelGuideComponent,data:{channel:'rcs'},title:'Share via RCS / SMS'},
  {path:'docs/share/email',component:ShareChannelGuideComponent,data:{channel:'email'},title:'Share via Mail'},
  {path:'docs/share/preview',component:SharePreviewComponent,title:'Document sharing preview'},
  {path:'docs/common-settings',component:CommonSettingsComponent,title:'Common Settings'},
 {path:'',redirectTo:'docs/getting-started',pathMatch:'full'},
 {path:'docs/getting-started',component:GettingStartedComponent,title:'Getting started'},
 {path:'reports/report-tabs',component:ReportTabsDemoComponent,title:'Report tabs'},
 {path:'reports/textbox-actions',component:TextboxActionsReportComponent,title:'Textbox actions'},
 {path:'reports/charts',component:ChartsReportComponent,title:'Charts'},
 {path:'reports/visuals',component:VisualsReportComponent,title:'Gauges and maps'},
 {path:'**',redirectTo:'docs/getting-started'},
];

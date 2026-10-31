import {Routes} from '@angular/router';
import {GettingStartedComponent} from './docs/getting-started.component';
import {ReportTabsDemoComponent} from './reports/report-tabs-demo.component';
import {TextboxActionsReportComponent} from './reports/textbox-actions-report.component';
import {ChartsReportComponent} from './reports/charts-report.component';
import {VisualsReportComponent} from './reports/visuals-report.component';
export const routes:Routes=[
 {path:'',redirectTo:'docs/getting-started',pathMatch:'full'},
 {path:'docs/getting-started',component:GettingStartedComponent,title:'Getting started'},
 {path:'reports/report-tabs',component:ReportTabsDemoComponent,title:'Report tabs'},
 {path:'reports/textbox-actions',component:TextboxActionsReportComponent,title:'Textbox actions'},
 {path:'reports/charts',component:ChartsReportComponent,title:'Charts'},
 {path:'reports/visuals',component:VisualsReportComponent,title:'Gauges and maps'},
 {path:'**',redirectTo:'docs/getting-started'},
];

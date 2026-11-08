import {Routes} from '@angular/router';
import {GettingStartedComponent} from './docs/getting-started.component';
import {ReportBuilderGuideComponent} from './docs/report-builder-guide.component';
import {ReportViewerDemoComponent} from './reports/report-viewer-demo.component';
import {ReportTabsDemoComponent} from './reports/report-tabs-demo.component';
import {ReportBuilderDemoComponent} from './reports/report-builder-demo.component';

export const routes:Routes=[
 {path:'',redirectTo:'docs/getting-started',pathMatch:'full'},
 {path:'docs/getting-started',component:GettingStartedComponent,title:'Start here | DSS samples'},
 {path:'docs/report-builder',component:ReportBuilderGuideComponent,title:'Symbols guide | DSS samples'},
 {path:'reports/viewer',component:ReportViewerDemoComponent,title:'Report Viewer'},
 {path:'reports/report-tabs',component:ReportTabsDemoComponent,title:'Report Tabs'},
 {path:'reports/report-builder',component:ReportBuilderDemoComponent,title:'Dss.Reporting.Symbols'},
 {path:'reports/angular-binding',redirectTo:'reports/viewer',pathMatch:'full'},
 {path:'**',redirectTo:'docs/getting-started'},
];

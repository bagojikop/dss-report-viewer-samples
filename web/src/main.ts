import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {loadAppConfig} from './app/app.config';

loadAppConfig()
  .then(config => bootstrapApplication(AppComponent, config))
  .then(() => { document.documentElement.dataset['dssReady'] = 'true'; })
  .catch(console.error);

import {TitleStrategy} from '@angular/router';
import {ReportingSeoStrategy} from './reporting-seo.strategy';
import {ApplicationConfig} from '@angular/core';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {apiLoadingInterceptor} from './api-loading.interceptor';
import {routes} from './app.routes';
import {REPORT_API_URL} from './report-api.config';

export async function loadAppConfig(): Promise<ApplicationConfig> {
  const response = await fetch(new URL('aa.config.json', document.baseURI), {cache: 'no-store'});
  if (!response.ok) {
    throw new Error(`Could not load aa.config.json (HTTP ${response.status}).`);
  }
  const settings: unknown = await response.json();
  if (!settings || typeof settings !== 'object' ||
      !('reportApiUrl' in settings) || typeof settings.reportApiUrl !== 'string' ||
      !settings.reportApiUrl.trim()) {
    throw new Error('aa.config.json must contain a non-empty reportApiUrl string.');
  }
  return {
    providers: [
      provideHttpClient(withInterceptors([apiLoadingInterceptor])),
      provideRouter(routes),
      {provide:TitleStrategy,useClass:ReportingSeoStrategy},
      {provide: REPORT_API_URL, useValue: settings.reportApiUrl.trim().replace(/\/+$/, '')},
    ],
  };
}

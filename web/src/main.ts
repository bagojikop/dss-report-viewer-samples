import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiLoadingInterceptor } from './app/api-loading.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent,{providers:[provideHttpClient(withInterceptors([apiLoadingInterceptor])),provideRouter(routes)]}).catch(console.error);

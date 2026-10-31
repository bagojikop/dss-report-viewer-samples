import {inject} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import {defer, finalize} from 'rxjs';
import {ApiLoadingService} from './api-loading.service';

export const apiLoadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loading = inject(ApiLoadingService);
  return defer(() => {
    loading.start();
    return next(request).pipe(finalize(() => loading.finish()));
  });
};

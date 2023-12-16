import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccesstokenService } from '../../shared/services/accesstoken.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const persistenceService = inject(AccesstokenService);
  const token = persistenceService.get();
  request = request.clone({
    setHeaders: {
      Athorization: token ? `Token ${token}` : '',
    },
  });
  return next(request);
};

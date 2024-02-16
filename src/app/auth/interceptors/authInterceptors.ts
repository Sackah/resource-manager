import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccesstokenService } from '@app/shared/services/accesstoken.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const persistenceService = inject(AccesstokenService);
  const token = persistenceService.get();
  const clonedRequest = request.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return next(clonedRequest);
};

import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AccesstokenService } from '@app/shared/services/accesstoken.service';

export const AuthGuard = () => {
  const tokenService = inject(AccesstokenService);
  const router = inject(Router);

  return (route: ActivatedRouteSnapshot) => {
    const token = tokenService.get();
    const { accesstoken } = route.params;
    const mail = route.params.email;
    const { refId } = route.params;

    if (token || (accesstoken && mail && refId)) {
      return true;
    }
    router.navigateByUrl('/login');
    return false;
  };
};

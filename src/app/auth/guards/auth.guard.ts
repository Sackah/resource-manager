import { inject } from '@angular/core';
import { AccesstokenService } from '../../shared/services/accesstoken.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

export const AuthGuard = () => {
  const tokenService = inject(AccesstokenService);
  const router = inject(Router);

  return (route: ActivatedRouteSnapshot) => {
    const token = tokenService.get();
    const accesstoken = route.params['accesstoken'];
    const mail = route.params['email'];
    const userId = route.params['userId'];

    if (token || (accesstoken && mail && userId)) {
      return true;
    } else {
      router.navigateByUrl('/login');
      return false;
    }
  };
};

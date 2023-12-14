import { inject } from '@angular/core';
import { AccesstokenService } from '../../shared/services/accesstoken.service';
import { Router } from '@angular/router';

/**
 * Simple auth guard that just checks for access token
 */

export const AuthGuard = () => {
  const tokenService = inject(AccesstokenService);
  const router = inject(Router);

  const token = tokenService.get();
  if (token) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};

/**
 * Using the async CurrentUserService which tries to fetch data
 * @returns logged in user
 */
// export const AuthGuard = () => {
//   const currentUserService = inject(CurrentUserService);
//   const router = inject(Router);

//   return currentUserService.currentUser$.pipe(
//     filter((currentUser) => currentUser !== undefined),
//     map((currentUser) => {
//       if (!currentUser) {
//         router.navigateByUrl('/register');
//         return false;
//       }
//       return true;
//     })
//   );
// };

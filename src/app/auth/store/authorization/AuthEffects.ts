import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AuthActions } from './AuthActions';
import { catchError, map, switchMap, of, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AccesstokenService } from '../../../shared/services/accesstoken.service';
import { UpdateUserDetailsService } from '../../services/update-user-details.service';
import { CurrentUserService } from '../../services/current-user.service';

/**
 * Effect for logging in users
 */
export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    loginService = inject(LoginService),
    tokenService = inject(AccesstokenService)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.login),
      switchMap(userDetails => {
        return loginService.post(userDetails).pipe(
          map(response => {
            tokenService.set(response.accessToken);
            return AuthActions.loginSuccess(response);
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {
              return of(
                AuthActions.loginFailure({
                  message:
                    'Failed to send request to the server, please try again',
                  access: 'Denied',
                })
              );
            }
            return of(AuthActions.loginFailure(error.error));
          })
        );
      })
    );
  },
  { functional: true }
);

/**
 * Effect for redirecting users based on role after logging in
 */
export const redirectAfterLogin = createEffect(
  (action$ = inject(Actions), router = inject(Router)) => {
    return action$.pipe(
      ofType(AuthActions.loginSuccess),
      tap({
        next: res => {
          switch (res.user.roles) {
            case 'Basic User':
              router.navigateByUrl('/user');
              break;
            case 'Administrator':
              if (res.changePassword) {
                router.navigateByUrl('admin/account-setup');
              }
              router.navigateByUrl('/admin');
              break;
            default:
              router.navigateByUrl('/login');
              break;
          }
        },
      })
    );
  },
  { functional: true, dispatch: false }
);

/**
 * Effect for updating user data
 */
export const updateUserEffect = createEffect(
  (
    action$ = inject(Actions),
    updateUserService = inject(UpdateUserDetailsService),
    router = inject(Router)
  ) => {
    return action$.pipe(
      ofType(AuthActions.updateUserDetails),
      switchMap(userDetails => {
        return updateUserService.post(userDetails).pipe(
          map(response => {
            router.navigateByUrl('/user/dashboard');
            return AuthActions.updateUserDetailsSuccess(response);
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {
              return of(
                AuthActions.loginFailure({
                  message: 'Network error',
                  access: 'Denied',
                })
              );
            }
            return of(AuthActions.updateUserDetailsFailure(error.error));
          })
        );
      })
    );
  },
  { functional: true }
);

/**
 * Effect for relogging in a user
 */
export const relogInUserEffect = createEffect(
  (
    action$ = inject(Actions),
    relogUserService = inject(CurrentUserService),
    router = inject(Router)
  ) => {
    return action$.pipe(
      ofType(AuthActions.fetchCurrentUser),
      switchMap(() => {
        return relogUserService.get().pipe(
          map(response => {
            return AuthActions.fetchCurrentUserSuccess(response);
          }),
          catchError((error: HttpErrorResponse) => {
            // Immediately logout if there is an error
            router.navigateByUrl('/login');

            if (error.status === 0) {
              return of(
                AuthActions.loginFailure({
                  message: 'Network error',
                  access: 'Denied',
                })
              );
            }
            return of(AuthActions.fetchCurrentUserFailure(error.error));
          })
        );
      })
    );
  },
  { functional: true }
);

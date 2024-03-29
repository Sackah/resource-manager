import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthActions } from './AuthActions';
import { LoginService } from '../../services/login.service';
import { AccesstokenService } from '../../../shared/services/accesstoken.service';
import { UpdateUserDetailsService } from '../../services/update-user-details.service';
import { CurrentUserService } from '../../services/current-user.service';
import { UpdatePasswordService } from '../../services/update-password.service';
import { AccountSetupService } from '../../../accounts/user/services/account-setup.service';

export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    loginService = inject(LoginService),
    tokenService = inject(AccesstokenService)
  ) =>
    actions$.pipe(
      ofType(AuthActions.login),
      switchMap(userDetails =>
        loginService.post(userDetails).pipe(
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
        )
      )
    ),
  { functional: true }
);

export const redirectAfterLogin = createEffect(
  (action$ = inject(Actions), router = inject(Router)) =>
    action$.pipe(
      ofType(AuthActions.loginSuccess),
      tap({
        next: res => {
          switch (res.user.role) {
            case 'Basic User':
              router.navigateByUrl('/user/dashboard');
              break;
            case 'Manager':
              router.navigateByUrl('/manager/dashboard');
              break;
            case 'Administrator':
              if (res.user.changePassword) {
                router.navigateByUrl('/admin/account-setup');
              } else {
                router.navigateByUrl('/admin/dashboard');
              }
              break;
            default:
              router.navigateByUrl('/login');
              break;
          }
        },
      })
    ),
  { functional: true, dispatch: false }
);

export const relogInUserEffect = createEffect(
  (
    action$ = inject(Actions),
    relogUserService = inject(CurrentUserService),
    router = inject(Router),
    tokenService = inject(AccesstokenService)
  ) =>
    action$.pipe(
      ofType(AuthActions.fetchCurrentUser),
      switchMap(() =>
        relogUserService.get().pipe(
          map(response => AuthActions.fetchCurrentUserSuccess(response)),
          catchError((error: HttpErrorResponse) => {
            router.navigateByUrl('/login');

            if (error.status === 0) {
              return of(
                AuthActions.loginFailure({
                  message: 'Network error',
                  access: 'Denied',
                })
              );
            }
            tokenService.clear('lastRoute');
            return of(AuthActions.fetchCurrentUserFailure(error.error));
          })
        )
      )
    ),
  { functional: true }
);

export const redirectAfterReLogin = createEffect(
  (
    action$ = inject(Actions),
    router = inject(Router),
    tokenService = inject(AccesstokenService)
  ) =>
    action$.pipe(
      ofType(AuthActions.fetchCurrentUserSuccess),
      tap({
        next: res => {
          const lastRoute = tokenService.get('lastRoute') as string;
          switch (res.user.role) {
            case 'Basic User':
              router.navigateByUrl(lastRoute || '/user/dashboard');
              break;
            case 'Administrator':
              if (res.user.changePassword) {
                router.navigateByUrl('/admin/account-setup');
              } else {
                router.navigateByUrl(lastRoute || '/admin/dashboard');
              }
              break;
            case 'Manager':
              router.navigateByUrl(lastRoute || '/manager/dashboard');
              break;
            default:
              router.navigateByUrl('/login');
              break;
          }
          tokenService.clear('lastRoute');
        },
      })
    ),
  { functional: true, dispatch: false }
);

export const updateUserPassword = createEffect(
  (
    action$ = inject(Actions),
    updatePasswordService = inject(UpdatePasswordService),
    setupService = inject(AccountSetupService)
  ) =>
    action$.pipe(
      ofType(AuthActions.updateUserPassword),
      switchMap(userDetails =>
        updatePasswordService.postUser(userDetails).pipe(
          map(response => {
            setupService.toggle('details');
            return AuthActions.updateUserPasswordSuccess(response);
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {
              return of(
                AuthActions.updateUserPasswordFailure({
                  message:
                    'Failed to send request to the server, please try again',
                })
              );
            }
            return of(AuthActions.updateUserPasswordFailure(error.error));
          })
        )
      )
    ),
  { functional: true }
);

export const toggleFormOrRedirect = createEffect(
  (
    action$ = inject(Actions),
    accountSetupService = inject(AccountSetupService),
    router = inject(Router)
  ) =>
    action$.pipe(
      ofType(AuthActions.updateUserPasswordSuccess),
      tap(res => {
        if (res.user.role === 'Administrator') {
          router.navigateByUrl('/admin/dashboard');
        } else {
          accountSetupService.toggle('details');
        }
      })
    ),
  { functional: true, dispatch: false }
);

export const updateUserDetailsEffect = createEffect(
  (
    action$ = inject(Actions),
    updateUserService = inject(UpdateUserDetailsService),
    router = inject(Router)
  ) =>
    action$.pipe(
      ofType(AuthActions.updateUserDetails),
      switchMap(userDetails =>
        updateUserService.post(userDetails).pipe(
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
        )
      )
    ),
  { functional: true }
);

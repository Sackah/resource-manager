import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { loginActions } from './LoginActions';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AccesstokenService } from '../../../shared/services/accesstoken.service';

export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    loginService = inject(LoginService),
    tokenService = inject(AccesstokenService)
  ) => {
    return actions$.pipe(
      ofType(loginActions.login),
      switchMap(userDetails => {
        return loginService.post(userDetails).pipe(
          map(response => {
            tokenService.set(response.accessToken);
            return loginActions.loginSuccess(response);
          }),
          catchError((error: HttpErrorResponse) => {
            return of(loginActions.loginFailure(error.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const redirectAfterLogin = createEffect(
  (action$ = inject(Actions), router = inject(Router)) => {
    return action$.pipe(
      ofType(loginActions.loginSuccess),
      tap({
        next: res => {
          switch (res.user.roles) {
            case 'Basic User':
              router.navigateByUrl('/user');
              break;
            case 'Administrator':
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

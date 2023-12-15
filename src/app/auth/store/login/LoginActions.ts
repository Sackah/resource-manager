import { createActionGroup, props } from '@ngrx/store';
import {
  AuthErrorResponse,
  LoginUserDetails,
  LoginUserResponse,
} from '../../types/types';

export const loginActions = createActionGroup({
  source: 'auth',
  events: {
    Login: props<LoginUserDetails>(),
    LoginSuccess: props<LoginUserResponse>(),
    LoginFailure: props<AuthErrorResponse>(),
  },
});

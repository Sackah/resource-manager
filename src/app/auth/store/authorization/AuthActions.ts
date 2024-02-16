import { createActionGroup, props, emptyProps } from '@ngrx/store';
import {
  AuthErrorResponse,
  LoginUserDetails,
  LoginUserResponse,
  UpdateUserDetailsError,
  UpdateUserDetailsResponse,
  UpdateUserPasswordDetails,
  UpdateUserPasswordError,
  UpdateUserPasswordResponse,
  UpdateUserDetails,
} from '../../types/auth-types';

export const AuthActions = createActionGroup({
  source: 'auth',
  events: {
    Login: props<LoginUserDetails>(),
    LoginSuccess: props<LoginUserResponse>(),
    LoginFailure: props<AuthErrorResponse>(),
    UpdateUserPassword: props<UpdateUserPasswordDetails>(),
    UpdateUserPasswordSuccess: props<UpdateUserPasswordResponse>(),
    UpdateUserPasswordFailure: props<UpdateUserPasswordError>(),
    UpdateUserDetails: props<UpdateUserDetails>(),
    UpdateUserDetailsSuccess: props<UpdateUserDetailsResponse>(),
    UpdateUserDetailsFailure: props<UpdateUserDetailsError>(),
    FetchCurrentUser: emptyProps(),
    FetchCurrentUserSuccess: props<LoginUserResponse>(),
    FetchCurrentUserFailure: props<AuthErrorResponse>(),
  },
});

import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { CurrentUser } from '../../../shared/types/types';
import {
  AuthErrorResponse,
  LoginUserDetails,
  LoginUserResponse,
  UpdateUserDetails,
  UpdateUserDetailsResponse,
} from '../../types/auth-types';

export const AuthActions = createActionGroup({
  source: 'auth',
  events: {
    Login: props<LoginUserDetails>(),
    LoginSuccess: props<LoginUserResponse>(),
    LoginFailure: props<AuthErrorResponse>(),
    UpdateUserDetails: props<UpdateUserDetails>(),
    UpdateUserDetailsSuccess: props<UpdateUserDetailsResponse>(),
    UpdateUserDetailsFailure: props<AuthErrorResponse>(),
    FetchCurrentUser: emptyProps(),
    FetchCurrentUserSuccess: props<LoginUserResponse>(),
    FetchCurrentUserFailure: props<AuthErrorResponse>(),
  },
});

import { createFeature, createReducer, on } from '@ngrx/store';
import { loginActions } from './LoginActions';
import { LoginUserState } from '../../types/types';

const initialState: LoginUserState = {
  isLoggingIn: false,
  response: undefined,
  errors: null,
};

const loginFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(loginActions.login, (state, payload) => ({
      ...state,
      isLoggingIn: true,
      errors: null,
    })),
    on(loginActions.loginSuccess, (state, payload) => ({
      ...state,
      isLoggingIn: false,
      response: payload,
    })),
    on(loginActions.loginFailure, (state, payload) => ({
      ...state,
      isLoggingIn: false,
      errors: payload,
    }))
  ),
});

export const {
  name: loginFeatureKey,
  reducer: loginReducer,
  selectIsLoggingIn,
  selectErrors,
  selectResponse,
} = loginFeature;

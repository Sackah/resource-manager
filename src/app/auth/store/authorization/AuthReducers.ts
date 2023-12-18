import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './AuthActions';
import { AuthState } from '../../types/auth-types';

const initialState: AuthState = {
  isSubmitting: false,
  response: undefined,
  errors: null,
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.login, (state, payload) => ({
      ...state,
      isSubmitting: true,
      errors: null,
    })),
    on(AuthActions.loginSuccess, (state, payload) => ({
      ...state,
      isSubmitting: false,
      response: payload,
    })),
    on(AuthActions.loginFailure, (state, payload) => ({
      ...state,
      isSubmitting: false,
      errors: payload,
    })),
    on(AuthActions.updateUserDetails, (state, payload) => ({
      ...state,
      isSubmitting: true,
      errors: null,
    })),
    on(AuthActions.updateUserDetailsSuccess, (state, payload) => ({
      ...state,
      isSubmitting: false,
      response: {
        ...payload,
      },
    })),
    on(AuthActions.updateUserDetailsFailure, (state, payload) => ({
      ...state,
      isSubmitting: false,
      errors: payload,
    })),
    on(AuthActions.fetchCurrentUser, state => ({
      ...state,
      isSubmitting: true,
      errors: null,
    })),
    on(AuthActions.fetchCurrentUserSuccess, (state, payload) => ({
      ...state,
      isSubmitting: false,
      response: payload,
    })),
    on(AuthActions.fetchCurrentUserFailure, (state, payload) => ({
      ...state,
      isLoggingIn: false,
      errors: payload,
    }))
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectErrors,
  selectResponse,
} = authFeature;

import { CurrentUser } from '../../shared/types/types';

export type LoginUserDetails = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  message: string;
  accessToken: string;
  changePassword: boolean;
  user: CurrentUser;
};

export type AuthErrorResponse = {
  message: string;
  access: string;
};

export type LoginUserState = {
  isLoggingIn: boolean;
  response: LoginUserResponse | null | undefined;
  errors: AuthErrorResponse | null;
};

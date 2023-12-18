import { CurrentUser } from '../../shared/types/types';

//Initial state of the Auth slice of state
export type AuthState = {
  isSubmitting: boolean;
  response: LoginUserResponse | UpdateUserDetailsResponse | null | undefined;
  errors: AuthErrorResponse | null;
};

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

export type UpdateUserDetails = {
  profilePicture?: File;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export interface UpdateUserDetailsResponse extends LoginUserResponse {
  status: number;
}

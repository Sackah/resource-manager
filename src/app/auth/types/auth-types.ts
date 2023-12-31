import { CurrentUser } from '../../shared/types/types';

//Initial state of the Auth slice of state
export type AuthState = {
  isSubmitting: boolean;
  login: {
    success: LoginUserResponse | null;
    pending: boolean;
    error: AuthErrorResponse | null;
  };
  updateUserDetails: {
    success: UpdateUserDetailsResponse | null;
    error: UpdateUserDetailsError | null;
    pending: boolean;
  };
  updateUserPassword: {
    success: UpdateUserPasswordResponse | null;
    error: UpdateUserPasswordError | null;
    pending: boolean;
  };
  currentUser: CurrentUser | null;
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

export interface UpdateUserDetailsError {
  errors?: string[];
  message: string;
}

export type UpdateUserPasswordDetails = {
  password: string;
  confirmPassword: string;
};

export interface UpdateUserPasswordResponse extends LoginUserResponse {}

export type UpdateUserPasswordError = {
  errors?: string[];
  message: string;
};

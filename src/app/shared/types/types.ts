export type CurrentUser = {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  phoneNumber: string;
  roles: 'Basic User' | 'Administrator' | 'Manager';
  changePassword: boolean;
  password?: string;
  password_confirmation?: string;
  current_password?: string;
  department: 'Service Center' | 'Training Center';
};

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  department: 'Service Center' | 'Training Center';
  roles: 'Basic User' | 'Administrator' | 'Manager';
  specializations: string[];
}

export type ProfileUpdateResponse = {
  success: boolean;
  message: string;
};

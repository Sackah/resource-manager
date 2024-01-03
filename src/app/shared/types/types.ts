export type CurrentUser = {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  phoneNumber: string;
  roles: 'Basic User' | 'Administrator' | 'Manager';
  changePassword: boolean;
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

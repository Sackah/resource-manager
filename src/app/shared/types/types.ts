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
  specializations: [];
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

export type SpecializationsResponse = {
  success: boolean;
  message: string;
};

export interface Specializations {
  name: string[];
}

// export interface Departments {
//   name: Pick<Specializations, 'name'>;
// }

export interface Departments {
  name: string[];
}

export interface UserNotifications {
  created_by: string;
  time: string;
  message: string;
}

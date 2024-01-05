export type Specializations =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'UI/UX Designer'
  | 'DevOps'
  | 'Data Scientist'
  | 'Software Tester'
  | 'Operations';

export type Roles = 'Basic User' | 'Administrator' | 'Manager';

export type Departments = 'Service Center' | 'Training Center' | 'Operations';

export type CurrentUser = {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  phoneNumber: string;
  roles: Roles;
  changePassword: boolean;
  password?: string;
  password_confirmation?: string;
  current_password?: string;
  department: Departments;
  specializations: Specializations[];
};

/**
 * @description
 * Yes CurrentUser is the same as User, but it may be used in different contexts where typing an object
 * as User is more appropriate than typing it as CurrentUser
 */
export interface User extends CurrentUser {}

/**
 * @description you can use this type, anywhere the response is not of utmost importance
 */
export type GenericResponse = {
  success: boolean;
  message: string;
};

export interface UserNotifications {
  created_by: string;
  time: string;
  message: string;
}

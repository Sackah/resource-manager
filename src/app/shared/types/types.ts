export type Specializations = {
  name: string;
};

export type Role = 'Basic User' | 'Administrator' | 'Manager';

export type Departments = 'Service Center' | 'Training Center' | 'Operations';

export type Skills = 'JavaScript' | 'Java' | 'MySQL';

export type NameType = 'firstName' | 'lastName';

export type CurrentUser = {
  email: string;
  refId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  phoneNumber: string;
  role: Role;
  changePassword: boolean;
  permissions?: Permisions;
  department: Departments;
  specializations: Specializations[];
  skills: {
    name: Skills;
    id: number;
    rating: number;
  }[];
  bookable: boolean;
  workHours: {
    scheduleId: number;
    hour: number;
  }[];
  workDay?: string;
  created_at: string;
  selected?: boolean;
  client: string;
  timeZone: string;
  project: { name: string; workHours: number; scheduleId: number }[];
  location: string;
};

export interface User extends CurrentUser {}

export type ArchivedUsersResponse = {
  archives: User[];
};

export type ArchivedProjectsResponse = {
  archives: ProjectDetails[];
};

export type UsersResponse = {
  users: User[];
};

export interface IPDataResponse {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  time_zone: {
    name: string;
  };
}

export type AdminUser = Pick<CurrentUser, 'email' | 'department' | 'role'> & {
  skills: string;
  department: string;
  specializations: string;
};

export type GenericResponse = {
  success: boolean;
  message: string;
  status: number;
};

export type ClientDetails = {
  name: string;
  clientId: string;
  details: string;
  projects: Projects[];
  employees: EmployeeDetails[];
  totalProjects: number;
  created_at: Date;
  client: ClientDetails;
  projectName: string;
};
export type ProjectDetails = Pick<ClientDetails, 'name' | 'details'> & {
  client: string;
  projectCode: string;
  projectName: string;
  billable: boolean;
  projectType: string;
  date: Date;
  employees: EmployeeDetails[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  projectId: string;
  clientId: string;
};
export interface EmployeeDetails {
  name: string;
  picture: string;
}
export interface UserNotifications {
  created_by: string;
  time: string;
  message: string;
}

export type Permisions = {
  can_add_manager: boolean;
  can_add_user: boolean;
  can_add_user_to_group: boolean;
  can_assign_client_to_project: boolean;
  can_assign_user_to_department: boolean;
  can_assign_user_to_project: boolean;
  can_assign_user_to_specialization: boolean;
  can_create_client: boolean;
  can_create_project: boolean;
  can_update_user_role: boolean;
};

export type InitialSig = {
  success: { user?: CurrentUser; message: string } | null;
  error: { message: string } | null;
  pending: boolean;
};

export type Projects = {
  id: string;
  name: string;
};

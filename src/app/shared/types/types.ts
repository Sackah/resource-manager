export type CurrentUser = {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  phoneNumber: string;
  roles: 'Basic User' | 'Administrator';
  changePassword: boolean;
};

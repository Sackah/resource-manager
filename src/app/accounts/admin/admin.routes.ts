import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsercreationComponent } from './pages/usercreation/usercreation.component';
import { AccountSetupComponent } from './pages/account-setup/account-setup.component';
import { UsersComponent } from '../admin/pages/users/users.component';
import { MainComponent } from '../user/main.component';

export const AdminRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'account-setup',
        component: AccountSetupComponent,
      },
      {
        path: 'create-user',
        component: UsercreationComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
  // { path: 'dashboard', component: DashboardComponent, children: [] },
  // { path: 'account-setup', component: AccountSetupComponent },
  // { path: 'create-user', component: UsercreationComponent },
  // { path: 'users', component: UsersComponent },
];

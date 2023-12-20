import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsercreationComponent } from './pages/usercreation/usercreation.component';
import { AccountSetupComponent } from './pages/account-setup/account-setup.component';

export const AdminRoutes: Route[] = [
  { path: 'dashboard', component: DashboardComponent, children: [] },
  { path: 'account-setup', component: AccountSetupComponent },
  { path: 'create-user', component: UsercreationComponent },
];

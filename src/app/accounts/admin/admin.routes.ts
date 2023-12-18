import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccountSetupComponent } from './pages/account-setup/account-setup.component';

export const AdminRoutes: Route[] = [
  { path: '', component: DashboardComponent, children: [] },
  { path: 'account-setup', component: AccountSetupComponent },
];

import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const ManagerRoutes: Route[] = [
  { path: 'dashboard', component: DashboardComponent, children: [] },
  { path: 'manager-settings', component: SettingsComponent, children: [] },
];

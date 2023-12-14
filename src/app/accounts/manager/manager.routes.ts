import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const ManagerRoutes: Route[] = [
  { path: '', component: DashboardComponent, children: [] },
];

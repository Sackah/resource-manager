import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const UserRoutes: Route[] = [
  { path: '', component: DashboardComponent, children: [] },
];

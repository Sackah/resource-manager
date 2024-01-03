import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MainComponent } from '../user/main.component';

export const ManagerRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];

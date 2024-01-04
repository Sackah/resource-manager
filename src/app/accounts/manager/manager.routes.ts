import { Route } from '@angular/router';
import { SettingsComponent } from '../manager/pages/settings/settings.component';
import { DashboardComponent } from '../manager/pages/dashboard/dashboard.component';
import { MainComponent } from '../manager/main.component';

export const ManagerRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];

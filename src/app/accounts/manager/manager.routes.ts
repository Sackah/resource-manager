import { Route } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { UsersComponent } from './pages/users/users.component';
import { ClientComponent } from './pages/client/client.component';
import { MessageComponent } from './pages/message/message.component';
import { ProjectComponent } from './pages/project/project.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

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
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'client',
        component: ClientComponent,
      },
      {
        path: 'message',
        component: MessageComponent,
      },
      {
        path: 'project',
        component: ProjectComponent,
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
    ],
  },
];

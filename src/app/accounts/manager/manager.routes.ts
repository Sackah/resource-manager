import { Route } from '@angular/router';
import { SettingsComponent } from '../manager/pages/settings/settings.component';
import { DashboardComponent } from '../manager/pages/dashboard/dashboard.component';
import { MainComponent } from '../manager/main.component';
import { UsersComponent } from '../manager/pages/users/users.component';
import { ProjectComponent } from '../manager/pages/project/project.component';
import { ScheduleComponent } from '../manager/pages/schedule/schedule.component';
import { MessageComponent } from '../manager/pages/message/message.component';
import { ClientComponent } from '../manager/pages/client/client.component';

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
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        path: 'client',
        component: ClientComponent,
      },
      {
        path: 'project',
        component: ProjectComponent,
      },
      {
        path: 'message',
        component: MessageComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];

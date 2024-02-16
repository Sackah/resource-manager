import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccountSetupComponent } from './pages/account-setup/account-setup.component';
import { UsercreationComponent } from './pages/usercreation/usercreation.component';
import { UsersComponent } from './pages/users/users.component';
import { MainComponent } from './main.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ClientComponent } from './pages/client/client.component';
import { ProjectComponent } from './pages/project/project.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { MessageComponent } from './pages/message/message.component';

export const AdminRoutes: Route[] = [
  {
    path: 'account-setup',
    component: AccountSetupComponent,
  },
  {
    path: 'create-user',
    component: UsercreationComponent,
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
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
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        path: 'message',
        component: MessageComponent,
      },
    ],
  },
];

import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { UserGroupComponent } from './pages/user-group/user-group.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ProjectComponent } from './pages/project/project.component';
import { SettingComponent } from './pages/setting/setting.component';
import { MessageComponent } from './pages/message/message.component';

export const UserRoutes: Route[] = [
  { path: 'dashboard', component: DashboardComponent, children: [] },
  { path: 'users', component: UsersComponent, children: [] },
  { path: 'user-group', component: UserGroupComponent, children: [] },
  { path: 'user-schedule', component: ScheduleComponent, children: [] },
  { path: 'user-project', component: ProjectComponent, children: [] },
  { path: 'user-settings', component: SettingComponent, children: [] },
  { path: 'user-message', component: MessageComponent, children: [] },
];

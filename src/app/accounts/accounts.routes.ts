import { Routes } from '@angular/router';
import { AdminGuard, ManagerGuard, UserGuard } from '../auth/guards/role.guard';
import { AccountSetupComponent } from './user/pages/account-setup/account-setup.component';

export const AccountRoutes: Routes = [
  {
    path: 'account-setup/:userId/:accesstoken/:email',
    component: AccountSetupComponent,
  },
  /**
   * defaulting `/` to user, might change later
   */
  {
    path: '',
    loadChildren: () => import('./user/user.routes').then(m => m.UserRoutes),
    canActivate: [UserGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.routes').then(m => m.UserRoutes),
    canActivate: [UserGuard],
  },
  {
    path: 'manager',
    loadChildren: () =>
      import('./manager/manager.routes').then(m => m.ManagerRoutes),
    canActivate: [ManagerGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.AdminRoutes),
    canActivate: [AdminGuard],
  },
];

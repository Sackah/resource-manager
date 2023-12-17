import { Routes } from '@angular/router';
import { AdminGuard, ManagerGuard, UserGuard } from '../auth/guards/role.guard';

export const AccountRoutes: Routes = [
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

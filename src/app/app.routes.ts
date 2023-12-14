import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/accounts/accounts.routes').then(m => m.AccountRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('../app/auth/auth.routes').then(m => m.LoginRoutes),
  },
];

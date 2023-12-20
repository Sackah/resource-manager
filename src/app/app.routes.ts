import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { ForgotPasswordComponent } from './auth/pages/forgot-password/forgot-password.component';

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
  { path: 'forgot-password', component: ForgotPasswordComponent },
];

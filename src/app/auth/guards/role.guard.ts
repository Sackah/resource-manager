import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../shared/services/role.service';

export const AdminGuard = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  const role = roleService.get();

  if (role === 'Administrator') {
    return true;
  }
  router.navigateByUrl('/login');
  return false;
};

export const UserGuard = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  const role = roleService.get();

  if (role === 'Basic User') {
    return true;
  }
  router.navigateByUrl('/login');
  return false;
};

export const ManagerGuard = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  const role = roleService.get();
  if (role === 'Manager') {
    return true;
  }
  router.navigateByUrl('/login');
  return false;

  return true;
};

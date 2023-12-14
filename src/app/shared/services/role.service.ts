import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor() {}
  role: 'user' | 'admin' | 'manager' = 'user';

  get() {
    return this.role;
  }
}

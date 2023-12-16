import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectResponse } from '../../auth/store/login/LoginReducers';

@Injectable({
  providedIn: 'root',
})
export class RoleService implements OnDestroy {
  role!: 'Basic User' | 'Administrator';
  userDetail$ = this.store.select(selectResponse);

  constructor(private store: Store) {}

  userSubscription = this.userDetail$.subscribe({
    next: userDetails => {
      if (userDetails) {
        this.role = userDetails.user.roles;
      }
    },
  });

  get() {
    return this.role;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}

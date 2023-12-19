import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLogin } from '../../auth/store/authorization/AuthReducers';

/**
 * @class RoleService
 * @description a service for getting the user role from state
 *
 * @property userDetails$ - a stream of data for LoginUserResponse
 * @property userSubscription - property for getting the role from userDetail$ through subscription
 *
 * @method get - returns the role of the user
 */
@Injectable({
  providedIn: 'root',
})
export class RoleService implements OnDestroy {
  private role!: 'Basic User' | 'Administrator';
  userDetail$ = this.store.select(selectLogin);

  constructor(private store: Store) {}

  userSubscription = this.userDetail$.subscribe({
    next: userDetails => {
      if (userDetails.success) {
        this.role = userDetails.success.user.roles;
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

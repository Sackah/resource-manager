import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../auth/store/authorization/AuthReducers';

@Injectable({
  providedIn: 'root',
})
export class RoleService implements OnDestroy {
  private role!: 'Basic User' | 'Administrator' | 'Manager';

  userDetail$ = this.store.select(selectCurrentUser);

  constructor(private store: Store) {}

  userSubscription = this.userDetail$.subscribe({
    next: userDetails => {
      if (userDetails) {
        this.role = userDetails.role;
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

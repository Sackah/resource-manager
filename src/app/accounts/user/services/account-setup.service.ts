import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SetupProgress = 'password' | 'details';

/**
 * @class AccountSetupService
 *
 * @description
 * A service for managing account setup on first login. Toggles between different states
 * of a setup, set new password and user details
 *
 * @property dataSource - A BehaviorSubject that holds the
 * current state of the setup progress.
 * @property data - An Observable derived from dataSource.
 * Use this to subscribe to changes in the setup progress.
 *
 * @method constructor - By default, the state of the setup progress is 'password'.
 * @method toggle - Changes the state of the setup progress. @param SetupProgress
 */

@Injectable({
  providedIn: 'root',
})
export class AccountSetupService {
  private dataSource = new BehaviorSubject<SetupProgress>('password');
  data = this.dataSource.asObservable();

  constructor() {}

  toggle(data: SetupProgress) {
    this.dataSource.next(data);
  }
}

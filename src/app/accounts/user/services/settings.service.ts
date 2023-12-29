import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SettingsFields = 'profile' | 'password';

/**
 * @class SettingsService
 *
 * @description
 * A service for managing settings operations. Toggles between different states
 * of a settings operation, password and profile
 *
 * @property dataSource - A BehaviorSubject that holds the
 * current state of the settings operation.
 * @property data - An Observable derived from dataSource.
 * Use this to subscribe to changes in the settings operation state.
 *
 * @method constructor - By default, the state of the settings operation is 'profile'.
 * @method toggle - Changes the state of the settings operation. @param SettingsFields
 * @see {@link SettingsFields}
 *
 * @usageNotes
 * ```
 * const settingsService = inject(SettingsService);
 * settingsService.toggle('password'); //to change the field to an password field
 * ```
 */

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private dataSource = new BehaviorSubject<SettingsFields>('profile');
  data = this.dataSource.asObservable();

  constructor() {}

  toggle(data: SettingsFields) {
    this.dataSource.next(data);
  }
}

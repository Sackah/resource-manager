import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  UpdateUserDetailsResponse,
  UpdateUserPasswordResponse,
} from '../../../auth/types/auth-types';
import { BASE_URL } from '../../../../environment/config';
import { UpdateUserDetails } from '../../../auth/types/auth-types';

export type SettingsFields = 'profile' | 'password';

/**
 * @class SettingsService
 *
 * @description
 * A service for managing settings operations. Toggles between different states
 * of a settings operation, password, and profile
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
 * settingsService.toggle('password'); //to change the field to a password field
 * ```
 */

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private dataSource = new BehaviorSubject<SettingsFields>('profile');
  data = this.dataSource.asObservable();

  constructor(private http: HttpClient) {}

  toggle(data: SettingsFields) {
    this.dataSource.next(data);
  }

  updateDetails(
    newDetails: UpdateUserDetails
  ): Observable<UpdateUserDetailsResponse> {
    return this.http.put<UpdateUserDetailsResponse>(
      `${BASE_URL}/users/settings/update/profile`,
      newDetails
    );
  }

  updatePassword(newPassword: string): Observable<UpdateUserPasswordResponse> {
    return this.http.put<UpdateUserPasswordResponse>(
      `${BASE_URL}/users/settings/update/password`,
      newPassword
    );
  }
}

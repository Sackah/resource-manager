import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import {
  UpdateUserDetailsResponse,
  UpdateUserPasswordResponse,
} from '../../../auth/types/auth-types';
import { BASE_URL } from '../../../../environment/config';
import { UpdateUserDetails } from '../../../auth/types/auth-types';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export type SettingsFields = 'profile' | 'password';

/**
 * Service for managing user settings.
 * @usageNotes
 * ```
 * const settingsService = inject(SettingsService);
 * settingsService.toggle('password'); //to change the field to a password field
 * settingsService.updateDetails(newDetails); //to update the user details
 * settingsService.updatePassword(newPassword); //to update the user password
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private dataSource = new BehaviorSubject<SettingsFields>('profile');
  data = this.dataSource.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Toggles the settings data to profile or password.
   * @param data The new settings data.
   */
  toggle(data: SettingsFields) {
    this.dataSource.next(data);
  }

  /**
   * Updates the user details.
   * @param newDetails The new user details.
   * @returns An observable of @see{@link UpdateUserDetailsResponse}
   */
  updateDetails(
    newDetails: UpdateUserDetails
  ): Observable<UpdateUserDetailsResponse> {
    return this.http
      .put<UpdateUserDetailsResponse>(
        `${BASE_URL}/users/settings/update/profile`,
        newDetails
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  /**
   * Updates the user password.
   * @param newPassword The new user password.
   * @returns An observable of @see{@link UpdateUserPasswordResponse}
   */
  updatePassword(newPassword: string): Observable<UpdateUserPasswordResponse> {
    return this.http
      .put<UpdateUserPasswordResponse>(
        `${BASE_URL}/users/settings/update/password`,
        newPassword
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  /**
   * Handles the HTTP error response.
   * @param error The HTTP error response.
   * @returns An observable of the error.
   */
  private onError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(error.error);
      return throwError(
        () => new Error('Cannot connect to the server please try again')
      );
    } else {
      console.error(error.error);
      return throwError(() => new Error(`${error.error.message}`));
    }
  }
}

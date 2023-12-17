import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type InputFields = 'email' | 'otp' | 'changePassword';

/**
 * @class ResetService
 *
 * @description
 * A service for managing reset operations. Toggles between different states
 * of a reset operation, email, otp and changePassword
 *
 * @property dataSource - A BehaviorSubject that holds the
 * current state of the reset operation.
 * @property data - An Observable derived from dataSource.
 * Use this to subscribe to changes in the reset operation state.
 *
 * @method constructor - By default, the state of the reset operation is 'email'.
 * @method toggle - Changes the state of the reset operation. @param InputFields
 */
@Injectable({
  providedIn: 'root',
})
export class ResetService {
  private dataSource = new BehaviorSubject<InputFields>('email');
  data = this.dataSource.asObservable();

  constructor() {}

  toggle(data: InputFields) {
    this.dataSource.next(data);
  }
}

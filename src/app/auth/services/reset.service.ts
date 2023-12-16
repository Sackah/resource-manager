import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type InputFields = 'email' | 'otp' | 'changePassword';

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

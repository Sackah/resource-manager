import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../types/types';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private availabilitySubject = new BehaviorSubject<User | null>(null);

  availability$ = this.availabilitySubject.asObservable();

  updateAvailability(user: User) {
    this.availabilitySubject.next(user);
  }
}

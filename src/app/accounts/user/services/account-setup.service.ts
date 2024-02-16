import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SetupProgress = 'password' | 'details';

@Injectable({
  providedIn: 'root',
})
export class AccountSetupService {
  private dataSource = new BehaviorSubject<SetupProgress>('password');

  data = this.dataSource.asObservable();

  toggle(data: SetupProgress) {
    this.dataSource.next(data);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  private refreshUsersSource = new BehaviorSubject<boolean>(false);

  refreshUsers$ = this.refreshUsersSource.asObservable();

  constructor() {}

  refreshUsers() {
    this.refreshUsersSource.next(true);
  }
}

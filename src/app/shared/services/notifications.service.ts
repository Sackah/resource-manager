import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/environment/config';
import { UserNotifications, CurrentUser } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  });

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<UserNotifications[]> {
    return this.http.get<UserNotifications[]>(
      `${BASE_URL}/users/notifications/fetch`,
      {
        headers: this.headers,
      }
    );
  }

  markAllAsRead(email: string): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(
      `${BASE_URL}/users/notifications/mark/all/read`,
      { email },
      {
        headers: this.headers,
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/environment/config';
import {
  ArchivedUsersResponse,
  GenericResponse,
  User,
  UsersResponse,
} from '../../../shared/types/types';
import {
  UpdateUserDetailsResponse,
  UpdateUserDetails,
} from '../../../auth/types/auth-types';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  });

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${BASE_URL}/users/fetch/?query=`, {
      headers: this.headers,
    });
  }

  updateDetails(
    newDetails: UpdateUserDetails
  ): Observable<UpdateUserDetailsResponse> {
    return this.http.put<UpdateUserDetailsResponse>(
      `${BASE_URL}/users/edit`,
      newDetails
    );
  }

  deleteUser(email: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(
      `${BASE_URL}/users/archives/delete`,
      {
        headers: this.headers,
        params: {
          email,
        },
      }
    );
  }

  getBookableUsers(query: string): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(
      `${BASE_URL}/users/fetch/bookable/?query=${query}`,
      {
        headers: this.headers,
      }
    );
  }

  archiveUser(email: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${BASE_URL}/users/delete`, {
      headers: this.headers,
      params: {
        email,
      },
    });
  }

  getPendingUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${BASE_URL}/users/pending`, {
      headers: this.headers,
    });
  }

  reInviteUser(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${BASE_URL}/users/reinvite`,
      { email },
      {
        headers: this.headers,
      }
    );
  }

  getInactiveUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${BASE_URL}/users/inactive`, {
      headers: this.headers,
    });
  }

  getActiveUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${BASE_URL}/users/active`, {
      headers: this.headers,
    });
  }

  archivedUsers(): Observable<ArchivedUsersResponse> {
    return this.http.get<ArchivedUsersResponse>(
      `${BASE_URL}/users/archives/fetch`,
      {
        headers: this.headers,
      }
    );
  }

  restoreUser(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${BASE_URL}/users/archives/restore`,
      { email },
      {
        headers: this.headers,
      }
    );
  }

  assignUser(
    name: string,
    refId: string[],
    workHours: string
  ): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${BASE_URL}/project/assign`,
      { name, refId, workHours },
      {
        headers: this.headers,
      }
    );
  }

  editProjectWorkHours(
    scheduleId: number,
    workHours: number,
    user: User
  ): Observable<GenericResponse> {
    const body = {
      scheduleId,
      workHours,
    };

    return this.http.put<GenericResponse>(
      `${BASE_URL}/project/schedule/edit`,
      { refId: user.refId, ...body },
      {
        headers: this.headers,
      }
    );
  }
}

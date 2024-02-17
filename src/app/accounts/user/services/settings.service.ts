import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { BASE_URL } from 'src/environment/config';
import {
  UpdateUserDetailsResponse,
  UpdateUserPasswordResponse,
  UpdateUserDetails,
} from '../../../auth/types/auth-types';
import {
  Departments,
  Specializations,
  Skills,
  GenericResponse,
} from '../../../shared/types/types';

export type SettingsFields = 'profile' | 'password' | 'work specialization';

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
    return this.http
      .put<UpdateUserDetailsResponse>(
        `${BASE_URL}/users/profile/update`,
        newDetails
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  updateAdminDetails(
    newDetails: UpdateUserDetails
  ): Observable<UpdateUserDetailsResponse> {
    return this.http
      .put<UpdateUserDetailsResponse>(
        `${BASE_URL}/users/admin/update/profile`,
        newDetails
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  updatePassword(newPassword: string): Observable<UpdateUserPasswordResponse> {
    return this.http
      .put<UpdateUserPasswordResponse>(
        `${BASE_URL}/users/profile/password/update`,
        newPassword
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  updateSpecialization(
    userSpecializationForm: UpdateUserDetails
  ): Observable<UpdateUserDetailsResponse> {
    return this.http
      .put<UpdateUserDetailsResponse>(
        `${BASE_URL}/users/update/work/specialization`,
        userSpecializationForm
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  deleteSkill(skillId: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${BASE_URL}/skills/delete`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
      body: {
        skills_id: skillId,
      },
    });
  }

  getSpecializations(): Observable<Specializations[]> {
    return this.http
      .get<{ specializations: [{ id: number; name: Specializations }] }>(
        `${BASE_URL}/specialization/fetch`,
        this.headers
      )
      .pipe(
        map(res => {
          const temp: Specializations[] = [];
          res.specializations.forEach(spec => temp.push(spec.name));
          return temp;
        }),
        catchError((error: HttpErrorResponse) => this.onError(error))
      );
  }

  getUserSkills(): Observable<Skills[]> {
    return this.http
      .get<{ skills: [{ id: number; name: Skills }] }>(
        `${BASE_URL}/skills/fetch/by/auth`,
        this.headers
      )
      .pipe(
        map(res => {
          const temp: Skills[] = [];
          res.skills.forEach(skill => temp.push(skill.name));
          return temp;
        }),
        catchError((error: HttpErrorResponse) => this.onError(error))
      );
  }

  addUserSkills(newSkill: string, refId: string): Observable<Skills[]> {
    const requestBody = {
      name: newSkill,
      refId,
    };

    return this.http
      .post<{ skills: [{ id: number; name: Skills }] }>(
        `${BASE_URL}/skills/store`,
        requestBody,
        this.headers
      )
      .pipe(
        map(res => {
          const temp: Skills[] = [];
          res.skills.forEach(skill => temp.push(skill.name));
          return temp;
        }),
        catchError((error: HttpErrorResponse) => this.onError(error))
      );
  }

  getDepartments(): Observable<Departments[]> {
    return this.http
      .get<{ departments: [{ id: number; name: Departments }] }>(
        `${BASE_URL}/department/fetch`,
        this.headers
      )
      .pipe(
        map(res => {
          const temp: Departments[] = [];
          res.departments.forEach(dep => temp.push(dep.name));
          return temp;
        }),
        catchError((error: HttpErrorResponse) => this.onError(error))
      );
  }

  private get headers() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      }),
    };
  }

  private onError(error: HttpErrorResponse) {
    if (error.status === 0) {
      return throwError(
        () => new Error('Cannot connect to the server please try again')
      );
    }
    return throwError(() => new Error(`${error.error.message}`));
  }
}

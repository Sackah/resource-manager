import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import {
  UpdateUserDetailsResponse,
  UpdateUserPasswordResponse,
} from '../../../auth/types/auth-types';
import { BASE_URL } from '../../../../environment/config';
import { UpdateUserDetails } from '../../../auth/types/auth-types';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
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
        `${BASE_URL}/users/settings/update/profile`,
        newDetails
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  updatePassword(newPassword: string): Observable<UpdateUserPasswordResponse> {
    return this.http
      .put<UpdateUserPasswordResponse>(
        `${BASE_URL}/users/settings/update/password`,
        newPassword
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  updateSpecialization(
    userSpecializationForm: UpdateUserDetails
  ): Observable<UpdateUserDetailsResponse> {
    return this.http
      .put<UpdateUserDetailsResponse>(
        `${BASE_URL}/users/settings/update/work/specialization`,
        userSpecializationForm
      )
      .pipe(catchError((error: HttpErrorResponse) => this.onError(error)));
  }

  deleteSkill(skill: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${BASE_URL}/skills/delete`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
      params: {
        skill,
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

  addUserSkills(
    skill: string,
    userId: string
    // rating: any
  ): Observable<Skills[]> {
    const requestBody = {
      name: skill,
      userId: userId,
      // rating: rating,
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
    } else {
      return throwError(() => new Error(`${error.error.message}`));
    }
  }
}

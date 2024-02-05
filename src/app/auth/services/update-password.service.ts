import { Injectable } from '@angular/core';
import {
  UpdateUserPasswordDetails,
  UpdateUserPasswordResponse,
} from '../types/auth-types';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../environment/config';

@Injectable({
  providedIn: 'root',
})
export class UpdatePasswordService {
  constructor(private http: HttpClient) {}

  postUser(credentials: UpdateUserPasswordDetails) {
    return this.http.post<UpdateUserPasswordResponse>(
      `${BASE_URL}/users/set/new/password`,
      credentials
    );
  }

  postAdmin(credentials: UpdateUserPasswordDetails & { email: string }) {
    return this.http.put<{ message: string; status: number }>(
      `${BASE_URL}/users/update/initial/password`,
      credentials
    );
  }
}

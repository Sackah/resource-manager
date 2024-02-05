import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUserDetails, LoginUserResponse } from '../types/auth-types';
import { BASE_URL } from '../../../environment/config';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  post(user: LoginUserDetails) {
    return this.http.post<LoginUserResponse>(`${BASE_URL}/users/login`, user);
  }
}

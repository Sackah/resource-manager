import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUserDetails, LoginUserResponse } from '../types/types';
import { BASE_URL } from '../../../environment/config';

/**
 * @class LoginService
 * @description a service for logging in users
 *
 * @method post - submits user details to the backend
 * @param LoginUserDetails - email and password
 * @returns observable that resolves to LoginUserResponse,
 * @see [LoginUserResponse](../types/types.ts) for more about type definition
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  post(user: LoginUserDetails) {
    console.log(user);

    return this.http.post<LoginUserResponse>(`${BASE_URL}/users/login`, user);
  }
}

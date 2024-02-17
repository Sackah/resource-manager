import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/environment/config';
import {
  UpdateUserDetails,
  UpdateUserDetailsResponse,
} from '../types/auth-types';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserDetailsService {
  constructor(private http: HttpClient) {}

  post(details: UpdateUserDetails) {
    return this.http.post<UpdateUserDetailsResponse>(
      `${BASE_URL}/users/account/setup`,
      {
        details,
      }
    );
  }
}

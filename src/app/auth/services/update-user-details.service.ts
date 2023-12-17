import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../../environment/config';
import { UpdateUserDetails, UpdateUserDetailsResponse } from '../types/types';

/**
 * @class UpdateUserDetails
 * @description a service for updating user details
 *
 * @method post - submits updated user details to the backend
 * @param UpdateUserDetails - fields like email, profile picture and phone number
 * @returns observable that resolves to UpdateUserResponse,
 * @see [UpdateUserDetailsResponse](../types/types.ts) for more about type definition
 */
@Injectable({
  providedIn: 'root',
})
export class UpdateUserDetailsService {
  constructor(private http: HttpClient) {}

  post(details: UpdateUserDetails) {
    const formData = new FormData();

    Object.keys(details).forEach(key => {
      formData.append(key, (details as any)[key]);
    });

    return this.http.put<UpdateUserDetailsResponse>(
      `${BASE_URL}/users/update`,
      formData
    );
  }
}

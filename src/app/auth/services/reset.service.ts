import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendOtp,
  SendOtpResponse,
} from '../types/reset-types';
import { BASE_URL } from '../../../environment/config';

/**
 * @class ResetService
 * @description a service for resetting user password
 *
 * @method postEmail - submits user new user details to the backend
 * @param email - object which contains user email
 * @returns observable that resolves to SendOtpResponse (message, user and otp),
 * @see [SendOtpResponse](../types/reset-types.ts) for more about type definition
 *
 * @method updatePassword - submits new user credeentials to the backend
 * @param credentials - email, password & confirmation, otp
 * @returns observable that resolves to ResetPasswordResponse (message, accesstoken and user)
 */
@Injectable({
  providedIn: 'root',
})
export class ResetService {
  constructor(private http: HttpClient) {}

  postEmail(email: SendOtp) {
    return this.http.post<SendOtpResponse>(`${BASE_URL}/users/send-otp`, email);
  }

  updatePassword(credentials: ResetPasswordRequest) {
    return this.http.put<ResetPasswordResponse>(
      `${BASE_URL}/users/update/password`,
      credentials
    );
  }
}

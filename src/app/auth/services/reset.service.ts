import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/environment/config';
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendOtp,
  SendOtpResponse,
} from '../types/reset-types';

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

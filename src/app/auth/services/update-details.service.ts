import { Injectable } from '@angular/core';

/**
 * @class UpdateDetailsService
 * @description a service for updating user information
 *
 * @method post - submits user new user details to the backend
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
export class UpdateDetailsService {
  constructor() {}
}

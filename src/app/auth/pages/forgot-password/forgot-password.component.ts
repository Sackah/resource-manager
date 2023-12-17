import { Component } from '@angular/core';
import { LoginSideIllustrationComponent } from '../../components/login-side-illustration/login-side-illustration.component';
import { CommonModule } from '@angular/common';
import { EmailFormComponent } from '../../components/email-form/email-form.component';
import { RouterLink } from '@angular/router';
import {
  InputFields,
  ResetService,
} from '../../../auth/services/reset.service';
import { OtpFormComponent } from '../../components/otp-form/otp-form.component';
import { ResetPasswordFormComponent } from '../../components/reset-password-form/reset-password-form.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    LoginSideIllustrationComponent,
    EmailFormComponent,
    OtpFormComponent,
    ResetPasswordFormComponent,
    RouterLink,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css', '../../styles/styles.css'],
})
export class ForgotPasswordComponent {
  formField: InputFields = 'email';
  constructor(private resetService: ResetService) {
    this.resetService.data.subscribe({
      next: data => {
        this.formField = data;
      },
    });
  }
}

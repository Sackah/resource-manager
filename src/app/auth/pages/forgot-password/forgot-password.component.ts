import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OtpFormComponent } from '@app/auth/components/otp-form/otp-form.component';
import { ResetPasswordFormComponent } from '@app/auth/components/reset-password-form/reset-password-form.component';
import { LoginSideIllustrationComponent } from '@app/auth/components/login-side-illustration/login-side-illustration.component';
import { EmailFormComponent } from '../../components/email-form/email-form.component';
import {
  InputFields,
  ResetToggleService,
} from '../../services/reset-toggle.service';

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
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  formField: InputFields = 'email';

  successMessage: string | null = null;

  constructor(private resetToggleService: ResetToggleService) {}

  ngOnInit(): void {
    this.toggleSubscription();
  }

  public toggleSubscription() {
    const toggSubscription = this.resetToggleService.data.subscribe({
      next: data => {
        this.formField = data;
      },
    });

    this.subscriptions.push(toggSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

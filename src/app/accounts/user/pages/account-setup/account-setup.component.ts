import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginSideIllustrationComponent } from '../../../../auth/components/login-side-illustration/login-side-illustration.component';
import { AccountSetupFormComponent } from '../../components/account-setup-form/account-setup-form.component';
import {
  AccountSetupService,
  SetupProgress,
} from '../../services/account-setup.service';
import { NewPasswordFormComponent } from '../../components/new-password-form/new-password-form.component';

@Component({
  selector: 'app-account-setup',
  standalone: true,
  imports: [
    CommonModule,
    LoginSideIllustrationComponent,
    AccountSetupFormComponent,
    NewPasswordFormComponent,
  ],
  templateUrl: './account-setup.component.html',
  styleUrls: [
    './account-setup.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class AccountSetupComponent {
  setupProgress: SetupProgress = 'password';
  constructor(private setupService: AccountSetupService) {
    this.setupService.data.subscribe({
      next: data => {
        this.setupProgress = data;
      },
    });
  }
}

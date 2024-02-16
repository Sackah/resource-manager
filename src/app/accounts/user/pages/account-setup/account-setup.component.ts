import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginSideIllustrationComponent } from '@app/auth/components/login-side-illustration/login-side-illustration.component';
import { AccesstokenService } from '@app/shared/services/accesstoken.service';
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
export class AccountSetupComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  setupProgress: SetupProgress = 'password';

  userDetails = {
    accessToken: '',
    email: '',
    refId: '',
  };

  constructor(
    private setupService: AccountSetupService,
    private route: ActivatedRoute,
    private tokenService: AccesstokenService
  ) {
    const setupSub = this.setupService.data.subscribe({
      next: data => {
        this.setupProgress = data;
      },
    });
    this.subscriptions.push(setupSub);

    this.route.params.subscribe(params => {
      this.userDetails.accessToken = params.accesstoken;
      tokenService.set(params.accesstoken);
      this.userDetails.email = params.email;
      this.userDetails.refId = params.refId;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

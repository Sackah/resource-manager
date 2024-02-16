import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoginSideIllustrationComponent } from '@app/auth/components/login-side-illustration/login-side-illustration.component';
import { UpdatePasswordService } from '@app/auth/services/update-password.service';
import {
  UserPasswordState,
  selectCurrentUser,
  selectUpdateUserPassword,
} from '../../../../auth/store/authorization/AuthReducers';

@Component({
  selector: 'app-admin-account-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginSideIllustrationComponent],
  templateUrl: './account-setup.component.html',
  styleUrls: [
    './account-setup.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class AccountSetupComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public resetPasswordForm: FormGroup = new FormGroup({
    old_password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  public showOldPassword = false;

  public showNewPassword = false;

  private storeData!: UserPasswordState;

  private email!: string;

  public errorMessage!: string;

  constructor(
    private router: Router,
    private store: Store,
    private updatePassword: UpdatePasswordService
  ) {}

  ngOnInit(): void {
    this.storeSub();
  }

  public storeSub() {
    const storeSubscription = this.store
      .select(selectUpdateUserPassword)
      .subscribe({
        next: res => {
          this.storeData = res;
        },
        error: err => {
          this.storeData.error = err;
        },
      });

    const emailSubscription = this.store.select(selectCurrentUser).subscribe({
      next: user => {
        this.email = user?.email as string;
      },
    });

    this.subscriptions.push(storeSubscription, emailSubscription);
  }

  get oldPasswordField() {
    return this.showOldPassword ? 'text' : 'password';
  }

  get newPasswordField() {
    return this.showNewPassword ? 'text' : 'password';
  }

  public getOldPasswordErrors() {
    const control = this.resetPasswordForm.get('old_password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return "Password can't be empty";
      }
      if (control.hasError('minlength')) {
        return 'Password must be at least 8 characters';
      }
    }

    return '';
  }

  public getNewPasswordErrors() {
    const control = this.resetPasswordForm;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return "Password can't be empty";
      }
      if (control.hasError('minlength')) {
        return 'Password must be at least 8 characters';
      }
    }

    return '';
  }

  public submitForm() {
    const credentials = this.resetPasswordForm.value;
    const { email } = this;
    if (this.resetPasswordForm.valid) {
      const reqBody = {
        ...credentials,
        email,
      };

      this.updatePassword.postAdmin(reqBody).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: err => {
          this.errorMessage = err.message;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

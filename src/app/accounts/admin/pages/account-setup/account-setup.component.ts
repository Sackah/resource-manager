import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginSideIllustrationComponent } from '../../../../auth/components/login-side-illustration/login-side-illustration.component';
import { passwordMatchValidator } from '../../../../auth/validators/passwordmismatch';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  UserPasswordState,
  selectLogin,
} from '../../../../auth/store/authorization/AuthReducers';
import { AuthActions } from '../../../../auth/store/authorization/AuthActions';
import { selectUpdateUserPassword } from '../../../../auth/store/authorization/AuthReducers';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UpdatePasswordService } from '../../../../auth/services/update-password.service';

@Component({
  selector: 'admin-account-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginSideIllustrationComponent],
  templateUrl: './account-setup.component.html',
  styleUrls: [
    './account-setup.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class AccountSetupComponent implements OnInit, OnDestroy {
  resetPasswordForm!: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  passwordStrength!: 'weak' | 'medium' | 'strong' | '';
  storeData!: UserPasswordState;
  email!: string;
  errorMessage!: string;
  /**
   * These subscriptions are created to be destroyed on unmount ^performance
   */
  storeSubscription!: Subscription;
  emailSubscription!: Subscription;

  constructor(
    private router: Router,
    private store: Store,
    private updatePassword: UpdatePasswordService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      old_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.storeSubscription = this.store
      .select(selectUpdateUserPassword)
      .subscribe({
        next: res => {
          this.storeData = res;
        },
        error: err => {
          this.storeData.error = err;
        },
      });

    this.emailSubscription = this.store.select(selectLogin).subscribe({
      next: res => {
        console.log(res);
        this.email = res.success?.user.email as string;
        console.log(this.email);
      },
    });
  }

  get oldPasswordField() {
    return this.showOldPassword ? 'text' : 'password';
  }

  get newPasswordField() {
    return this.showNewPassword ? 'text' : 'password';
  }

  getOldPasswordErrors() {
    const control = this.resetPasswordForm.get('old_password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return "Password can't be empty";
      } else if (control.hasError('minlength')) {
        return 'Password must be at least 8 characters';
      }
    }

    return '';
  }

  getNewPasswordErrors() {
    const control = this.resetPasswordForm;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return "Password can't be empty";
      } else if (control.hasError('minlength')) {
        return 'Password must be at least 8 characters';
      }
    }

    return '';
  }

  updatePasswordStrength() {
    const passwordControl = this.resetPasswordForm.get('password');
    if (passwordControl?.errors?.['passwordStrength']) {
      this.passwordStrength = passwordControl.errors['passwordStrength'];
    } else {
      this.passwordStrength = 'strong';
    }
  }

  get cssClasses() {
    return {
      weak: this.passwordStrength === 'weak',
      medium: this.passwordStrength === 'medium',
      strong: this.passwordStrength === 'strong',
    };
  }

  submitForm(event: Event) {
    event.preventDefault();
    const credentials = this.resetPasswordForm.value;
    const email = this.email;
    if (this.resetPasswordForm.valid) {
      console.log(credentials);

      //send this to the backend
      const reqBody = {
        ...credentials,
        email,
      };

      console.log(reqBody);

      this.updatePassword.postAdmin(reqBody).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: err => {
          this.errorMessage = err.message;
        },
      });
      //Make some api call
      // this.store.dispatch(AuthActions.updateUserPassword(reqBody));
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

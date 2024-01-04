import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  UpdateUserDetails,
  UpdateUserDetailsResponse,
} from '../../../../auth/types/auth-types';
import { Subscription } from 'rxjs';
import { selectLogin } from '../../../../auth/store/authorization/AuthReducers';
import { passwordMatchValidator } from '../../../../auth/validators/passwordmismatch';
import { SettingsService } from '../../services/settings.service';
import { CurrentUser } from '../../../../shared/types/types';
import { Store } from '@ngrx/store';

type InitialState = {
  success: { user?: CurrentUser } | { message: string } | null;
  error: { message: string } | null;
  pending: boolean;
};
@Component({
  selector: 'user-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-password.component.html',
  styleUrls: [
    './user-password.component.css',
    '../../pages/setting/setting.component.css',
  ],
})
export class UserPasswordComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  userPasswordForm!: FormGroup;
  user!: CurrentUser;
  storeSubscription!: Subscription;

  settingsSig = signal<InitialState>({
    success: null,
    error: null,
    pending: false,
  });

  constructor(private settingsService: SettingsService, private store: Store) {}

  ngOnInit() {
    this.userPasswordForm = new FormGroup(
      {
        current_password: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
        ]),
      },
      {
        validators: passwordMatchValidator('password', 'password_confirmation'),
      }
    );

    this.setValues();

    this.storeSubscription = this.store.select(selectLogin).subscribe({
      next: (value: any) => {
        this.user = (value.success?.user as CurrentUser) || null;
      },
    });
  }

  get passwordField() {
    return this.showPassword ? 'text' : 'password';
  }

  get confirmPasswordField() {
    return this.showConfirmPassword ? 'text' : 'password';
  }

  getPasswordErrors() {
    const control = this.userPasswordForm.get('password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return "Password can't be empty";
      } else if (control.hasError('pattern')) {
        return 'Password must have at least one uppercase, one lowercase and a number';
      } else if (control.hasError('minlength')) {
        return 'Password must be at least 8 characters';
      }
    }
    return '';
  }

  getConfirmPasswordErrors() {
    const control = this.userPasswordForm;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('passwordMismatch')) {
        return 'Passwords do not match';
      }
    }

    const confirmPasswordControl = control.get('password_confirmation');
    if (
      confirmPasswordControl?.invalid &&
      (confirmPasswordControl.dirty || confirmPasswordControl.touched)
    ) {
      if (confirmPasswordControl.hasError('required')) {
        return "Confirm Password can't be empty";
      }
    }
    return '';
  }

  setValues() {
    if (this.user) {
      this.userPasswordForm.patchValue({
        current_password: this.user.current_password || '',
        password: this.user.password || '',
        password_confirmation: this.user.password_confirmation,
      });
    }
  }

  get signalValues() {
    const val = this.settingsSig();
    return val;
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.settingsSig.set({
      success: null,
      error: null,
      pending: true,
    });

    if (!this.user) {
      console.log('User details not available');
    }

    const newPassword: string =
      this.userPasswordForm.get('password')?.value || '';
    const currentPassword: string =
      this.userPasswordForm.get('current_password')?.value || '';
    const userPasswordForm: any = {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
      email: this.user.email,
    };

    this.settingsService.updatePassword(userPasswordForm).subscribe({
      next: response => {
        if (response && response.message) {
          this.settingsSig.set({
            success: response,
            error: null,
            pending: false,
          });
        }
      },
      error: error => {
        this.settingsSig.set({
          success: null,
          error: error,
          pending: false,
        });
      },
    });
  }
}

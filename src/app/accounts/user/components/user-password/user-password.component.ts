import { CommonModule } from '@angular/common';
import { Component, signal, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/auth/store/authorization/AuthReducers';
import { passwordMatchValidator } from '@app/auth/validators/passwordmismatch';
import { CurrentUser, InitialSig } from '@app/shared/types/types';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-user-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-password.component.html',
  styleUrls: [
    './user-password.component.css',
    '../../pages/setting/setting.component.css',
  ],
})
export class UserPasswordComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private showPassword = false;

  private showConfirmPassword = false;

  public userPasswordForm: FormGroup = new FormGroup(
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

  private user: CurrentUser | null = null;

  private settingsSig = signal<InitialSig>({
    success: null,
    error: null,
    pending: false,
  });

  constructor(private settingsService: SettingsService, private store: Store) {}

  ngOnInit() {
    this.storeSubscription();
  }

  private storeSubscription() {
    const storeSubscription = this.store.select(selectCurrentUser).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      },
    });
    this.subscriptions.push(storeSubscription);
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
      }
      if (control.hasError('pattern')) {
        return 'Password must have at least one uppercase, one lowercase and a number';
      }
      if (control.hasError('minlength')) {
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

  get signalValues() {
    const val = this.settingsSig();
    return val;
  }

  submitForm() {
    this.settingsSig.set({
      success: null,
      error: null,
      pending: true,
    });

    if (!this.user) {
      throw new Error('User details not available');
    }

    const reqBody = {
      ...this.userPasswordForm.value,
      email: this.user.email,
    };

    this.settingsService.updatePassword(reqBody).subscribe({
      next: response => {
        if (response && response.message) {
          this.settingsSig.set({
            success: response,
            error: null,
            pending: false,
          });
          setTimeout(() => {
            this.settingsSig.set({
              success: null,
              error: null,
              pending: false,
            });
          }, 3000);
        }
      },
      error: error => {
        this.settingsSig.set({
          success: null,
          error,
          pending: false,
        });
        setTimeout(() => {
          this.settingsSig.set({
            success: null,
            error: null,
            pending: false,
          });
        }, 3000);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../../../auth/validators/passwordmismatch';
import { SettingsService } from '../../services/settings.service';
import { CurrentUser } from '../../../../shared/types/types';
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

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.userPasswordForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: passwordMatchValidator('password', 'password_confirmation'),
      }
    );
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

  submitForm(event: Event) {
    event.preventDefault();
  }
}

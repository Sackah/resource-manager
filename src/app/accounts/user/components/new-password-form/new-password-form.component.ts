import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthActions } from '@app/auth/store/authorization/AuthActions';
import { passwordMatchValidator } from '@app/auth/validators/passwordmismatch';
import { GlobalInputComponent } from '@app/shared/components/global-input/global-input.component';
import {
  UserPasswordState,
  selectUpdateUserPassword,
} from '@app/auth/store/authorization/AuthReducers';
import {
  AccountSetupService,
  SetupProgress,
} from '../../services/account-setup.service';

@Component({
  selector: 'app-new-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GlobalInputComponent],
  templateUrl: './new-password-form.component.html',
  styleUrls: [
    './new-password-form.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class NewPasswordFormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  setupProgress!: SetupProgress;

  @Input() userDetails!: {
    accessToken: string;
    email: string;
    refId: string;
  };

  showPassword = false;

  showConfirmPassword = false;

  storeData!: UserPasswordState;

  errorMessage = '';

  storeData$ = this.store.select(selectUpdateUserPassword);

  setNewPasswordForm: FormGroup = new FormGroup(
    {
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

  constructor(
    private setupService: AccountSetupService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.storeSubscription();
  }

  get passwordField() {
    return this.showPassword ? 'text' : 'password';
  }

  public storeSubscription() {
    const storeSubscription = this.storeData$.subscribe({
      next: res => {
        this.storeData = res;
        if (res.error) {
          this.errorMessage = res.error.message;
        }
      },
      error: err => {
        this.storeData.error = err;
      },
    });
    this.subscriptions.push(storeSubscription);
  }

  get confirmPasswordField() {
    return this.showConfirmPassword ? 'text' : 'password';
  }

  public getPasswordErrors() {
    const control = this.setNewPasswordForm.get('password');
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
    const control = this.setNewPasswordForm;
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
        return "Confirm password can't be empty";
      }
    }

    return '';
  }

  submitForm() {
    const credentials = this.setNewPasswordForm.value;
    const { email, refId } = this.userDetails;

    if (this.setNewPasswordForm.valid === true) {
      const reqBody = {
        ...credentials,
        email,
        refId,
      };

      this.store.dispatch(AuthActions.updateUserPassword(reqBody));
    } else {
      this.errorMessage = 'The form is not valid. Please check your input.';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

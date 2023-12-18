import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginSideIllustrationComponent } from '../../components/login-side-illustration/login-side-illustration.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/authorization/AuthActions';
import { combineLatest } from 'rxjs';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  selectErrors,
  selectIsSubmitting,
} from '../../store/authorization/AuthReducers';
import { AuthState } from '../../types/auth-types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoginSideIllustrationComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles/styles.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  storeData!: Pick<AuthState, 'errors' | 'isSubmitting'>;
  storeData$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    errors: this.store.select(selectErrors),
  });
  storeSubscription = this.storeData$.subscribe({
    next: res => {
      this.storeData = res;
    },
    error: err => {
      this.storeData.errors = err;
    },
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  getEmailErrors(): string {
    const control = this.loginForm.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  getPasswordErrors() {
    const control = this.loginForm.get('password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return "Password can't be empty";
      }
    }

    return '';
  }

  get passwordField() {
    return this.showPassword ? 'text' : 'password';
  }

  submitForm(event: Event) {
    event.preventDefault();
    const userDetails = this.loginForm.value;
    if (this.loginForm.valid) {
      console.log(userDetails);
      this.store.dispatch(AuthActions.login(userDetails));
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

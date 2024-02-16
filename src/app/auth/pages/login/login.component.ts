import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthActions } from '@app/auth/store/authorization/AuthActions';
import { LoginSideIllustrationComponent } from '@app/auth/components/login-side-illustration/login-side-illustration.component';
import { GlobalInputComponent } from '@app/shared/components/global-input/global-input.component';
import {
  LoginState,
  selectLogin,
} from '../../store/authorization/AuthReducers';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoginSideIllustrationComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    GlobalInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles/styles.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subcriptions: Subscription[] = [];

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public showPassword = false;

  public storeData!: LoginState;

  public successMessage: string | null = null;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.storeSubscription();
  }

  public storeSubscription() {
    const storeSubscription = this.store.select(selectLogin).subscribe({
      next: res => {
        this.storeData = res;
        if (res.success) {
          this.successMessage = 'Login successful!';
        }
      },
    });

    this.subcriptions.push(storeSubscription);
  }

  public getEmailErrors(): string {
    const control = this.loginForm.get('email');
    return control?.invalid && (control.dirty || control.touched)
      ? control.hasError('required')
        ? 'This field is required'
        : control.hasError('email')
        ? 'Please enter a valid email address'
        : ''
      : '';
  }

  public getPasswordErrors() {
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
      this.store.dispatch(AuthActions.login(userDetails));
    }
  }

  ngOnDestroy(): void {
    this.subcriptions.forEach(sub => sub.unsubscribe());
  }
}

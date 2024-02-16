import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { ResetActions } from '@app/auth/store/reset-password/ResetActions';
import { GlobalInputComponent } from '@app/shared/components/global-input/global-input.component';
import { ResetState, SendOtpError } from '../../types/reset-types';
import {
  selectIsSubmitting,
  selectError,
  selectResponse,
} from '../../store/reset-password/ResetReducers';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    GlobalInputComponent,
  ],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css', '../../styles/styles.css'],
})
export class EmailFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  public successMessage: string | null = null;

  public storeData: Pick<ResetState, 'error' | 'isSubmitting' | 'response'> = {
    error: null,
    isSubmitting: false,
    response: null,
  };

  private storeData$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    error: this.store.select(selectError),
    response: this.store.select(selectResponse),
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.storeSubscription();
  }

  public storeSubscription() {
    const storeSubscription = this.storeData$.subscribe({
      next: res => {
        if (res.error) {
          this.storeData.error = res.error;
        }
        this.storeData.isSubmitting = res.isSubmitting;
        if (res.response) {
          this.storeData.response = res.response;
        }
      },

      error: (err: SendOtpError) => {
        this.storeData.error = err;
      },
    });

    this.subscriptions.push(storeSubscription);
  }

  getEmailErrors(): string {
    const control = this.emailForm.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
      if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();
    if (this.emailForm.valid) {
      const email = this.emailForm.value;
      this.store.dispatch(ResetActions.sendOtp(email));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import {
  UpdateUserDetails,
  UpdateUserDetailsResponse,
} from '../../../../auth/types/auth-types';
import { Router } from '@angular/router';
import { LoginSideIllustrationComponent } from '../../../../auth/components/login-side-illustration/login-side-illustration.component';
import { validPhoneNumber } from '../../../../auth/validators/invalidphonenumber';
import { selectLogin } from '../../../../auth/store/authorization/AuthReducers';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../../auth/store/authorization/AuthActions';
import { CurrentUser } from '../../../../shared/types/types';

type InitialState = {
  success: null | UpdateUserDetailsResponse;
  error: null | Error;
  pending: boolean;
};

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginSideIllustrationComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.css',
    '../../pages/setting/setting.component.css',
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userDetails!: FormGroup;
  imgUrl = '../../../../../assets/images/user/profile-container-2.svg';
  user!: CurrentUser;
  disable: boolean = false;
  storeSubscription!: Subscription;
  settingsSig = signal<InitialState>({
    success: null,
    error: null,
    pending: false,
  });

  constructor(
    private store: Store,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.userDetails = new FormGroup({
      profilePicture: new FormControl(null),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.email,
      ]),

      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),
      ]),
      phoneNumber: new FormControl('', [Validators.required, validPhoneNumber]),
      department: new FormControl('', [Validators.required]),
      specialization: new FormControl('', [Validators.required]),
    });

    // Calls set values to set the values of the form with state data
    this.setValues();
    this.storeSubscription = this.store.select(selectLogin).subscribe({
      next: res => {
        this.user = res.success?.user as CurrentUser;
        this.userDetails.patchValue({
          email: this.user?.email || '',
          firstName: this.user?.firstName || '',
          lastName: this.user?.lastName || '',
          phoneNumber: this.user?.phoneNumber || '',
          department: this.user?.department || '',
        });
      },
    });
  }

  getEmailErrors(): string {
    const control = this.userDetails.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  getNameErrors(name: 'firstName' | 'lastName') {
    const control = this.userDetails.get(name);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('pattern')) {
        return 'Name can only contain letters and one space per word';
      }
    }

    return '';
  }

  getSpecializationErrors(): string {
    const control = this.userDetails.get('specialization');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }

    return '';
  }

  getNumberErrors() {
    const control = this.userDetails.get('phoneNumber');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('invalidPhoneNumber')) {
        return 'Number should be exactly 10 digits without country code';
      }
    }

    return '';
  }

  getDepartmentErrors(): string {
    const control = this.userDetails.get('qualification');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }

    return '';
  }

  onFileChange(event: any) {
    if (event.target?.files.length > 0) {
      let reader = new FileReader();
      const file = event.target.files[0];

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };

      this.userDetails.patchValue({
        profilePicture: file,
      });
    }
  }

  setValues() {
    if (this.user) {
      this.userDetails.patchValue({
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phoneNumber: this.user.phoneNumber,
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
      console.error('User details not available.');
      return;
    }

    const userDetails: UpdateUserDetails = {
      ...this.userDetails.value,
      userId: this.user.userId,
    };

    if (this.userDetails.valid) {
      this.settingsService.updateDetails(userDetails).subscribe({
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

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

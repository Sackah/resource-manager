import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
import { CurrentUser } from '../../../../shared/types/types';

/**
 * Initial state of the signal
 */
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
  specializations!: [{ id: number; name: string }];
  departments!: [{ id: number; name: string }];

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

    this.storeSubscription = this.store.select(selectLogin).subscribe({
      next: res => {
        this.user = res.success?.user as CurrentUser;
        this.setValues();
      },
    });

    this.settingsService.getSpecializations().subscribe({
      next: res => {
        console.log(res);
        this.specializations = res.specializations;
      },
    });

    this.settingsService.getDepartments().subscribe({
      next: res => {
        console.log(res);
        this.departments = res.departments;
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

  /**
   * This method is used to change the image url when the user selects a file
   * @param event
   * @returns {void}
   */
  onFileChange(event: any) {
    if (event.target?.files.length > 0) {
      let reader = new FileReader();
      const file = event.target.files[0];

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };

      /**
       * Profile picture should be a string
       */
      // this.userDetails.patchValue({
      //   profilePicture: file,
      // });
    }
  }

  /**
   * setvalues() is called on instanciaion to replace all the values with data from state
   */
  setValues() {
    if (this.user) {
      this.userDetails.patchValue({
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phoneNumber: this.user.phoneNumber,
        department: this.user.department || '',
        imgUrl: this.user.profilePicture,
        specialization: this.user.specializations[0] || '',
      });
    }
  }

  get signalValues() {
    const val = this.settingsSig();
    return val;
  }

  /**
   * The form is submitted here
   * @param event
   * @returns {void}
   */
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

    /**
     * Email is intentionally omitted from the request body
     */
    const reqBody = {
      firstName: this.userDetails.value.firstName,
      lastName: this.userDetails.value.lastName,
      phoneNumber: this.userDetails.value.phoneNumber,
      department: this.userDetails.value.department,
      specialization: this.userDetails.value.specialization,
    };

    if (this.userDetails.valid) {
      this.settingsService.updateDetails(reqBody).subscribe({
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

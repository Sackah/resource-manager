import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSideIllustrationComponent } from '../../../../auth/components/login-side-illustration/login-side-illustration.component';
import { validPhoneNumber } from '../../../../auth/validators/invalidphonenumber';
import {
  selectLogin,
  LoginState,
} from '../../../../auth/store/authorization/AuthReducers';
import { combineLatest } from 'rxjs';
import { AuthState } from '../../../../auth/types/auth-types';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../../auth/store/authorization/AuthActions';

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
  storeData!: LoginState;

  storeSubscription = this.store.select(selectLogin).subscribe({
    next: res => {
      this.storeData = res;
    },
  });

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.userDetails = new FormGroup({
      profilePicture: new FormControl(null),
      email: new FormControl(
        '',
        // {
        //   value: (this.storeData.success?.user as CurrentUser).email,
        //   disabled: false,
        // },
        [Validators.required, Validators.email]
      ),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),
      ]),
      phoneNumber: new FormControl('', [Validators.required, validPhoneNumber]),
      qualification: new FormControl('', [Validators.required]),
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

  getQualificationErrors(): string {
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

  submitForm(event: Event) {
    event.preventDefault();
    const userDetails = this.userDetails.value;

    if (this.userDetails.valid) {
      this.store.dispatch(AuthActions.updateUserDetails(userDetails));
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}
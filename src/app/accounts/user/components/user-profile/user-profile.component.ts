import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/auth/store/authorization/AuthReducers';
import { validPhoneNumber } from '@app/auth/validators/invalidphonenumber';
import {
  CurrentUser,
  Departments,
  InitialSig,
  Specializations,
  NameType,
} from '@app/shared/types/types';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.css',
    '../../pages/setting/setting.component.css',
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  userDetails: FormGroup = new FormGroup({
    refId: new FormControl('', [Validators.required]),
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
  });

  imgUrl = '../../../../../assets/images/user/profile-container-2.svg';

  user!: CurrentUser;

  disable = false;

  settingsSig = signal<InitialSig>({
    success: null,
    error: null,
    pending: false,
  });

  specializations!: Specializations[];

  departments!: Departments[];

  constructor(private store: Store, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.storeSubscription();
  }

  public storeSubscription() {
    const storeSub = this.store.select(selectCurrentUser).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
        this.setValues();
      },
    });

    this.subscriptions.push(storeSub);
  }

  getEmailErrors(): string {
    const control = this.userDetails.get('email');
    return control?.invalid && (control.dirty || control.touched)
      ? control.hasError('required')
        ? 'This field is required'
        : control.hasError('email')
        ? 'Please enter a valid email address'
        : ''
      : '';
  }

  getNameErrors(name: NameType) {
    const control = this.userDetails.get(name);
    return control?.invalid && (control.dirty || control.touched)
      ? control.hasError('required')
        ? 'This field is required'
        : control.hasError('pattern')
        ? 'Name can only contain letters and one space per word'
        : ''
      : '';
  }

  getNumberErrors() {
    const control = this.userDetails.get('phoneNumber');
    return control?.invalid && (control.dirty || control.touched)
      ? control.hasError('required')
        ? 'This field is required'
        : control.hasError('invalidPhoneNumber')
        ? 'The number field should be a valid phone number'
        : ''
      : '';
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const reader = new FileReader();

      reader.readAsDataURL(target.files[0]);
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        if (loadEvent.target?.result) {
          this.imgUrl = loadEvent.target.result as string;
          this.userDetails.patchValue({
            profilePicture: loadEvent.target.result,
          });
          this.imgUrl = loadEvent.target.result as string;
        }
      };
    }
  }

  setValues() {
    if (this.user) {
      this.userDetails.patchValue({
        refId: this.user.refId,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phoneNumber: this.user.phoneNumber,
        imgUrl: this.user.profilePicture,
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
      return;
    }

    const { firstName, lastName, phoneNumber, profilePicture } =
      this.userDetails.value;
    const reqBody = {
      refId: this.user.refId,
      firstName,
      lastName,
      phoneNumber,
      profilePicture,
      email: this.user.email,
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
            error: error.errors,
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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

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
import { SettingsService } from '@app/accounts/user/services/settings.service';
import { validPhoneNumber } from '@app/auth/validators/invalidphonenumber';
import { selectCurrentUser } from '@app/auth/store/authorization/AuthReducers';
import {
  CurrentUser,
  Departments,
  InitialSig,
  Specializations,
  NameType,
} from '@app/shared/types/types';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css',
})
export class AdminProfileComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public imgUrl = '../../../../../assets/images/user/profile-container-2.svg';

  public settingsSig = signal<InitialSig>({
    success: null,
    error: null,
    pending: false,
  });

  specializations!: Specializations[];

  departments!: Departments[];

  public userDetails: FormGroup = new FormGroup({
    refId: new FormControl('', [Validators.required]),
    profilePicture: new FormControl(null),
    email: new FormControl('', [Validators.required, Validators.email]),
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

  constructor(private store: Store, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.storeSubscription();
  }

  public storeSubscription() {
    const storeSub = this.store.select(selectCurrentUser).subscribe({
      next: user => {
        if (user) {
          this.setValues(user);
        }
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

  setValues(user: CurrentUser) {
    if (user) {
      this.userDetails.patchValue({
        refId: user.refId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        imgUrl: user.profilePicture,
      });
    }
  }

  get signalValues() {
    return this.settingsSig();
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.settingsSig.set({
      success: null,
      error: null,
      pending: true,
    });

    const { firstName, lastName, phoneNumber, refId, profilePicture, email } =
      this.userDetails.value;
    const reqBody = {
      refId,
      firstName,
      lastName,
      phoneNumber,
      profilePicture,
      email,
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

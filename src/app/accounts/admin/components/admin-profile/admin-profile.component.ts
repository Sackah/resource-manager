import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { SettingsService } from '../../../user/services/settings.service';
import { validPhoneNumber } from '../../../../auth/validators/invalidphonenumber';
import { selectCurrentUser } from '../../../../auth/store/authorization/AuthReducers';
import { Store } from '@ngrx/store';
import {
  CurrentUser,
  Departments,
  InitialSig,
  Specializations,
} from '../../../../shared/types/types';

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
  private settingsSig = signal<InitialSig>({
    success: null,
    error: null,
    pending: false,
  });
  specializations!: Specializations[];
  departments!: Departments[];

  public userDetails: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
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

  onFileChange(event: any) {
    if (event.target?.files.length > 0) {
      let reader = new FileReader();
      const file = event.target.files[0];

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };
    }
  }

  setValues(user: CurrentUser) {
    if (user) {
      this.userDetails.patchValue({
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        imgUrl: user.profilePicture,
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

    const { firstName, lastName, phoneNumber, userId } = this.userDetails.value;
    const reqBody = {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
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

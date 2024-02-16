import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as momentTimeZone from 'moment-timezone';
import intlTelInput from 'intl-tel-input';
import { NameType } from '@app/shared/types/types';
import { IPDataService } from '../../services/ipdata.service';
import { LoginSideIllustrationComponent } from '../../../../auth/components/login-side-illustration/login-side-illustration.component';
import { validPhoneNumber } from '../../../../auth/validators/invalidphonenumber';
import {
  selectLogin,
  LoginState,
} from '../../../../auth/store/authorization/AuthReducers';
import { AuthActions } from '../../../../auth/store/authorization/AuthActions';
import { GlobalInputComponent } from '../../../../shared/components/global-input/global-input.component';

@Component({
  selector: 'app-account-setup-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginSideIllustrationComponent,
    GlobalInputComponent,
  ],
  templateUrl: './account-setup-form.component.html',
  styleUrls: [
    './account-setup-form.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class AccountSetupFormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  userDetails: FormGroup = new FormGroup({
    profilePicture: new FormControl(null),
    email: new FormControl({ value: '', disabled: true }, [
      (Validators.required, Validators.email),
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
    location: new FormControl('', [Validators.required]),
    timeZone: new FormControl('', [Validators.required]),
  });

  imgUrl = '../../../../../assets/images/user/profile-container.svg';

  formData: FormData = new FormData();

  storeData!: LoginState;

  @Input() email!: string;

  @Input() refId!: string;

  public timezone = '';

  public timeZoneName = '';

  public selectedFile: File | null = null;

  timeZones = momentTimeZone.tz.names();

  constructor(
    private store: Store,
    private router: Router,
    private ipDataService: IPDataService
  ) {}

  ngOnInit(): void {
    this.fetchIPData();
    const storeSubscription = this.store.select(selectLogin).subscribe({
      next: res => {
        this.storeData = res;
      },
    });

    this.subscriptions.push(storeSubscription);

    this.userDetails.patchValue({});
    const InputElement = document.getElementById('phoneNumber');
    if (InputElement) {
      intlTelInput(InputElement, {
        initialCountry: 'ghana',
        separateDialCode: true,
        utilsScript:
          'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
      });
    }
  }

  fetchIPData(): void {
    this.ipDataService.getIPData().subscribe(data => {
      this.userDetails.patchValue({
        location: data.city,
        timeZone: data.time_zone,
      });
      this.timeZoneName = data.time_zone.name;
    });
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

  getLocationErrors() {
    const control = this.userDetails.get('location');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.userDetails.patchValue({
        profilePicture: this.selectedFile,
      });

      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        if (loadEvent.target?.result) {
          this.imgUrl = loadEvent.target.result as string;
        }
      };
    }
  }

  submitForm(event: Event) {
    event.preventDefault();
    const userDetails = this.userDetails.value;
    userDetails.email = this.email;
    userDetails.timeZone = this.timeZoneName;

    this.store.dispatch(AuthActions.updateUserDetails(userDetails));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

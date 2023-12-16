import { Component, OnInit } from '@angular/core';
import { InputFields, ResetService } from '../../services/reset.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'otp-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.css', '../../styles/styles.css'],
})
export class OtpFormComponent implements OnInit {
  otpForm!: FormGroup;
  nextFormField!: InputFields;

  constructor(private resetService: ResetService) {}

  ngOnInit(): void {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  getOtpErrors(): string {
    const control = this.otpForm.get('otp');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }

    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();

    //some condition
    this.nextFormField = 'changePassword';
    this.resetService.toggle(this.nextFormField);
  }
}

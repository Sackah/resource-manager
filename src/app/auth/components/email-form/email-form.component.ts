import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputFields, ResetService } from '../../services/reset.service';

@Component({
  selector: 'email-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css', '../../styles/styles.css'],
})
export class EmailFormComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  nextFormField!: InputFields;

  constructor(private resetService: ResetService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  getEmailErrors(): string {
    const control = this.forgotPasswordForm.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();
    if (this.forgotPasswordForm.valid) {
      this.nextFormField = 'otp';
      this.resetService.toggle(this.nextFormField);
    }
  }
}

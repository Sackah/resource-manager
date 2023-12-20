import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-usercreation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usercreation.component.html',
  styleUrl: './usercreation.component.css',
})
export class UsercreationComponent {
  formData: FormGroup;
  loading = false;
  success = false;
  error = false;
  errorMessages: { roles?: string; email?: string } = {};

  constructor(
    private router: Router,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.formData = this.fb.group({
      roles: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onUserCreate() {
    // Reset states
    this.loading = false;
    this.success = false;
    this.error = false;
    this.errorMessages = {};

    // Check if the form is valid
    if (this.formData.valid) {
      // Set loading state
      this.loading = true;

      // Call the service method to make the POST request
      this.adminService
        .addNew(this.formData.value)
        .pipe(
          finalize(() => {
            // Reset loading state after request completes (success or error)
            this.loading = false;
          })
        )
        .subscribe(
          response => {
            // Handle success
            console.log('Post request successful', response);

            // Set success state
            this.success = true;

            // Redirect or perform other actions as needed
            // this.exitPage();
          },
          error => {
            // Handle error
            console.error('Error in post request', error);

            // Set error state
            this.error = true;

            // Display error messages from the server
            if (error.error && typeof error.error === 'object') {
              this.errorMessages = error.error;
            }
          }
        );
    } else {
      // Handle form validation errors if needed
      console.error('Form is not valid');
    }
  }

  exitPage() {
    this.router.navigate(['/admin/admin-dashboard']);
  }
}

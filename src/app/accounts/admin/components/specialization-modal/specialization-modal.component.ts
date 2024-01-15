import { Component, EventEmitter, Output, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SpecializationService } from '../../services/specialization.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-specialization-modal',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './specialization-modal.component.html',
  styleUrls: ['./specialization-modal.component.css'],
})
export class SpecializationModalComponent {
  @Output() saveSpecialization = new EventEmitter<string>();
  @Input() formGroup!: FormGroup;
  modalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService
  ) {
    this.modalForm = this.fb.group({
      newSpecialization: ['', Validators.required],
    });
  }

  onSave() {
    if (this.modalForm.valid) {
      const newSpecialization = this.modalForm.value.newSpecialization;

      this.specializationService
        .addSpecialization(newSpecialization)
        .subscribe({
          next: (response: ResponseType) => {
            console.log(response);
            console.log(
              'New specialization added to the backend:',
              newSpecialization
            );
            this.saveSpecialization.emit(newSpecialization);
            this.closeModal();
          },
          error: err => {
            console.error('Error adding specialization to the backend:', err);
          },
        });
    }
  }
  fetchSpecializations() {
    this.specializationService.getSpecializations().subscribe({
      next: (specializations: string[]) => {
        console.log(
          'Fetched specializations from the backend:',
          specializations
        );
      },
      error: err => {
        console.error('Error fetching specializations from the backend:', err);
      },
      complete: () => {},
    });
  }

  closeModal() {}
}

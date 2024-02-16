import { Component, EventEmitter, Output, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../../accounts/admin/services/department.service';
import { GenericResponse } from '../../../types/types';

@Component({
  selector: 'app-department-modal',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.css'],
})
export class DepartmentModalComponent {
  @Output() saveDepartment = new EventEmitter<string>();

  @Input() formGroup!: FormGroup;

  @Input() isOpen = true;

  public departmentStoringError: string = '';

  modalForm: FormGroup;

  constructor(
    private fb: FormBuilder,

    private departmentService: DepartmentService
  ) {
    this.modalForm = this.fb.group({
      newDepartment: ['', Validators.required],
    });
  }

  public onSaveDepartment() {
    if (this.modalForm.valid) {
      const { newDepartment } = this.modalForm.value;

      this.departmentService.addDepartment(newDepartment).subscribe(
        (response: GenericResponse) => {
          response;
          this.saveDepartment.emit(newDepartment);
          this.closeModal();
        },
        err => {
          this.handleDepartmentStoringError(err);
        }
      );
    }
  }

  public clearErrorMessagesAfterDelay() {
    setTimeout(() => {
      this.departmentStoringError = '';
    }, 3000);
  }

  private handleDepartmentStoringError(error: GenericResponse) {
    if (error.status === 404) {
      this.departmentStoringError = 'Unable to save new department';
    } else {
      this.departmentStoringError = 'Please try again or contact IT support';
    }
    this.clearErrorMessagesAfterDelay();
  }

  public fetchDepartments() {
    this.departmentService.getDepartments().subscribe(
      (departments: string[]) => {
        departments;
      },
      err => {
        err;
      }
    );
  }

  public closeModal() {
    this.isOpen = false;
  }
}

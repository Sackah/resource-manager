import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../../../admin/services/admin.service';
import { SpecializationService } from '../../../admin/services/specialization.service';
import { SpecializationModalComponent } from '../../../../shared/components/modals/specialization-modal/specialization-modal.component';
import { DepartmentModalComponent } from '../../../../shared/components/modals/department-modal/department-modal.component';
import { DepartmentService } from '../../../admin/services/department.service';
import { GenericResponse } from '../../../../shared/types/types';

@Component({
  selector: 'app-manager-usercreation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpecializationModalComponent,
    DepartmentModalComponent,
  ],
  templateUrl: './manager-usercreation.component.html',
  styleUrl: './manager-usercreation.component.css',
})
export class ManagerUsercreationComponent {
  @Input() isOpen = true;

  @Output() userCreated: EventEmitter<void> = new EventEmitter<void>();

  public specializationModalOpen = false;

  public departmentModalOpen = false;

  public formInvalidMessage = '';

  public nullFormControlMessage = '';

  formData: FormGroup;

  public loading = false;

  public success = false;

  public error = false;

  public errorMessagesForRolesandEmails: { roles?: string; email?: string } =
    {};

  public selectedDepartment = '';

  public selectedSpecialization = '';

  public selectedRoles = '';

  public errorMessage = '';

  public specializationsErrorMessage = '';

  public deparmentsErrorMessage = '';

  public successMessage = '';

  public specializationDropdownOpen = false;

  public rolesDropdownOpen = false;

  public departmentDropdownOpen = false;

  public specializations: string[] = [];

  public department: string[] = [];

  public roles = [];

  constructor(
    private adminService: AdminService,
    private specializationService: SpecializationService,
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.formData = this.fb.group({
      roles: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialization: ['', Validators.required],
      department: ['', Validators.required],
      role: [''],
      skills: [''],
      bookable: [false],
    });

    this.specializationService.specializations$.subscribe(
      (specializations: string[]) => {
        this.specializations = specializations;
      }
    );

    this.departmentService.departments$.subscribe((departments: string[]) => {
      this.department = departments;
    });
  }

  public SpecializationDropdown() {
    this.specializationDropdownOpen = false;
  }

  public DepartmentDropdown() {
    this.departmentDropdownOpen = false;
  }

  private rolesDropdown() {
    this.rolesDropdownOpen = false;
  }

  selectDepartment(department: string) {
    const departmentControl = this.formData.get('department');
    if (departmentControl) {
      departmentControl.setValue(department);
      this.selectedDepartment = department;
      this.DepartmentDropdown();
    }
  }

  selectRole(role: string) {
    const rolesControl = this.formData.get('roles');
    if (rolesControl) {
      rolesControl.setValue(role);
      this.selectedRoles = role;
      this.rolesDropdown();
    }
  }

  toggleSpecializationDropdown() {
    this.specializationDropdownOpen = !this.specializationDropdownOpen;
  }

  toggleDepartmentDropdown() {
    this.departmentDropdownOpen = !this.departmentDropdownOpen;
  }

  toggleRolesDropdown() {
    this.rolesDropdownOpen = !this.rolesDropdownOpen;
  }

  selectOption() {
    this.SpecializationDropdown();
    this.DepartmentDropdown();
    this.rolesDropdown();
  }

  selectSpecialization(specialization: string) {
    const specializationControl = this.formData.get('specialization');
    if (specializationControl) {
      specializationControl.setValue(specialization);
      this.selectedSpecialization = specialization;
      this.SpecializationDropdown();
    }
  }

  onSpecializationChange(event: Event) {
    const selectedValue = (event.target as HTMLInputElement).value;
    if (selectedValue === 'add_new_specialization') {
      this.openSpecializationModal();
    }
  }

  openSpecializationModal() {
    this.specializationModalOpen = true;
  }

  handleAddSpecialization(newSpecializationEvent: string) {
    if (typeof newSpecializationEvent === 'string') {
      const newSpecialization = newSpecializationEvent;
      this.updateSpecializationDropdown(newSpecialization);
      this.fetchSpecializations();
    }
  }

  updateSpecializationDropdown(newSpecialization: string) {
    const specializationControl = this.formData.get('specialization');

    if (specializationControl) {
      const updatedSpecializations = [
        ...this.specializations,
        newSpecialization,
      ];
      this.specializationService.setSpecializations(updatedSpecializations);
      specializationControl.setValue(newSpecialization);
    } else {
      this.nullFormControlMessage = 'Please enter a specialization';
    }
  }

  private fetchSpecializations() {
    this.specializationService.getSpecializations().subscribe(
      (specializations: string[]) => {
        this.specializations = specializations;
      },
      err => {
        this.handleSpecializationFetchError(err);
      }
    );
  }

  onDepartmentChange(event: Event) {
    const selectedValue = (event.target as HTMLInputElement).value;
    if (selectedValue === 'add_new_department') {
      this.openDepartmentModal();
    }
  }

  openDepartmentModal() {
    this.departmentModalOpen = true;
  }

  handleAddDepartment(newDepartmentEvent: string) {
    if (typeof newDepartmentEvent === 'string') {
      const newDepartment = newDepartmentEvent;

      this.updateDepartmentDropdown(newDepartment);

      this.fetchDepartments();
    }
  }

  updateDepartmentDropdown(newDepartment: string) {
    const departmentControl = this.formData.get('department');
    if (departmentControl) {
      const updatedDepartments = [...this.department, newDepartment];
      this.departmentService.setDepartments(updatedDepartments);
      departmentControl.setValue(newDepartment);
    } else {
      this.nullFormControlMessage = 'Please enter a department';
    }
  }

  fetchDepartments() {
    this.departmentService.getDepartments().subscribe(
      (departments: string[]) => {
        this.department = departments;
      },
      err => {
        this.handleDepartmentFetchError(err);
      }
    );
  }

  clearErrorMessagesAfterDelay() {
    setTimeout(() => {
      this.errorMessage = 'null';
      this.specializationsErrorMessage = 'null';
      this.deparmentsErrorMessage = 'null';
      this.formInvalidMessage = 'null';
      this.nullFormControlMessage = 'null';
    }, 3000);
  }

  private handleDepartmentFetchError(error: GenericResponse) {
    if (error.status === 404) {
      this.deparmentsErrorMessage =
        'Unable to process new department added. Please try again';
    } else {
      this.deparmentsErrorMessage = 'Please try again or contact IT support';
    }
    this.clearErrorMessagesAfterDelay();
  }

  private handleSpecializationFetchError(error: GenericResponse) {
    if (error.status === 404) {
      this.specializationsErrorMessage =
        'Unable to process new specialization added. Please try again';
    } else {
      this.specializationsErrorMessage =
        'Please try again or contact IT support';
    }
    this.clearErrorMessagesAfterDelay();
  }

  onUserCreate() {
    this.loading = false;
    this.success = false;
    this.error = false;
    this.errorMessagesForRolesandEmails = {};

    if (this.formData.valid) {
      this.loading = true;

      this.adminService
        .addNewUser(this.formData.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          response => {
            this.success = true;
            response;
            this.successMessage = 'User created successfully!';
            this.userCreated.emit();
          },
          error => {
            this.error = true;

            if (error.error && typeof error.error === 'object') {
              this.errorMessagesForRolesandEmails = error.error;
            }
            if (error.status === 400) {
              this.errorMessage = '  User with this email already exists';
            } else if (error.status === 401) {
              this.errorMessage =
                '  Unauthorized. Please log in as an Admin or Manager.';
            } else if (error.status === 403) {
              this.errorMessage =
                '  You do not have the necessary permission to perfom this task.';
            } else if (error.status === 404) {
              this.errorMessage =
                '  Resource not found, please contact IT support.';
            } else if (error.status >= 500) {
              this.errorMessage = '  Server error. Please try again later.';
            } else {
              this.errorMessage = '  An error occurred. Please try again.';
            }
            this.clearErrorMessagesAfterDelay();
          }
        );
    } else {
      this.formInvalidMessage =
        'Please complete the form or enter valid inputs';
      this.clearErrorMessagesAfterDelay();
    }
  }

  closeUsercreationModal() {
    this.isOpen = false;
  }
}

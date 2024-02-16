import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { SettingsService } from '../../../../accounts/user/services/settings.service';
import {
  User,
  Specializations,
  Skills,
  Departments,
  NameType,
} from '../../../types/types';
import { UserListService } from '../../../../accounts/admin/components/user-list/user-list.service';
import { UsersService } from '../../../../accounts/admin/services/users.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css',
})
export class EditUserModalComponent implements OnInit, OnDestroy {
  public user!: User;

  public subscriptions: Subscription[] = [];

  public specializations!: Specializations[];

  public departments!: Departments[];

  public skills: Skills[] = [];

  public isLoading = false;

  public successMessage: string | null = null;

  public errorMessage: string | null = null;

  @Output() closeEvent = new EventEmitter<void>();

  @Output() submitEvent = new EventEmitter<void>();

  private opening = false;

  private closed = false;

  public rolesDropdownOpen = false;

  public selectedRoles = '';

  public selectedDepartment = '';

  public selectedSpecialization = '';

  public specializationDropdownOpen = false;

  public departmentDropdownOpen = false;

  userDetails: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: [
      '',
      [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$')],
    ],
    lastName: [
      '',
      [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$')],
    ],

    skills: ['', [Validators.required]],
    department: ['', [Validators.required]],
    specialization: ['', [Validators.required]],
    roles: ['', [Validators.required]],
    bookable: [false],
  });

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private settingsService: SettingsService,
    private userListService: UserListService
  ) {}

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.setValues();
    this.fetchSpecializations();
    this.fetchDepartments();
  }

  public getSpecializationErrors(): string {
    const control = this.userDetails.get('specialization');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  public getDepartmentErrors(): string {
    const control = this.userDetails.get('department');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  public getEmailErrors(): string {
    const control = this.userDetails.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
      if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  public getNameErrors(name: NameType) {
    const control = this.userDetails.get(name);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
      if (control.hasError('pattern')) {
        return 'Name can only contain letters and one space per word';
      }
    }

    return '';
  }

  public getSkillsError(): string {
    const control = this.userDetails.get('skills');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  fetchSpecializations(): void {
    this.settingsService
      .getSpecializations()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: res => {
          this.specializations = res;
        },
      });
  }

  fetchDepartments(): void {
    this.settingsService
      .getDepartments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: res => {
          this.departments = res;
        },
      });
  }

  public rolesDropdown() {
    this.rolesDropdownOpen = false;
  }

  public toggleRolesDropdown() {
    this.rolesDropdownOpen = !this.rolesDropdownOpen;
  }

  public selectRole(role: string) {
    const rolesControl = this.userDetails.get('roles');
    if (rolesControl) {
      rolesControl.setValue(role);
      this.selectedRoles = role;
      this.rolesDropdown();
    }
  }

  public departmentDropdown() {
    this.departmentDropdownOpen = false;
  }

  public toggleDepartmentDropdown() {
    this.departmentDropdownOpen = !this.departmentDropdownOpen;
  }

  public selectDepartment(department: string) {
    const departmentControl = this.userDetails.get('department');
    if (departmentControl) {
      departmentControl.setValue(department);
      this.selectedDepartment = department;
      this.departmentDropdown();
    }
  }

  close() {
    this.closed = true;
    this.closeEvent.emit();
    this.userListService.refreshUsers();
  }

  open() {
    this.opening = true;
  }

  setValues() {
    if (this.user) {
      this.userDetails.patchValue({
        refId: this.user.refId ? this.user.refId : '',
        email: this.user.email ? this.user.email : '',
        firstName: this.user.firstName ? this.user.firstName : '',
        lastName: this.user.lastName ? this.user.lastName : '',

        department: this.user.department ? this.user.department : '',
        specialization:
          this.user.specializations.length > 0 && this.user.specializations[0]
            ? this.user.specializations[0].name
            : [],
        roles: this.user.role ? this.user.role : '',
        bookable: this.user.bookable ? this.user.bookable : '',
        phoneNumber: this.user.phoneNumber ? this.user.phoneNumber : '',
      });
    }
  }

  public submitForm() {
    this.isLoading = true;
    if (!this.user) {
      return;
    }

    const {
      firstName,
      lastName,
      email,
      specialization,
      department,
      roles,
      skills,
      bookable,
    } = this.userDetails.value;
    const reqBody = {
      refId: this.user.refId,
      phoneNumber: this.user.phoneNumber,
      firstName,
      lastName,
      email,
      department,
      specialization,
      roles,
      skills,
      bookable,
    };

    this.usersService.updateDetails(reqBody).subscribe({
      next: response => {
        if (response && response.message) {
          this.closeEvent.emit();
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = null;
          }, 10000);
        }
      },
      error: () => {
        this.errorMessage =
          'Server Error: Could not edit user, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 10000);
      },
    });
  }

  get modalClasses() {
    return {
      modal: true,
      opening: this.opening,
      closed: this.closed,
    };
  }

  get backdropClasses() {
    return {
      backdrop: true,
      opening: this.opening,
      closed: this.closed,
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

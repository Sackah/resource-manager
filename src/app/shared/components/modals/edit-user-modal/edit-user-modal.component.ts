import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../../accounts/user/services/settings.service';
import {
  User,
  InitialSig,
  Specializations,
  Skills,
  Departments,
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
export class EditUserModalComponent implements OnInit {
  user!: User;
  subscriptions: Subscription[] = [];
  specializations!: Specializations[];
  departments!: Departments[];
  skills: Skills[] = [];
  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  // settingsSig = signal<InitialSig>({
  //   success: null,
  //   error: null,
  //   pending: false,
  // });

  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();
  opening = false;
  closed = false;
  rolesDropdownOpen = false;
  selectedRoles: string = '';
  selectedDepartment: string = '';
  selectedSpecialization: string = '';
  specializationDropdownOpen = false;
  departmentDropdownOpen = false;
  imgUrl = '../../../../../assets/images/user/profile-container.svg';
  userDetails: FormGroup = this.fb.group({
    profilePicture: [null],
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

  ngOnInit(): void {
    this.setValues();
  }

  getSpecializationErrors(): string {
    const control = this.userDetails.get('specialization');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  getDepartmentErrors(): string {
    const control = this.userDetails.get('department');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
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

  getSkillsError(): string {
    const control = this.userDetails.get('skills');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  specSub = this.settingsService.getSpecializations().subscribe({
    next: (res: any) => {
      this.specializations = res;
    },
  });

  departmentSub = this.settingsService.getDepartments().subscribe({
    next: (res: any) => {
      this.departments = res;
    },
  });

  rolesDropdown() {
    this.rolesDropdownOpen = false;
  }

  toggleRolesDropdown() {
    this.rolesDropdownOpen = !this.rolesDropdownOpen;
  }

  selectRole(role: string) {
    const rolesControl = this.userDetails.get('roles');
    if (rolesControl) {
      rolesControl.setValue(role);
      this.selectedRoles = role;
      this.rolesDropdown();
    }
  }

  departmentDropdown() {
    this.departmentDropdownOpen = false;
  }

  toggleDepartmentDropdown() {
    this.departmentDropdownOpen = !this.departmentDropdownOpen;
  }

  selectDepartment(department: string) {
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
        userId: this.user.userId ? this.user.userId : '',
        email: this.user.email ? this.user.email : '',
        firstName: this.user.firstName ? this.user.firstName : '',
        lastName: this.user.lastName ? this.user.lastName : '',
        imgUrl: this.user.profilePicture ? this.user.profilePicture : '',
        // skills:
        //   this.user.skills.length > 0 && this.user.skills
        //     ? this.user.skills[0].name
        //     : [],
        department: this.user.department ? this.user.department : '',
        specialization:
          this.user.specializations.length > 0 && this.user.specializations[0]
            ? this.user.specializations[0].name
            : [],
        roles: this.user.roles ? this.user.roles : '',
        bookable: this.user.bookable ? this.user.bookable : '',
        phoneNumber: this.user.phoneNumber ? this.user.phoneNumber : '',
      });
    }
  }

  // get signalValues() {
  //   const val = this.settingsSig();
  //   return val;
  // }

  onFileChange(event: any) {
    if (event.target?.files.length > 0) {
      let reader = new FileReader();
      const file = event.target.files[0];

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };

      this.userDetails.patchValue({
        profilePicture: file,
      });
    }
  }

  submitForm() {
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
      userId: this.user.userId,
      phoneNumber: this.user.phoneNumber,
      firstName: firstName,
      lastName: lastName,
      email: email,
      department: department,
      specialization: specialization,
      roles: roles,
      skills: skills,
      imgUrl: this.user.profilePicture,
      bookable: bookable,
    };

    if (this.userDetails.valid) {
      this.usersService.updateDetails(reqBody).subscribe({
        next: response => {
          if (response && response.message) {
            this.closeEvent.emit();
            this.successMessage = response.message;
            setTimeout(() => {
              this.successMessage = null;
            }, 1000);
          }
        },
        error: () => {
          (this.errorMessage =
            'Server Error: Could not edit user, please try again later.'),
            setTimeout(() => {
              this.errorMessage = null;
            }, 1000);
        },
      });
    }
  }
  get modalClasses() {
    return {
      [`modal`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }

  get backdropClasses() {
    return {
      [`backdrop`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }
}
